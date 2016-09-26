# What is this?

This is a script loader which is useful for controlling the dynamic loading of
scripts. It provides the following features:

* easy one-time dynamic loading of scripts
* returns a promise representing whether the script has loaded
* control over whether scripts being concurrently loaded are executed in the order
  loaded, or are executed as soon as available.

Inspired by the Filament Group's work on script loading: https://github.com/filamentgroup/loadJS


## Installation

Using NPM:

    # Once installed, the script can be found at:
    # node_modules/ffxnz-load-script/src/nz_ffx_loadScript
    npm install --save git+https://github.com/fairfaxmedia/ffxnz-load-script.git


## Usage

    // Note that we use the nz.ffx psuedo-namespace to prevent collisions
    var myScript = nz.ffx.loadScript('http://example.com/script.js');

    myScript.then(function() {
        // The script is now available for use.
    });


## Tests

    npm test

## License

MIT
