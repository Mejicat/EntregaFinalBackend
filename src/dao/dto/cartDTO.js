export default class CartDTO {
    constructor(cart) {
      this._id = cart._id
      this.user = cart.user || null
      this.products = cart.products || []
    }
  }