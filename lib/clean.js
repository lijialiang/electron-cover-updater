'use strict';

const path = require('path');
const del = require('del');

module.exports = function ( { zip } ) {
    return new Promise( ( resolve, reject ) => {
        const { updating, option: { temp, root } } = this;

        try {
            del.sync( [
                zip,
                path.resolve( root, './__MACOSX' ),
            ] );

            updating( 'clean up success' );

            resolve( );
        }
        catch ( e ) {
            console.log( '[UPDATER]', err );

            reject( 'clean fail' );
        }
    } );
};
