#Protractor with Jasmine2

Here you will find a configuration example for Protractor with Jasmine2 as testing framework.
Following features are implemented:

* Screenshot on error
* XML report for ci integration (Jenkins, ...)
* Automatic chrome driver OS selection and binary download
* Automatic selenium server jar download

#Installation & Run

* NodeJs must be installed first. https://nodejs.org
* Download project and extract it. https://github.com/metrophos/protractor_configs
* Open a terminal and switch into the project jasmine2 folder.
* run `npm install`

There are to possible ways to run your protractor test.

Start protractor directly with nodeJs:
`node node_modules/protractor/lib/cli.js protractor_config.js`

If you have Protractor installed globally you can use this command:
`protractor protractor_config.js`
