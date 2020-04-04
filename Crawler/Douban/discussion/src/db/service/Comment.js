const BaseService = require('./Base')
const { Comment } = require('../model')

class CommentService extends BaseService {
    constructor() {
        super(Comment)
    }
}
module.exports = new CommentService()
