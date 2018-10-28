class LoginFlow {
    constructor(URL, usernameField, passwordField, submitButton) {
        console.log(`LoginFlow object created for ${URL}`);

        this.URL = URL;
        this.usernameField = usernameField;
        this.passwordField = passwordField;
        this.submitButton = submitButton;
    }

    async login(page, username, password) {
        if (username.length === 0) {
            console.error(`    No username supplied, could not login`);
            return false;
        }
        console.log(`    logging in user ${username}`);

        await page.goto(this.URL);

        await page.click(this.usernameField);
        await page.keyboard.type(username);

        await page.click(this.passwordField);
        await page.keyboard.type(password);

        await page.click(this.submitButton);
        await page.waitForNavigation();
        return true;
    }
}

module.exports = LoginFlow;

