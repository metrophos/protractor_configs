//jasmine2 screenshot hack/fix: https://github.com/angular/protractor/issues/1938
afterAll(function(done){
    process.nextTick(done);
});