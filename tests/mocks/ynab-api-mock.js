module.exports = {
  transactions: {
    getTransactionsByAccount: () => {
      return {
        'data': {
          'transactions': [
            {
              'date': '2019-01-05',
            },
            {
              'date': '2019-01-05',
            },
            {
              'date': '2019-01-07',
            },
            {
              'date': '2019-01-11',
            },
          ],
        },
      }
    },
  },
  accounts: {
    getAccounts: () => {
      return {
        'data': {
          'accounts': [
            {
              'id': 'id for ANZ Current 00',
              'name': 'ANZ Current 00',
              'type': 'checking',
              'on_budget': true,
              'closed': false,
              'note': null,
              'balance': 1000,
              'cleared_balance': 1000,
              'uncleared_balance': 1000,
              'transfer_payee_id': 'transfer_payee_id ANZ',
              'deleted': false,
            },
            {
              'id': 'id for Westapac Mastercard',
              'name': 'Westapac Mastercard',
              'type': 'creditCard',
              'on_budget': true,
              'closed': false,
              'note': null,
              'balance': 2000,
              'cleared_balance': 2000,
              'uncleared_balance': 2000,
              'transfer_payee_id': 'transfer_payee_id Westpac astercard',
              'deleted': false,
            },
            {
              'id': 'id for Westpac Current',
              'name': 'Westpac Current',
              'type': 'checking',
              'on_budget': true,
              'closed': false,
              'note': null,
              'balance': 50,
              'cleared_balance': 50,
              'uncleared_balance': 50,
              'transfer_payee_id': 'transfer_payee_id Westpac Current',
              'deleted': false,
            },
          ],
          'server_knowledge': 99,
        },
      }
    },
  },
  budgets: {
    getBudgets: () => {
      return {
        'data': {
          'budgets': [
            {
              'id': 'this id a very special my budget id for testing',
              'name': 'My Budget',
              'last_modified_on': '2019-06-22T22:01:26+00:00',
              'first_month': '2018-08-01',
              'last_month': '2019-06-01',
              'date_format': {
                'format': 'DD/MM/YYYY',
              },
              'currency_format': {
                'iso_code': 'NZD',
                'example_format': '123,456.78',
                'decimal_digits': 2,
                'decimal_separator': '.',
                'symbol_first': true,
                'group_separator': ',',
                'currency_symbol': '$',
                'display_symbol': true,
              },
            },
          ],
        },
      }
    },
  },
}
