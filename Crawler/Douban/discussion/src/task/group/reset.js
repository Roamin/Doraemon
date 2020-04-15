const Sequelize = require('sequelize')
const { service, model } = require('../../db')

function reset () {
    return new Promise(async resolve => {
        let groups = await service.Group.findAll({
            raw: true
        })

        if (!groups) return resolve()

        groups = groups.map(group => {
            group.status = 'PENDING'
            group.error = null

            return group
        })

        if (groups) {
            await model.Group.bulkCreate(groups, {
                updateOnDuplicate: ['status', 'error']
            })
        }

        resolve()
    })
}

module.exports = reset