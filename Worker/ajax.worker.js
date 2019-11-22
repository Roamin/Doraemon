onmessage = function (e) {
    const { data } = e

    console.log('worker received: ', data)

    getRemote()
}

function getRemote () {
    const xhr = new XMLHttpRequest()

    xhr.open('get', '/')
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            postMessage(xhr.responseText)
        }
    }

    xhr.send()
}
