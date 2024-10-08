import productModel from '../dao/models/productModel.js';

const checkOwnerOrAdmin = async (req, res, next) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        const user = req.user;

        if (user.role !== 'admin' && product.owner !== user.email) {
            return res.status(403).send({
                status: 'error',
                message: 'No tienes permiso para realizar esta acción'
            });
        }

        next();
    } catch (error) {
        console.error(`Error al verificar el propietario o administrador: ${error.message}`);
        res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

export default checkOwnerOrAdmin;
