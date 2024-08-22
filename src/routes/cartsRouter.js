import { Router } from 'express';

import CartService from '../services/cartService.js';
import authRedirect from "../middlewares/authRedirect.js";

const router = Router();

router.get('/', authRedirect, async (req, res) => {
    try {
        // Obtener el carrito del usuario logueado
        const userId = req.session.user._id;
        const cart = await CartService.getCartByUserId(userId);
        
        if (!cart) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontró un carrito para el usuario.'
            });
        }

        // Renderizar la vista del carrito con los productos
        const result = await CartService.getProductsFromCartByID(cart._id);
        res.render("cart", {
            cartId: cart._id,
            products: result
        });
    } catch (error) {
        console.error("Error al obtener el carrito del usuario:", error.message);
        res.status(500).send({
            status: 'error',
            message: 'Error al obtener el carrito. Prueba más tarde.'
        });
    }
});


router.get('/:cid', authRedirect, async (req, res) => {
    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid);
        res.render("cart", {
            cartId: req.params.cid,
            products: result
        });
    } catch (error) {
        console.error("Error al obtener productos del carrito:", error.message);
        res.status(500).send({
            status: 'error',
            message: 'Error al obtener productos del carrito. Prueba más tarde.'
        });
    }
});

export default router;
