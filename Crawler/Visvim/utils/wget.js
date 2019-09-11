const fs = require( 'fs' )
const request = require( 'request' )
const path = require( 'path' )

const mkdirsSync = require( './mkdirs-sync' )


function wget ( url, targetPath ) {
    const { dir } = path.parse( targetPath )

    if ( !fs.existsSync( dir ) ) {
        mkdirsSync( dir )
    }

    return new Promise( ( resolve, reject ) => {
        const ws = fs.createWriteStream( targetPath )

        ws.on( 'close', resolve ).on( 'error', reject )
        request( url ).pipe( ws )
    } )
}

module.exports = wget

// wget( 'https://visvim.tv/lookbook/pht/14_wmv2019fw_img021.jpg', path.join( __dirname, 'dist', 'lookbook 2019', '14_wmv2019fw_img021.jpg' ) )
