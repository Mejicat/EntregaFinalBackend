export default class MessageDTO {
    constructor(message) {
      this._id = message._id
      this.email = message.email
      this.firstName = message.firstName
      this.message = message.message
      this.date = message.date
    }
  }