'use strict';

const fs = require('fs');
const path = require('path');

const updater = { };

updater.option = {
    root: '',
    versionURL: '',
    versionField: '',
    zipURL: '',
    isDiffSystem: false,
    nowVersion: '',
    packageJsonFile: '',
    temp: path.resolve( __dirname, './temp' ),
};

updater.config = ( option ) => {
    updater.option = Object.assign( updater.option, option );

    const { temp } = updater.option;

    !fs.existsSync( temp ) ? fs.mkdirSync( temp ) : void 0;
}

updater.check = function ( ) {
    const { option: { nowVersion } } = updater;
    return new Promise( ( resolve, reject ) => {
        require('./lib/get_version').bind( updater )( )
            .then( version => {
                const result = require('compare-versions')( version, nowVersion );

                resolve({
                    version,
                    isNeedUpdate: result > 0 ? true : false,
                } );
            } )
            .catch( err => console.error( err ) )
    } );
}

let updatingCallback = void 0;

const updatingTotalStep = 6;
let updatingStep = 0;

updater.updating = function ( arg ) {
    let progress = 0;

    if ( typeof arg === 'string' ) {
        progress = parseInt( ( ++updatingStep / updatingTotalStep ) * 100 );
    }

    typeof arg === 'function' ? updatingCallback = arg : (
        updatingCallback ? updatingCallback( arg, progress ) : void 0
    );
};

updater.update_version = void 0;

updater.update = function ( version ) {
    const { updating } = updater;

    const set_update_version = ( { version: _version } ) => {
        return new Promise( ( resolve, reject ) => {
            !version ? version = _version : void 0;
            updating( `updating version ${ version }` );
            updater.update_version = version;
            resolve( { version } );
        } );
    }

    return new Promise( ( resolve, reject ) => {
        updater.check( )
            .then( set_update_version )
            .then( require('./lib/download_zip').bind( updater ) )
            .then( require('./lib/unzip_cover_files').bind( updater ) )
            .then( require('./lib/clean').bind( updater ) )
            .then( require('./lib/save_version').bind( updater ) )
            .then( ( ) => {
                updatingStep = 0;

                resolve( );
            } )
            .catch( e => {
                updatingStep = 0;

                reject( e );
            } )
    } );
}


module.exports = updater;
