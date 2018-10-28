const LoginFlow = require("./shared-login-flow");
var colors = require('colors');

class AbstractFlow {

    constructor() {
        this.log("AbstractFlow object created");

        // Can be overridden if the URL doesn't redirect to the home page
        this.HOME = null;

        this.loginFlow = null;
        this.SECRETS = undefined;
        this.SELECTORS = undefined;
    }

    log(message) {
        console.log(message.magenta);
    }

    async login(page) {
        this.log("invoked AbstractFlow::login");
        if (this.loginFlow === null) {
            this.log("    creating LoginFlow object");
            this.loginFlow = new LoginFlow(
                this.URL,
                this.SELECTORS.login.userIDField,
                this.SELECTORS.login.passwordField,
                this.SELECTORS.login.loginButton
            );
            return await this.loginFlow.login(page, this.SECRETS.userID, this.SECRETS.password);
        } else {
            this.log("    re-using existing session");
            if (this.HOME === null) {
                await page.goto(this.URL);
            } else {
                await page.goto(this.HOME);
            }
            return true;
        }
    }
}

module.exports = AbstractFlow;