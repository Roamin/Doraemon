const { service, model } = require('../../db')

function reset () {
    return new Promise(async resolve => {
        let groups = await service.Group.findAll({
            where: {
                status: 'DONE'
            },
            raw: true
        })

        if (!groups) return resolve()

        groups = groups.map(group => {
            group.status = 'PENDING'

            return group
        })

        if (groups) {
            await model.Group.bulkCreate(groups, {
                updateOnDuplicate: ['status']
            })
        }

        resolve()
    })
}

module.exports = reset