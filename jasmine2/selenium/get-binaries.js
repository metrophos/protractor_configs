var http = require('http');
var fs = require('fs');
var AdmZip = require('adm-zip');
var Q = require('q');

var download = function(url, dest) {
    console.log('Download: ' + url);
    return Q.Promise(function(resolve, reject) {
        var file = fs.createWriteStream(dest);
        http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(resolve);
            });
        }).on('error', function (err) {
            fs.unlink(dest);
            console.log(err);
            reject(err.message);
        });
    });
};

var extractZip = function(src, dest) {
    console.log('Extract zip file: ' + src);
    AdmZip(src).extractAllTo(dest, true);
    fs.unlinkSync(src);
};

Q.all([
    download('http://selenium-release.storage.googleapis.com/2.47/selenium-server-standalone-2.47.0.jar', './selenium/selenium-server-standalone.jar'),
    download('http://chromedriver.storage.googleapis.com/2.19/chromedriver_linux64.zip', './selenium/chromedriver_linux64.zip'),
    download('http://chromedriver.storage.googleapis.com/2.19/chromedriver_mac32.zip', './selenium/chromedriver_mac32.zip'),
    download('http://chromedriver.storage.googleapis.com/2.19/chromedriver_win32.zip', './selenium/chromedriver_win32.zip')
]).then(function() {
    extractZip("./selenium/chromedriver_linux64.zip", "./selenium/linux");
    fs.chmodSync("./selenium/linux/chromedriver", '755');
    extractZip("./selenium/chromedriver_mac32.zip", "./selenium/mac");
    fs.chmodSync("./selenium/mac/chromedriver", '755');
    extractZip("./selenium/chromedriver_win32.zip", "./selenium/windows");
});


