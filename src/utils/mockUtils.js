import { v4 as uuidv4 } from 'uuid';

// Función para generar productos de mock
export const generateMockProducts = (count = 100) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      _id: uuidv4(),
      title: `Product ${i + 1}`,
      description: `Description for product ${i + 1}`,
      code: `CODE${i + 1}`,
      price: Math.floor(Math.random() * 10000) / 100,
      stock: Math.floor(Math.random() * 100),
      category: `Category ${Math.floor(i / 10) + 1}`,
      thumbnails: [`thumbnail${i + 1}.jpg`]
    });
  }

  return products;
};
