const BaseService = require('./Base')
const { Group } = require('../model')

class GroupService extends BaseService {
    constructor() {
        super(Group)
    }
}
module.exports = new GroupService()
