import XLSX from 'xlsx'

/**
 * 清除表格空行、字段前后空白符
 * @param rows
 * @param colLength 每行总列数
 * @returns {*}
 */
function trimSheetData (rows) {
    return rows.filter(row => row.length > 0 && row.filter(option => option !== '').length > 0)
        .map(row => row.map(content => {
            if (Object.prototype.toString.call(content) === '[object String]') {
                return content.trim()
            }

            return content
        }))
}

// sheets = [
//     {
//         name: '用户信息',
//         columns: [
//             {
//                 title: 'ID',
//                 key: 'id'
//             },
//             {
//                 title: '姓名',
//                 key: 'username'
//             }
//         ]
//     }
// ]

export function getRawExcelSheets (file, sheets = []) {
    return new Promise(resolve => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const fileData = new Uint8Array(e.target.result)
            const workbook = XLSX.read(fileData, { type: 'array' })
            const result = []

            // get sheets config names and titles
            const sheetNames = []
            const sheetHeaderTitles = []

            sheets.forEach(({ name, columns }, sheetIndex) => {
                sheetNames.push(name)

                sheetHeaderTitles[sheetIndex] = columns.map(({ title }) => title)
            })

            // validate sheet names
            if (JSON.stringify(sheetNames) !== JSON.stringify(workbook.SheetNames)) {
                return resolve([new Error('Sheet Names Mismatch!')])
            }

            const workbookSheetHeaderTitles = []
            workbook.SheetNames.forEach((sheetName, sheetIndex) => {
                // get sheet
                const worksheet = workbook.Sheets[sheetName]

                // convert to json data
                // api ref: https://github.com/SheetJS/sheetjs#json
                let rows = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    blankrows: false
                })

                rows = trimSheetData(rows)

                const titles = []
                for (let i = 0; i < sheets[sheetIndex].columns.length; i++) {
                    titles.push(rows[0][i])
                }
                workbookSheetHeaderTitles.push(titles)
                result.push(rows)
            })

            // validate sheet titles
            if (JSON.stringify(workbookSheetHeaderTitles) !== JSON.stringify(sheetHeaderTitles)) {
                return resolve([new Error('Sheet Header Titles Mismatch!')])
            }

            resolve([null, result])
        }

        reader.readAsArrayBuffer(file)
    })
}

export function getExcelSheets (file, sheets) {
    return new Promise(async resolve => {
        let [error, result] = await getRawExcelSheets(file, sheets)

        if (error) {
            return resolve([error])
        }

        result = result.map((rows, sheetIndex) => {
            rows.shift()

            return rows.map(row => {
                const item = {}

                // convert each row to Object
                sheets[sheetIndex].columns.forEach(({ key }, colIndex) => {
                    // key => value
                    item[key] = row[colIndex]
                })

                return item
            })
        })

        resolve([null, result])
    })
}

export default getExcelSheets
