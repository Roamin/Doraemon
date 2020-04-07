const BaseService = require('./Base')
const { Discussion } = require('../model')

class DiscussionService extends BaseService {
    constructor() {
        super(Discussion)
    }
}
module.exports = new DiscussionService()
