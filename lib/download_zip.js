'use strict';

const path = require('path');
const download = require('url-download');

module.exports = function ( ) {
    const {
        update_version: version,
        updating,
        option: { isDiffSystem, zipURL, temp }
    } = this;

    return new Promise(( resolve, reject ) => {
        let zip = `${ version }.zip`;

        isDiffSystem ? ( process.platform === 'win32' ? zip = `win.${ zip }` : zip = `mac.${ zip }` ) : void 0;

        const url = `${ zipURL }/${ zip }`;

        download( url, temp )
            .on( 'close', ( ) => {
                updating( 'download zip success' );
                resolve({ zip: path.resolve( temp, zip ) });
            })
            .on( 'invalid', ( err ) => {
                reject( err );
            })
    })
};
