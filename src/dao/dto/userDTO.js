export default class UserDTO {
    constructor(user) {
      this._id = user._id
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.password = user.password
      this.email = user.email
      this.verified = user.verified
      this.age = user.age
      this.role = user.role || 'usuario'
    }
  }