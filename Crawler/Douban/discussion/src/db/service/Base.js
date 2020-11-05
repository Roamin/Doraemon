const typeOf = require('../../utils/type-of')

class BaseService {
    constructor(model) {
        this.model = model
    }

    create (data, options = {}) {
        return new Promise((resolve) => {
            this.model.create(data, options).then(result => {
                resolve([null, result])
            }).catch(error => {
                resolve([error])
            })
        })
    }

    bulkCreate (data, options = {}) {
        return new Promise((resolve) => {
            this.model.bulkCreate(data, options).then(result => {
                resolve([null, result])
            }).catch(error => {
                resolve([error])
            })
        })
    }

    findOne (...args) {
        return this.model.findOne(...args)
    }

    count (...args) {
        return this.model.count(...args)
    }

    findAll (...args) {
        return this.model.findAll(...args)
    }

    update (...args) {
        return new Promise((resolve) => {
            this.model.update(...args).then(result => {
                resolve([null, result])
            }).catch(error => {
                resolve([error])
            })
        })
    }

    delete (...args) {
        return new Promise((resolve) => {
            this.model.destroy(...args).then(result => {
                resolve([null, result])
            }).catch(error => {
                resolve([error])
            })
        })
    }
}

module.exports = BaseService
