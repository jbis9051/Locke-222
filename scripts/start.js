'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../config/env');

const webpack = require('webpack');
const {
    choosePort,
    createCompiler,
} = require('react-dev-utils/WebpackDevServerUtils');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');

function getPort() {
    const host = process.env.HOST || '0.0.0.0';
    const defaultPort = parseInt(process.env.PORT, 10) || 9090;
    return choosePort(host, defaultPort);
}

function getCompiler(config) {
    const appName = require(paths.appPackageJson).name;
    const urls = {
        localUrlForTerminal: ''
    }
    const devSocket = {
        warnings: () => {},
        errors: () => {},
    };
    // Create a webpack compiler that is configured with custom messages.
    return createCompiler({
        appName,
        config,
        devSocket,
        urls,
        useYarn: true,
        useTypeScript: true,
        tscCompileOnError: true,
        webpack,
    });
}

async function start() {
    const port = await getPort();
    if (port === null)
        return;
    console.log(`Starting server on port: ${port}`)
    process.env.PORT = port;

    const config = configFactory('development');
    const compiler = getCompiler(config);
    compiler.watch({aggregateTimeout: 500}, (err) => err && console.error(err))
}

start();
