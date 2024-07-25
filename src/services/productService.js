import { productRepository } from "../repositories/index.js";
import ProductDTO from "../dao/dto/productDTO.js";

class ProductService {

    async getProducts(limit, page, query, sort) {
        const products = await productRepository.getAllProducts(limit, page, query, sort);
        if (!products) {
            throw new Error("No se encontraron productos");
        }
        return products;
    }

    async getProductById(id) {
        try {
            const product = await productRepository.getProductById(id);
            if (!product) {
                throw new Error("Product not found");
            }
            return new ProductDTO(product);
        } catch (error) {
            throw error;
        }
    }

    async addProduct(productData, user) {
        try {
            const product = await productRepository.createProduct(productData, user);
            if (!product) {
                throw new Error("Error al agregar producto");
            }
            return new ProductDTO(product);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await productRepository.updateProduct(id, updatedFields);
            if (!product) {
                throw new Error("Error al actualizar el producto");
            }
            return new ProductDTO(product);
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productRepository.deleteProduct(id);
            if (!product) {
                throw new Error("Error al borrar el producto");
            }
            return new ProductDTO(product);
        } catch (error) {
            throw error;
        }
    }
}

export default new ProductService();
