import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = "carts"

const cartsSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: [] // por default, array vacío de productos
    }
});

cartsSchema.plugin(mongoosePaginate)

export const cartModel = mongoose.model(cartCollection, cartsSchema)