const fs = require( 'fs' )
const request = require( 'request' )
const path = require( 'path' )

function wget ( url, savePath ) {
    return new Promise( ( resolve, reject ) => {
        const ws = fs.createWriteStream( savePath )

        ws.on( 'close', resolve ).on( 'error', reject )
        request( url ).pipe( ws )
    } )
}

module.exports = wget

// wget( 'https://visvim.tv/lookbook/pht/14_wmv2019fw_img021.jpg', path.join( __dirname, 'dist', '14_wmv2019fw_img021.jpg' ) )
