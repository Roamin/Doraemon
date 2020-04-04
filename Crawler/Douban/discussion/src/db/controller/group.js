const { Group: GroupService } = require('../service')

async function create (data) {
    const [err, res] = await GroupService.create(data)

    if (err) {
        console.error(err)
    } else {
        console.log(`create ${data.length} groups`)
    }
}

create([
    {
        id: '510976',
        name: '杭州相亲'
    }
])