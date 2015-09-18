var os = require('os');
var fs = require('fs');

var config = {

    //set window width and height
    browserWidth : 1024,
    browserHeight : 768,

    //Folder path for jasmine report xml and screenshots on error
    resultFolder : 'test_results',

    chromeDriverLinux : 'selenium/linux/chromedriver',
    chromeDriverWindows : 'selenium/windows/chromedriver.exe',
    chromeDriverMac : 'selenium/mac/chromedriver',

    seleniumServerJar : 'selenium/selenium-server-standalone.jar'

};

//clear and/or generate result folder
var prepareResultFolder = function () {
    try {
        fs.mkdirSync(config.resultFolder);
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
    try {
        var files = fs.readdirSync(config.resultFolder);
    } catch (e) {
        return;
    }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = config.resultFolder + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
        }
    }
};

//get correct platform chrome driver
var getChromeDriver = function() {
    var platform = os.platform();
    switch(platform) {
        case 'linux':
            return config.chromeDriverLinux;
            break;
        case 'win32':
        case 'win64':
            return config.chromeDriverWindows;
            break;
        case 'darwin':
            return config.chromeDriverMac;
    }
};

//begin protractor config
exports.config = {
    onPrepare: function () {
        //get jasmine xml reporter
        var jasmineReporters = require('jasmine-reporters');

        prepareResultFolder();

        //set window width and height
        browser.driver.manage().window().setSize(config.browserWidth, config.browserHeight);

        return browser.getCapabilities().then(function (capability) {
            var browserName = capability.caps_.browserName.toUpperCase();
            var browserVersion = capability.caps_.version;
            var testPrefix = browserName + '-' + browserVersion;

            //add jasmine reporter to get a result xml
            jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: config.resultFolder,
                filePrefix: testPrefix
            }));

            //make a screenshot if tests fails
            jasmine.getEnv().addReporter(new function () {
                this.specDone = function (result) {
                    if (result.failedExpectations.length > 0) {
                        browser.takeScreenshot().then(function (png) {
                            var stream = fs.createWriteStream(config.resultFolder + '/' + testPrefix + '-' + spec.description + '.png');
                            stream.write(new Buffer(png, 'base64'));
                            stream.end();
                        });
                    }
                };
            });

        });

    },

    specs: ['tests/*.spec.js'],

    framework: 'jasmine2',

    seleniumServerJar: config.seleniumServerJar,

    chromeDriver: getChromeDriver(),

    browser: 'chrome'

};