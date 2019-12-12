import XLSX from 'xlsx'

/**
 * 验证工作表名称
 * @param {Object}} workbook 
 * @param {Array} schemas 
 */
function validateSheetNames (workbook, schemas) {
    // get sheets names and titles
    const sheetNames = schemas.map(({ name }) => name)

    // validate sheet names
    if (JSON.stringify(sheetNames) !== JSON.stringify(workbook.SheetNames)) {
        return new Error('Sheet Names Mismatch!')
    }

    return null
}

/**
 * 验证工作表的标题
 * @param {Array} result 
 * @param {Array} schemas 
 */
function validateSheetTitles (result, schemas) {
    const sheetTitles = []
    const workbookSheetTitles = []

    schemas.forEach(({ schema }, sheetIndex) => {
        sheetTitles[sheetIndex] = schema.map(({ title }) => title)
    })

    result.forEach((rows, sheetIndex) => {
        const titles = []

        for (let i = 0; i < schemas[sheetIndex].schema.length; i++) {
            titles.push(rows[0][i])
        }

        workbookSheetTitles.push(titles)
    })

    if (JSON.stringify(workbookSheetTitles) !== JSON.stringify(sheetTitles)) {
        return new Error('Sheet Header Titles Mismatch!')
    }

    return null
}

/**
 * 清除表格空行、字段前后空白符
 * @param rows
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

/**
 * 获取原始数据
 * @param {File} file
 * @param {Array} schemas
 * schemas = [
 *   {
 *       name: '用户信息',
 *       schema: [
 *           {
 *               title: 'ID',
 *               key: 'id'
 *           },
 *           {
 *               title: '姓名',
 *               key: 'username'
 *           }
 *       ]
 *  }
 * ]
 */
export function getRawExcelSheets (file, schemas = []) {
    return new Promise(resolve => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const fileData = new Uint8Array(e.target.result)
            const workbook = XLSX.read(fileData, { type: 'array' })
            const result = []

            // validate sheet names
            const validSheetNamesError = validateSheetNames(workbook, schemas)
            if (validSheetNamesError) {
                return resolve([validSheetNamesError])
            }

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

                result.push(rows)
            })


            // validate sheet titles
            const validSheetTitlesError = validateSheetTitles(result, schemas)
            if (validSheetTitlesError) {
                return resolve([validSheetTitlesError])
            }

            resolve([null, result])
        }

        reader.readAsArrayBuffer(file)
    })
}

/**
 * 获取 Excel 数据（变成键值对的形式）
 * @param {File} file 
 * @param {Array} schemas 
 */
export function getExcelSheets (file, schemas = []) {
    return new Promise(async resolve => {
        let [error, result] = await getRawExcelSheets(file, schemas)

        if (error) {
            return resolve([error])
        }

        result = result.map((rows, sheetIndex) => {
            rows.shift()

            return rows.map(row => {
                const item = {}

                // convert each row to Object
                schemas[sheetIndex].schema.forEach(({ key }, colIndex) => {
                    // key => value
                    item[key] = row[colIndex]
                })

                return item
            })
        })

        resolve([null, result])
    })
}
