const { DEBUG } = process.env;

let files = [
    'setup/mParticle.js',
    'mockhttprequest.js',
    'lib/geomock.js',
    '../node_modules/sinon-browser-only/sinon.js',
    '../build/mParticle-dev.js',
    'test-bundle.js'
];

let browsers = ['ChromeHeadless', 'FirefoxHeadless'];
let singleRun = true;

if (DEBUG === 'true') {
    browsers = ['Chrome', 'Firefox'];
    singleRun = false;
}

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'should'],
        preprocessors: {
            'test/**/*.js': ['browserify']
        },
        plugins: ['karma-browserify', 'karma-mocha', 'karma-should', 'karma-junit-reporter'],
        files,
        reporters: ['progress', 'junit'],
        colors: true,
        browsers,
        concurrency: Infinity,
        singleRun,
        debug: true,
        logLevel: config.LOG_INFO,
        browserConsoleLogOptions: {
            terminal: false
        },
        client: {
            captureConsole: false
        },
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless']
            }
        },
        junitReporter: {
            outputDir: 'reports/',
            outputFile: 'test-karma.xml'
        }
    });
};