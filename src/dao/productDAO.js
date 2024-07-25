import productModel from './models/productModel.js';

class ProductDAO {
    static instance = null;

    constructor() {
        if (!ProductDAO.instance) {
            ProductDAO.instance = this;
        }
        return ProductDAO.instance;
    }

    static getInstance() {
        if (!ProductDAO.instance) {
            ProductDAO.instance = new ProductDAO();
        }
        return ProductDAO.instance;
    }

    async getProducts(limit, page, query, sort) {
        try {
            const result = await productModel.paginate(query, { limit, page, sort, lean: true });
            return result.docs; // Retorna solo el array de productos
        } catch (error) {
            console.error(`Error al buscar los productos: ${error.message}`);
            throw new Error("Error al buscar los productos");
        }
    }
    
    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id });

            if (!product) throw new Error(`El producto ${id} no existe!`);

            return product;
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${id}: ${error.message}`);
            throw new Error(`Error al obtener el producto con ID ${id}`);
        }
    }

    async addProducts(productData, user) {
        const { title, description, code, price, stock, category, thumbnails } = productData;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto');
        }

        try {
            const owner = user.role === 'premium' ? user.email : 'admin';
            const result = await productModel.create({ title, description, code, price, stock, category, thumbnails: thumbnails ?? [], owner });
            return result;
        } catch (error) {
            console.error(`Error al crear el producto: ${error.message}`);
            throw new Error('Error al crear el producto');
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            const result = await productModel.updateOne({ _id: id }, productUpdate);

            if (result.nModified === 0) throw new Error(`No se encontró el producto ${id} para actualizar`);

            return result;
        } catch (error) {
            console.error(`Error al actualizar el producto ${id}: ${error.message}`);
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.deleteOne({ _id: id });

            if (result.deletedCount === 0) throw new Error(`El producto ${id} no existe!`);

            return result;
        } catch (error) {
            console.error(`Error al eliminar el producto ${id}: ${error.message}`);
            throw new Error(`Error al eliminar el producto ${id}`);
        }
    }
}

export default ProductDAO;
