const BaseService = require('./Base')
const { User } = require('../model')

class UserService extends BaseService {
    constructor() {
        super(User)
    }
}
module.exports = new UserService()
