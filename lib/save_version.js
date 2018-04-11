'use strict';

const fs = require('fs');

module.exports = function ( ) {
    return new Promise( ( resolve, reject ) => {
        const {
            option: { packageJsonFile },
            update_version: version,
            updating,
        } = this;

        try {
            const json = JSON.parse( fs.readFileSync( packageJsonFile, 'utf8' ) );

            json.version = version;

            fs.writeFileSync( packageJsonFile, JSON.stringify( json, null, 4 ), 'utf8' );

            updating( 'save version success' );

            resolve();
        }
        catch ( e ) {
            console.log( '[UPDATER]', err );

            reject( 'save version fail' );
        }
    } );
};
