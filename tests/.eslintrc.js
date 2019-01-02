module.exports = {
    extends: "../.eslintrc.js",
    env: {
        mocha: true,
    },
    plugins: [
        "mocha",
        "chai-expect",
        "chai-friendly",
    ],
    rules: {
        "mocha/no-exclusive-tests": 2,
        "mocha/no-identical-title": 2,
        "chai-expect/missing-assertion": 2,
        "chai-expect/terminating-properties": 2,
        "no-unused-expressions": 0,
        "chai-friendly/no-unused-expressions": 2
    }
}