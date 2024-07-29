import express from 'express';

import ProductService from "../services/productService.js";
import jwtAuth from '../middlewares/jwtAuth.js';
import isAdmin from "../middlewares/isAdmin.js";
import CustomError from '../services/errors/CustomError.js';
import { generateProductErrorInfo } from '../services/errors/info.js';
import { ErrorCodes } from '../services/errors/enums.js';

const router = express.Router();

router.get('/', jwtAuth, async (req, res, next) => {
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    let { query = null, sort = null } = req.query;
  
    if (query) {
      query = JSON.parse(query);
    }
    if (sort) {
      sort = JSON.parse(sort);
    }
  
    try {
      const products = await ProductService.getProducts(limit, page, query, sort);
      res.status(200).send({ status: 'success', message: 'productos encontrados', products });
    } catch (error) {
      next(error);
    }
  });
  
  router.get('/:productId', jwtAuth, async (req, res, next) => {
    const productId = req.params.productId;
  
    try {
      const product = await ProductService.getProductById(productId);
      res.status(200).send({ status: 'success', message: 'producto encontrado', product });
    } catch (error) {
      next(error);
    }
  });
  
  router.post('/', jwtAuth, isAdmin, async (req, res, next) => {
    const { title, description, code, category, thumbnails } = req.body.product;
    const price = +req.body.product.price;
    const stock = +req.body.product.stock;
  
    if (!title || !description || !code || price == null || stock == null || !category || !thumbnails) {
      CustomError.createError({
        name: 'Product creation error',
        cause: generateProductErrorInfo(req.body.product),
        message: 'Faltan datos para crear el producto',
        code: ErrorCodes.MISSING_DATA_ERROR
      });
    }
  
    if (typeof price !== 'number' || typeof stock !== 'number') {
      return res.status(400).send({
        status: 'error',
        message: 'price y stock deben ser números'
      });
    }
  
    if (price < 0 || stock < 0) {
      return res.status(400).send({
        status: 'error',
        message: 'price y stock deben ser mayores a 0'
      });
    }
  
    try {
      const product = await ProductService.addProduct({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
      });
      res.status(201).send({ status: 'success', message: 'producto agregado', product });
    } catch (error) {
      next(error);
    }
  });

router.put('/:productId', jwtAuth, isAdmin, async (req, res, next) => {
    const productId = req.params.productId;
    const productData = req.body;

    if (!productData) {
        CustomError.createError({
            name: 'Product update error',
            cause: generateProductErrorInfo(productData),
            message: 'Faltan datos para actualizar el producto',
            code: ErrorCodes.MISSING_DATA_ERROR
        });
    }

    if (typeof productData.price !== 'number' || typeof productData.stock !== 'number') {
        CustomError.createError({
            name: 'Product update error',
            cause: generateProductErrorInfo(productData),
            message: 'price y stock deben ser números',
            code: ErrorCodes.INVALID_TYPES_ERROR
        });
    }

    try {
        const product = await ProductService.updateProduct(productId, productData);
        res.status(200).send({ status: 'success', message: 'producto actualizado', product });
    } catch (error) {
        next(error);
    }
});

router.delete('/:productId', jwtAuth, isAdmin, async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await ProductService.deleteProduct(productId);
        res.status(200).send({ status: 'success', message: 'producto eliminado', product });
    } catch (error) {
        next(error);
    }
});

router.get('/mockingproducts', async (req, res, next) => {
    try {
        const mockProducts = generateMockProducts();
        res.status(200).send({ status: 'success', message: 'Mock products generated', products: mockProducts });
    } catch (error) {
        next(error);
    }
});

export default router;
