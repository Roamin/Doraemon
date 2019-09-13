const api = require( './api' )

async function start () {
    const [err, albumId] = await api.createAlbum( {
        album_name: '测试',
        album_intro: '测试创建',
        author_tags: 'a,b'
    } )

    if ( err ) {
        console.error( err )
    } else {
        console.log( res )
    }
}

start()