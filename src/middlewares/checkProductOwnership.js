import productModel from '../dao/models/productModel.js';

const checkProductOwnership = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        const user = req.user;

        if (user.role === 'premium' && product.owner === user.email) {
            return res.status(403).send({
                status: 'error',
                message: 'No puedes agregar a tu carrito un producto que te pertenece'
            });
        }

        next();
    } catch (error) {
        console.error(`Error al verificar la propiedad del producto: ${error.message}`);
        res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

export default checkProductOwnership;
