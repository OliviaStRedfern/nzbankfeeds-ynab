module.exports = {
    extends: "../.eslintrc.js",
    env: {
        mocha: true,
    },
    plugins: [
        "mocha",
        "chai-expect",
    ],
    rules: {
        "mocha/no-exclusive-tests": "error",
        "mocha/no-identical-title": "error",
        "chai-expect/missing-assertion": "error",
        "chai-expect/terminating-properties": "error"        
    }
}