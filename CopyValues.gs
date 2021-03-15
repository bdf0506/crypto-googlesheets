//Variables
var source_sheet = "Sheet1"
var source_cell = "B1"
var destination_sheet = "Sheet2"
var date_format = "M/d/yyyy"

function copyCryptoBalance(){
  SpreadsheetApp.flush();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var balance = ss.getSheetByName(source_sheet).getRange(source_cell).getValue();
  var balance = +balance.toFixed(2);
  Logger.log(balance);
  var targetSheet = ss.getSheetByName(destination_sheet);
  var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), date_format);

  if(Number(balance)){
  targetSheet.getRange(targetSheet.getLastRow()+1,1,1,2).setValues([[date,balance]]);
  }
  else {
    Utilities.sleep(5000);
    copyCryptoBalance();
  }
}
