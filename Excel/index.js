import { getRawExcelSheets, getExcelSheets } from './import-excel'

const schemas = [
    {
        name: '用户信息',
        schema: [
            {
                title: 'ID',
                key: 'id'
            },
            {
                title: '性别',
                key: 'gender'
            },
            {
                title: '姓名',
                key: 'username'
            },
            {
                title: '年龄',
                key: 'age'
            }
        ],
    },
    {
        name: '城市信息',
        schema: [
            {
                title: 'ID',
                key: 'id'
            },
            {
                title: '城市名称',
                key: 'cityName'
            },
            {
                title: '城市首字母',
                key: 'cityInitial'
            }
        ]
    }
]

async function renderRawSheets (file) {
    const [err, data] = await getRawExcelSheets(file, schemas)

    if (err) return alert(err)

    document.getElementById('J_RawResult').innerHTML = JSON.stringify(data, null, 4)
}

async function renderSheets (file) {
    const [err, data] = await getExcelSheets(file, schemas)

    if (err) return alert(err)

    document.getElementById('J_Result').innerHTML = JSON.stringify(data, null, 4)
}

document.getElementById('file').addEventListener('change', (e) => {
    renderRawSheets(e.target.files[0])
    renderSheets(e.target.files[0])
}, false)