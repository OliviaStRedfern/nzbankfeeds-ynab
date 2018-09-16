const moment = require('moment');
const {convertCSVWithTransformation, lookupinator, YNAB_COLS} = require('./csv-converter');
var colors = require('colors');

const SOURCE_COLS = [
    'Date',
    'Amount',
    'Payee',
    'Particulars',
    'Code',
    'Reference',
    'Tran Type',
    'Processed Date',
];

let isFirst = true;
const transformation = function (record, callback) {
    lookupinator.columnNames = SOURCE_COLS;
    lookupinator.record = record;
    let row = "";
    if (isFirst) {
        isFirst = false;
        row += YNAB_COLS.join(",");
    } else {

        // DATE
        let date = lookupinator.lookup('Processed Date');
        let dateMoment = moment(date, "DD-MM-YYYY");
        row += `${dateMoment.format("MM/DD/YYYY")},`;

        // PAYEE
        let payee = lookupinator.lookup('Payee');
        row += `"${payee}",`;

        // MEMO
        row += `"`;
        row += `${lookupinator.lookup('particulars')} `;
        row += `${lookupinator.lookup('code')} `;
        row += `${lookupinator.lookup('reference')}`;
        row += `",`;

        // OUTFLOW / INFLOW
        amount = lookupinator.lookup('amount', SOURCE_COLS);
        if (amount > 0) {
            row += `,${amount}`;
        } else {
            row += `${Math.abs(amount)},`;
        }
    }
    console.log(row.dim)
    callback(null, row + "\n");
}

module.exports = (csvFileName) => convertCSVWithTransformation(transformation, csvFileName);