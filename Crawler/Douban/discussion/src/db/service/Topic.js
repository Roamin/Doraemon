const BaseService = require('./Base')
const { Topic } = require('../model')

class TopicService extends BaseService {
    constructor() {
        super(Topic)
    }
}
module.exports = new TopicService()
