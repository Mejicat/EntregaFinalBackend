// test/apiCartRouter.test.js
import { expect } from 'chai';
import CartRepository from '../src/repositories/cartRepository.js';
import CartDAO from '../src/dao/cartDAO.js';

describe('Tests Cart DAO', () => {
  let cartRepository;
  let testCart;
  let testProduct;

  before(async () => {
    cartRepository = new CartRepository(new CartDAO());

    // Crear un carrito y un producto de prueba
    testCart = await cartRepository.addCart();
    testProduct = { _id: 'testProductId', name: 'Test Product' };

    // Asegurarse de que el carrito y el producto están creados
    expect(testCart).to.be.an('object');
    expect(testCart._id).to.exist;
    expect(testProduct).to.be.an('object');
    expect(testProduct._id).to.exist;
  });

  it("getProductsFromCart() debe retornar un array con los productos del carrito", async () => {
    try {
      const products = await cartRepository.getProductsFromCart(testCart._id);
      expect(products).to.be.an('array');
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
      throw error;
    }
  });

  it("addProductToCart() debe retornar un objeto con el producto agregado al carrito", async () => {
    try {
      const result = await cartRepository.addProduct(testCart._id, testProduct._id);
      expect(result).to.be.an('object');

      const products = await cartRepository.getProductsFromCart(testCart._id);
      expect(products).to.be.an('array');
      expect(products[0].product).to.be.equal(testProduct._id);
      expect(products[0].quantity).to.be.equal(1);
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      throw error;
    }
  });

  it("updateCart() debe retornar un objeto con el carrito actualizado", async () => {
    try {
      await cartRepository.addProduct(testCart._id, testProduct._id);
      const updatedCart = await cartRepository.updateProductQuantity(testCart._id, testProduct._id, 3);

      const products = await cartRepository.getProductsFromCart(testCart._id);
      expect(products).to.be.an('array');
      expect(products[0].product).to.be.equal(testProduct._id);
      expect(products[0].quantity).to.be.equal(3);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error;
    }
  });

  it("updateProductQuantity() debe retornar un objeto con el producto actualizado", async () => {
    try {
      await cartRepository.addProduct(testCart._id, testProduct._id);
      const updatedProduct = await cartRepository.updateProductQuantity(testCart._id, testProduct._id, 5);

      const products = await cartRepository.getProductsFromCart(testCart._id);
      expect(products).to.be.an('array');
      expect(products[0].product).to.be.equal(testProduct._id);
      expect(products[0].quantity).to.be.equal(5);
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto en el carrito:", error);
      throw error;
    }
  });

  it("deleteAllProducts() debe retornar un objeto con los productos eliminados", async () => {
    try {
      const result = await cartRepository.deleteAllProducts(testCart._id);
      expect(result).to.be.an('object');
      expect(result.products).to.be.an('array').that.is.empty;

      const products = await cartRepository.getProductsFromCart(testCart._id);
      expect(products).to.be.an('array').that.is.empty;
    } catch (error) {
      console.error("Error al eliminar los productos del carrito:", error);
      throw error;
    }
  });

  it("deleteCart() debe retornar un objeto con el carrito eliminado", async () => {
    try {
      const result = await cartRepository.deleteCart(testCart._id);
      expect(result).to.be.an('object');
      expect(result.deletedCount).to.be.equal(1);

      // Intentar obtener los productos de un carrito eliminado debería fallar,
      // así que no intentamos obtener los productos aquí
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      throw error;
    }
  });
});





