import { Router } from 'express';

import ProductService from "../services/productService.js";
import authRedirect from "../middlewares/authRedirect.js";
import isPremium from "../middlewares/isPremium.js";
import checkPremiumOwner from "../middlewares/checkPremiumOwner.js";

const router = Router()
router.get('/', authRedirect, async (req, res) => {
    try {
      const limit = +req.query.limit || 10;
      const page = +req.query.page || 1;
      const { query = null, sort = null } = req.query;
  
      if (query) {
        query = JSON.parse(query);
      }
      if (sort) {
        sort = JSON.parse(sort)
      }
  
      const products = await ProductService.getProducts(limit, page, query, sort);
      res.render(
        "products",
        {
        status: 'success',
        user: req.session.user,
        products: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.prevPage ? `/products?${query ? `query=${encodeURIComponent(JSON.stringify(query))}` : ''}${limit ? `&limit=${limit}` : ''}${sort ? `&sort=${encodeURIComponent(JSON.stringify(sort))}` : ''}&page=${products.prevPage}` : null,
        nextLink: products.nextPage ? `/products?${query ? `query=${encodeURIComponent(JSON.stringify(query))}` : ''}${limit ? `&limit=${limit}` : ''}${sort ? `&sort=${encodeURIComponent(JSON.stringify(sort))}` : ''}&page=${products.nextPage}` : null,
        limit, 
        page,
        query,
        sort
      })
    } catch (error) {
      res.status(400).send({status: 'error', message: error.message})
    }
  })
  
  router.get('/add', authRedirect, isPremium, async (req, res) => {
    try {
      res.render(
        "addProduct",
        {
        }
      )
    } catch (error) {
      res.status(400).send({status: 'error', message: error.message})
    }
  })

  router.post('/add', authRedirect, isPremium, async (req, res) => {
    const productData = req.body;
    try {
      const user = req.user;
      const product = await ProductService.addProduct(productData, user);
      res.status(201).send({ status: 'success', message: 'Producto agregado', product });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  });
  
  router.get('/:pid', authRedirect, async (req, res) => {
    const productId = req.params.pid
    try {
      const product = await ProductService.getProductById(productId)
      res.render(
        "product",
        {
          title: product.title,
          product: product
        })
    } catch (error) {
      res.status(400).send({status: 'error', message: error.message})
    }
  })

  router.delete('/:pid', authRedirect, checkPremiumOwner, async (req, res) => {
    const productId = req.params.pid;
    try {
        await ProductService.deleteProduct(productId);
        res.status(200).send({ status: 'success', message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});
  
  export default router