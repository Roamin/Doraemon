const typeOf = require('../../utils/type-of')

class BaseService {
    constructor(model) {
        this.model = model
    }

    create (data) {
        let action = 'create'

        if (typeOf(data) === 'Array') {
            action = 'bulkCreate'
        }

        return new Promise((resolve) => {
            this.model[action](data).then(result => {
                resolve([null, result])
            }).catch(error => {
                resolve([error])
            })
        })
    }

    findOne (...args) {
        return this.model.findOne(...args)
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
