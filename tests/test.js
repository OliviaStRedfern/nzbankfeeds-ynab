const testrunner = require("node-qunit");

const callback = function(err, report) {
    console.dir(report);
}

testrunner.run({
    code: "index.js",
    tests: "tests/bnz-netguard-test.js"
}, callback);