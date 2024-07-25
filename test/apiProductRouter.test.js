import { expect } from 'chai';
import connectToMongo from '../src/dao/connection.js';
import { productRepository } from '../src/repositories/index.js';

const chai_expect = expect;

const testProductData = {
    title: "Test Product2",
    description: "Test Description2",
    code: "Test124",
    price: 10,
    status: true,
    stock: 100,
    category: "Test",
    owner: "user",
};

let testProduct;

connectToMongo();

describe("Tests Product DAO", () => {
    before(async function () {
        // Se ejecuta antes de comenzar el paquete de tests
    });

    beforeEach(async function () {
        // Crear un producto antes de cada test
        try {
            const result = await productRepository.createProduct(testProductData, { role: 'user', email: 'user@example.com' });
            testProduct = result;
        } catch (error) {
            console.error("Error al crear el producto en beforeEach:", error);
        }
    });

    afterEach(async function () {
        // Verificar si el producto existe antes de intentar eliminarlo
        if (testProduct && testProduct._id) {
            try {
                const productExists = await productRepository.getProductById(testProduct._id);
                if (productExists) {
                    await productRepository.deleteProduct(testProduct._id);
                }
            } catch (error) {
                console.error("Error al eliminar el producto en afterEach:", error);
            }
        }
    });

    after(async function () {
        // Se ejecuta después de finalizar el paquete de tests
    });

    it("getAllProducts() debe retornar un array con los productos", async () => {
        const result = await productRepository.getAllProducts();
        chai_expect(result).to.be.an("array");
    });

    it("createProduct() debe retornar un objeto con el producto creado", async () => {
        const result = await productRepository.createProduct(testProductData, { role: 'user', email: 'user@example.com' });
        chai_expect(result).to.be.an("object");
        chai_expect(result._id).to.be.not.null;
        chai_expect(result.thumbnails).to.be.deep.equal([]);
    });

    it("getProductById() debe retornar un objeto con el producto", async () => {
        const result = await productRepository.getProductById(testProduct._id);
        chai_expect(result).to.be.an("object");
        chai_expect(result._id).to.be.not.null;
        chai_expect(result.title).to.be.equal(testProduct.title);
    });

    it("updateProduct() debe retornar un objeto con el producto actualizado", async () => {
        await productRepository.updateProduct(testProduct._id, { title: "Test Product Updated" });
        const updatedProduct = await productRepository.getProductById(testProduct._id);
        chai_expect(updatedProduct).to.be.an("object");
        chai_expect(updatedProduct._id).to.be.not.null;
        chai_expect(updatedProduct.title).to.be.equal("Test Product Updated");
    });

    it("deleteProduct() debe retornar un objeto con el producto eliminado", async () => {
        const result = await productRepository.deleteProduct(testProduct._id);
        chai_expect(result).to.be.an("object");
    });
});


