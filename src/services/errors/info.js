export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received ${user.first_name}
    * last_name  : needs to be a String, received ${user.last_name}
    * email      : needs to be a String, received ${user.email}`
}

export const generateProductErrorInfo = (product) => {
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
    let missingFields = requiredFields.filter(field => !product[field]);
    return `One or more properties were incomplete or not valid.
    List of required properties:
    ${missingFields.map(field => `* ${field}`).join('\n')}
    * price: needs to be a number greater than 0, received ${product.price}
    * stock: needs to be a number greater than 0, received ${product.stock}`;
};