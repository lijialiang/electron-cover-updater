'use strict';

const del = require('del');

module.exports = function ( { zip } ) {
    return new Promise(( resolve, reject ) => {
        const { updating, option: { temp } } = this;

        del.sync([
            zip,
            `${ temp }/__MACOSX`,
        ]);

        updating( 'clean up success' );

        resolve();
    });
};
