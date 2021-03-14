# crypto-googlesheets
Script add in for Google Sheets to pull in Crypto Wallets via their API. Coinbase and Binance.us are supported.

## Generate API Keys
Generate an API key from the platforms you would like to enable.

#### Coinbase:
1. Navigate to Settings > API > New API Key
1. On the top section, grant access to ALL wallets
1. On the bottom section, grant access to `wallet:accounts:read`
1. Copy the API Key and API Secret, and save for later in a text editor. Once you navigate away from the page, you'll be unable to view the key again.

#### Binance:
Note, this was written against binance.us, NOT binance.com
1. Navigate to API Management
1. Create an API key, you'll be required to confirm it via email.
1. Edit the restrictions, and set it to be a read only key.
1. Copy the API Key and API Secret, and save for later in a text editor. Once you navigate away from the page, you'll be unable to view the key again.

## Install
In Google Sheets:
1. Create a new sheet, and navigate to Tools > Script editor
1. Add the 2 files from this repository into Files on the left side, and save.
1. On `Crypto.gs`, enter your API key and API secret that was provided by Coinbase and Binance.
1. Click save, and then run. Google will make you approve this app to run.
1. If all works after the approval, you should see it pulled an array that shows your coins and balances in the Execution log of the script. 

#### Functions available:

Function | Parameters | Info
-------- | ---------- | -----
coinbase() | n/a | Pulls current wallet info from Coinbase. 1st column is the Coin, 2nd column is the quantity of your holdings, and 3rd column is the current price.
coinbase_quote("coin") | coin | Pulls current price of coin. Assumes USD as the base conversion, so not all coins are supported.
binance() | n/a | Pulls current wallet info from Binance.us. 1st column is the Coin, 2nd column is the quantity of your holdings, and 3rd column is the current price.
binance_quote("coin") | coin | Pulls current price of coin. Assumes USD as the base conversion, so not all coins are supported.

Easiest way to simply test that it is working, is to enter `=coinbase()` or `=binance()` into a single cell and press enter. Your current wallet from either of those platforms should now be shown in the Google Sheet.

## Copying Portfolio Value
You may want to track the value of your crypto portfolio over time, so a small script is included to assist to automate this.

1. In the first sheet where you have the formulas, add your desired values together and make note of the cell of which has your portfolio totals. Feel free to rename the sheet name. If you rename the sheet later, you'll have to edit this script again in the future.
1. Create another sheet. This sheet will be the one that tracks the historical values. Also rename this sheet, if desired.
1. Navigate back to the Script Editor, and go to `CopyValues.gs`. 
1. Set the variables at the top:

Variable | Details
-------- | -------
source_sheet | name of the sheet that has your current crypto balance
source_cell | cell that contains your value that you would like to copy. If you want to assign a name to this cell via Google Sheets, you can reference the name here instead of the actual cell. (this can be useful for if you add rows in the future, that way your cell isn't an absolute reference)
destination_sheet | name of the sheet that will track your crypto balance history
date_format | date format to use when copying the values.

5. Click on Run. You will need to authorize Google to run this as well.
6. If all goes well, you should see the value listed in the Execution log. If you then navigate to the sheet that you specified in `destination_sheet`, you should now see the historical value tracked.

### Set trigger to copy value automatically on scheduled interval
1. On the left side of the Script Editor, select Triggers.
1. On the bottom right, select Add Trigger.
1. Under `Choose which function to run` select `CopyCryptoBalance`.
1. Under `Select event source` select `Time Driven`.
1. Under `Select type of time based trigger` select `Day Timer`
1. Under `Select time of day` select the time that you would like for it to perform the daily copy.
1. Select Save and the script should automatically copy the crypto balance based on the time you selected. 
