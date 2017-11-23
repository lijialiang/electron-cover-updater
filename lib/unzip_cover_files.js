'use strict';

const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const mkdirp = require('mkdirp');

module.exports = function ({ zip }) {
    return new Promise(( resolve, reject ) => {
        const { updating, option: { root } } = this;

        yauzl.open( zip, { lazyEntries: true }, ( err, zipfile ) => {
            if ( err ) reject( err );

            zipfile.readEntry();

            zipfile.on('entry', ( entry ) => {
                const fileName = `${ root }/${ entry.fileName }`;

                // if folder
                if ( /\/$/.test( entry.fileName ) ) {
                    mkdirp( fileName, ( err ) => {
                        if ( err ) reject( err );
                        zipfile.readEntry();
                    });
                }
                // if file
                else {
                    zipfile.openReadStream( entry, ( err, readStream ) => {
                        if ( err ) reject( err );

                        mkdirp( path.dirname( fileName ), ( err ) => {
                            if ( err ) reject( err );

                            readStream.pipe(
                                fs.createWriteStream( fileName )
                            );

                            readStream.on('end', () => {
                                zipfile.readEntry();
                            });
                        });
                    });
                }
            });

            zipfile.once('end', () => {
                zipfile.close();

                setTimeout(( ) => {
                    updating( 'unzip & cover files success' );

                    resolve( { zip } );
                }, 500)
            });
        });
    });
};
