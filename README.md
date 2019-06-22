# nzbankfeeds-ynab

Automated importing New Zealand bank account transactions into YNAB.

I love YNAB, but I live in New Zealand and our banks are not yet available to link. So when I try and set up a linked account for Kiwibank (for example), I get this error message.

> We couldn't find a financial institution named "kiwibank" that supports Direct Import. Don't worry, you can still continue setting up this account.

This tool is the beginning of automating importing the bank feeds into YNAB.

The following banks are supported:
* ANZ
* BNZ
* Kiwibank
* Westpac

It's licenced under the MIT licence so you can go crazy with forks for your project.


## Philosophy

This project is all about working software, with a road map for improvements. Because I am using it right now for my own finances.

For example, although it would be better to interface directly with the YNAP API to do the transaction import, it was quicker just to use Puppeteer to interact directly with the YNAB website. This meant I could create and end-to-end flow quickly, with a view to iterating improvements accorning to the road map.

Robust testing is important so that changes don't introduce regressions. 

## Architecture

The main concept to understand this codebase is the `flow` which in this context means the steps taken by the automation tool [Puppeteer](https://github.com/GoogleChrome/puppeteer) to click and type it's way through a series of screens in a website to achieve a goal. 

`flows` are modelled by classes that have the following heirachy:

* `abstract-flow`
    * `abstract-bank-flow`
        * `bank\<bankname>-flow`
    * `ynab-flow`

Each flow encapsulates the HTML selectors and UI actions needed to complete a given task. 

The abstract flow represents the selectors and actions to login to a website.

The abstract bank flow represents the methods common to banks for logging in, retrieving a list of transactoions in CSV format for a given date range. Each bank's unique UI and actions are implements in their repective classes. There are two examples of `-cc` accounts, which are credit card account who inherit everything from the bank, but have different account selectors.

The YNAB flow represents logging into YNAB and getting the most recent transaction date for an account, and then another set of methods for uploading the CSV data from a bank.

## Roadmap

1. Documentation
1. Connect to YNAB API
1. Improve the way credentials are stored
1. Create a UI
1. Re-write the CSV importer, there's a lot of room for refactoring in that code
1. Convert to typescript
1. Optimise the flows for `-cc` accounts so they re-use an existing session

### The fine print
You need to check with your bank or financial instution before running this code. I don't know what their attitude to this method of integration is. I also suggest you have 2FA set up for your account, this means that the script needs you to enter you 2FA credential each time it is run, which I argue means this isn't truely automation.

As evidence of _prior art_, [POLIPAY](https://www.polipay.co.nz/) and [pocketsmith](https://www.pocketsmith.com/) are both using this _screenscraping_ technology for their integrations.

This project is very much a case of asking for forgiveness not persmission. If you are from one of the banks in this integration and have a problem with what we are doing here, drop me a line and I'll swiftly remove the integration in question.
