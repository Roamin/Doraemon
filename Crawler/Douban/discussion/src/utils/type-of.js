const map = {
    '[object Boolean]': 'Boolean',
    '[object Number]': 'Number',
    '[object String]': 'String',
    '[object Function]': 'Function',
    '[object Array]': 'Array',
    '[object Date]': 'Date',
    '[object RegExp]': 'RegExp',
    '[object Undefined]': 'Undefined',
    '[object Null]': 'Null',
    '[object Object]': 'Object'
}

function typeOf (obj) {
    const toString = Object.prototype.toString

    return map[toString.call(obj)]
}

module.exports = typeOf