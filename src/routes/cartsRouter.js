import { Router } from 'express';

import CartService from '../services/cartService.js';
import authRedirect from "../middlewares/authRedirect.js";

const router = Router();

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
