import ProductDto from "../dao/dto/productDTO.js";

class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            const products = await this.dao.getProducts();
            return products.map(product => new ProductDto(product));
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await this.dao.getProductById(id);
            return new ProductDto(product);
        } catch (error) {
            throw new Error(`Product with ID ${id} not found`);
        }
    }

    async addProducts(productData, user) {
        try {
            const product = await this.dao.addProducts(productData, user);        
            return new ProductDto(product);
        } catch (error) {
            throw new Error(`Could not add this Product ${productData}`);
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            await this.dao.getProductById(id);
            const updatedProduct = await this.dao.updateProduct(id, productUpdate);
            return new ProductDto(updatedProduct);
        } catch (error) {
            throw new Error(`Could not update this Product ${id}`);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.dao.getProductById(id);

            if (!product) {
                throw new Error(`Product ${id} not found`);
            }

            const deletedProduct = await this.dao.deleteProduct(id);
            return new ProductDto(deletedProduct);
        } catch (error) {
            throw new Error(`Could not delete this Product ${id}`);
        }
    }

    async getAllProducts(limit, page, query, sort) {
        try {
            const products = await this.dao.getProducts(limit, page, query, sort);
            return products.map(product => new ProductDto(product));
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    async createProduct(productData, user) {
        try {
            if (!user || !user.role) {
                throw new Error("El usuario no tiene el rol adecuado");
            }
    
            const product = await this.dao.addProducts(productData, user);
            return new ProductDto(product);
        } catch (error) {
            throw new Error(`Could not create the product: ${error.message}`);
        }
    }
}

export default ProductRepository;
