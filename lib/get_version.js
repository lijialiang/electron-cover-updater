'use strict';

const axios = require('axios');

module.exports = function ( ) {
    const { option: { versionURL: url, versionField: field } } = this;

    return new Promise( ( resolve, reject ) => {
        axios.get( url )
            .then( ( { data } ) => {
                field && data[ field ] ? resolve( data[ field ] ) : resolve( data );
            } )
            .catch( ( err ) => {
                console.error( '[UPDATER]', err );

                reject( 'get version fail' );
            } )
    } );
};
