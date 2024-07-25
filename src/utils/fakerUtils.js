import { fakerES_MX as faker } from "@faker-js/faker";

export const generateUser = () => {
    let numOfProducts = faker.number.int({min: 1, max: 5});
    let products = [];

    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }

    return {
        id: faker.database.mongodbObjectId(),
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        products,
        image: faker.image.avatar(),
        email: faker.internet.email()
    }
}

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.number.int({min: 0, max: 100}),
        image: faker.image.url()
    }
}