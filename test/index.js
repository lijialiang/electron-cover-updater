'use strict';

const path = require('path');

const updater = require('../index');

updater.config({
    root: path.resolve( __dirname, './temp/' ),
    versionURL: 'https://legox.org/assets/drog/version.1.1.json',
    versionField: 'version',
    zipURL: 'https://legox.org/assets/drog',
    isDiffSystem: false,
    packageJsonFile: path.resolve( __dirname, './test.json' ),
    nowVersion: '1.0.0',
})

updater.check().then(( { version, isNeedUpdate } ) => {
    if ( isNeedUpdate ) {
        updater.update().then(() => {
            console.log( '>>>>>>>>>>>>>>>> update success' );
        });
    }
});

updater.updating(( msg, progress ) => {
    console.log( msg, progress );
})
