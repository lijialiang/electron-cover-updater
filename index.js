'use strict';

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
}

updater.check = function ( ) {
    const { option: { nowVersion } } = this;
    return new Promise(( resolve, reject ) => {
        require('./lib/get_version').bind( this )()
            .then( version => {
                const result = require('./lib/compare_version')( version, nowVersion );

                resolve({
                    version,
                    isNeedUpdate: result > 0 ? true : false,
                });
            })
            .catch( err => console.error( err ) )
    });
}

let updatingCallback = void 0;

updater.updating = function ( arg ) {
    typeof arg === 'function' ? updatingCallback = arg : (
        updatingCallback ? updatingCallback( arg ) : void 0
    );
};

updater.update_version = void 0;

updater.update = function ( version ) {
    const { updating } = this;

    const set_update_version = ( { version: _version } ) => {
        return new Promise(( resolve, reject ) => {
            !version ? version = _version : void 0;
            updating( `updating version ${ version }` );
            this.update_version = version;
            resolve( { version } );
        });
    }

    return new Promise(( resolve, reject ) => {
        updater.check()
            .then( set_update_version )
            .then( require('./lib/download_zip').bind( this ) )
            .then( require('./lib/unzip_cover_files').bind( this ) )
            .then( require('./lib/clean').bind( this ) )
            .then( require('./lib/save_version').bind( this ) )
            .then( () => {
                resolve();
            })
            .catch( e => {
                console.error( e );
            })
    });

}


module.exports = updater;
