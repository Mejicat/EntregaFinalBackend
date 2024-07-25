import { Router } from "express";

import jwtAuth from '../middlewares/jwtAuth.js';
import checkProductOwnership from "../middlewares/checkProductOwnership.js";
import CartService from "../services/cartService.js";
import ProductService from "../services/productService.js";
import TicketService from "../services/ticketService.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.post('/', jwtAuth, async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await CartService.addCart(userId);
    res.status(201).send({ status: 'success', message: 'carrito creado', cart });
  } catch (error) {
    next(error);
  }
});

router.get('/:cid', jwtAuth, isAdmin, async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartService.getCart(cartId);
    res.status(200).send({ status: 'success', message: 'carrito encontrado', cart });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

router.get('/', jwtAuth, isAdmin, async (req, res) => {
  try {
    const carts = await CartService.getAllCarts();
    res.status(200).send({status:'success', message:'carritos encontrados', carts});
  } catch(error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.post('/:cid/products/:pid', jwtAuth, checkProductOwnership, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const userId = req.user._id;

  try {
    const cart = await CartService.getCart(cartId);

    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para agregar productos a este carrito'})
    }

    const quantity = +req.body.quantity || 1;
    if (quantity) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).send({ status: 'error', error: 'Invalid quantity' });
      }
    }

    const response = await CartService.addProductToCart(cartId, productId, quantity);
    res.status(201).send({status:'success', message:`producto ${productId} agregado al carrito`, response});
  } catch (error){
    res.status(400).send({status:'error', message: error.message})
  }
})

router.put('/:cid/products/:pid', jwtAuth, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = +req.body.quantity;
  const userId = req.user._id;
  
  try {
    const cart = await CartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para modificar este carrito'})
    }
    
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).send({ status: 'error', error: 'Invalid quantity' });
    }

    const response = await CartService.updateProductQuantity(cartId, productId, quantity);
    res.status(200).send({status:'success', message:'cantidad de producto actualizada', response});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete("/:cid", jwtAuth, async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.user._id;

  try {
    const cart = await CartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para eliminar este carrito'})
    }

    const response = await CartService.deleteAllProductsFromCart(cartId);
    res.status(200).send({status:'success', message:'carrito eliminado', response});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete("/:cid/products/:pid", jwtAuth, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const userId = req.user._id;

  try {
    const cart = await CartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para eliminar productos de este carrito'})
    }
    
    const deletedCart = await CartService.deleteProductFromCart(cartId, productId);
    res.status(200).send({status:'success', message:`producto eliminado del carrito`});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.post('/:cid/purchase', jwtAuth, async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.user._id;

  try {
    const cart = await CartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para comprar este carrito'});
    }
    if (!cart.products.length) {
      return res.status(400).send({status:'error', message:'No hay productos en el carrito'});
    }

    let itemsRemoved = [];
    for (let item of cart.products) {
      const product = await ProductService.getProductById(item.product._id);
      if (product.stock < item.quantity) {
        itemsRemoved.push(item);
        await CartService.deleteProductFromCart(cartId, item.product._id);
      }
    }
    const currentCart = await CartService.getCart(cartId);
   
    let totalAmount = 0;
    for (let item of currentCart.products) {
      totalAmount += item.product.price * item.quantity;
    }

    for (let item of currentCart.products) {
      await ProductService.updateProduct(item.product._id, { stock: item.product.stock - item.quantity });
    }

    let code = 0;
    let tickets = await TicketService.getAllTickets(); // Cambiar getTickets a getAllTickets en ticketService
    if (tickets.length) {
      code = +tickets[tickets.length - 1].code + 1;
    }

    //Generación del ticket
    const ticket = await TicketService.createTicket({ code, amount: totalAmount, products: currentCart.products, purchaser: userId });
    await CartService.deleteAllProductsFromCart(cartId);

    //Si había productos sin stock, los agregamos nuevamente al carrito después de la compra
    if (itemsRemoved.length > 0) {
      for (let item of itemsRemoved) {
        await CartService.addProductToCart(cartId, item.product._id, item.quantity);
      }
    }
    //Mostramos el ticket de compra, o los productos sin stock
    res.status(200).send({status:'success', message:'compra realizada', ticket, itemsRemoved});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message, error: error})
  }
})

export default router;


