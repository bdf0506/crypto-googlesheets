//API KEYS

var coinbase_apikey = "<fill in>"
var coinbase_secret = "<fill in>"

var binance_apikey = "<fill in>"
var binance_secret = "<fill in>"

//***********Coinbase****************

/**
 * Returns the positions in your Coinbase account portfolio.
 *
 * @returns The positions in your portfolio.
 *
 * @customfunction
 */
function coinbase() {

//timestamp function, convert to seconds from milliseconds
var date = new Date();
var timestamp = Math.floor((date.getTime()/1000)).toString();
var method = "GET"
var requestPath = "/v2/accounts?limit=100"

var input = timestamp + method + requestPath
var key = coinbase_secret

var byteSignature = Utilities.computeHmacSha256Signature(input,key);
var signature = byteSignature.reduce(function(str,chr){
  chr = (chr < 0 ? chr + 256 : chr).toString(16);
  return str + (chr.length==1?'0':'') + chr;
},'');

var options = {
  "method" : "GET",
  "headers" :  {
    "CB-ACCESS-KEY" : coinbase_apikey, 
    "CB-ACCESS-SIGN" : signature,
    "CB-ACCESS-TIMESTAMP" : timestamp,
    "CB-VERSION" : "2019-11-15",
    "Content-Type" : "application/json"}
  }
var myurl = `https://api.coinbase.com${requestPath}`
var result = UrlFetchApp.fetch(myurl, options);

// Grab current spot prices
var prices_url = "https://api.coinbase.com/v2/prices/USD/spot"
var prices_result = UrlFetchApp.fetch(prices_url);

//Parse JSON
var obj = JSON.parse(result);
var obj2 = JSON.parse(prices_result)

let oA=[];
  obj.data.forEach((o,i)=>{
    if(o.balance.amount>0) {
      let curr = o.balance.currency;
      oA.push([curr,Number(o.balance.amount)]);
       obj2.data.forEach((o,i)=> {
        if (o.base == curr) {
        oA[oA.length-1].push(Number(o.amount));
        }
       });
      };
  });

oA.sort();
Logger.log(oA);
return oA;
}

// TIMESTAMP=$(date +%s);
// COINBASE_SECRET=<api_secret>;
// BODY="/v2/accounts?limit=1";
// SIGN=$(echo -n "${TIMESTAMP}GET${BODY}" | openssl dgst -sha256 -hmac "$COINBASE_SECRET" | cut -d' ' -f2);
// curl https://api.coinbase.com${BODY} \
//     -H "CB-ACCESS-KEY: <api_key>" \
//     -H "CB-ACCESS-SIGN: $SIGN"  \
//     -H "CB-ACCESS-TIMESTAMP: $TIMESTAMP"  \
//     -H "CB-VERSION: 2019-11-15" \
//     -H "Content-Type: application/json"


/**
 * Returns the current value of a Crypto to USD in Coinbase.
 *
 * @param {"BTC"} crypto ticker
 * 
 * @returns The positions in your portfolio.
 *
 * @customfunction
 */
function coinbase_quote(symbol) {

var myurl = `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`
var result = UrlFetchApp.fetch(myurl);
var contents = result.getContentText();
var json = JSON.parse(contents);
var price = Number(json["data"]["amount"]);

return price

}



//***********Binance**********************

/**
 * Returns the positions in your Binance account portfolio.
 *
 * @returns The positions in your portfolio.
 *
 * @customfunction
 */
function binance() {

//timestamp function, binance needs milliseconds
var date = new Date();
var timestamp = Math.floor((date.getTime())).toString();
var requestPath = "/api/v3/account"

var input = `timestamp=${timestamp}`
var key = binance_secret

var byteSignature = Utilities.computeHmacSha256Signature(input,key);
var signature = byteSignature.reduce(function(str,chr){
  chr = (chr < 0 ? chr + 256 : chr).toString(16);
  return str + (chr.length==1?'0':'') + chr;
},'');

var options = {
  "method" : "GET",
  "headers" : { "X-MBX-APIKEY" : binance_apikey }
}

var myurl = `https://api.binance.us${requestPath}?${input}&signature=${signature}`
var result = UrlFetchApp.fetch(myurl, options);

// Grab current ticker prices
var prices = "https://api.binance.us/api/v3/ticker/price"
var prices_result = UrlFetchApp.fetch(prices);

//Parse JSON
var obj = JSON.parse(result);
var obj2 = JSON.parse(prices_result);

 let oA = [];
 obj.balances.forEach((o,i)=>{
   if(o.free>0) {
 //append USD to the end of ticker symbols, to match the ticker price api
     let curr = o.asset.concat("USD")
      oA.push([o.asset,Number(o.free)]);
    obj2.forEach((o,i)=> {
       if (o.symbol == curr) {
        oA[oA.length-1].push(Number(o.price));
        }
       });
      };
  });

Logger.log(oA);
oA.sort();
return oA
}

// TIMESTAMP=$(($(date +%s%N)/1000000))
// BINANCE_SECRET=<api_secret>
// BODY="timestamp=${TIMESTAMP}"
// SIGN=$(echo -n "${BODY}" | openssl dgst -sha256 -hmac "$BINANCE_SECRET" | cut -d' ' -f2)
// curl "https://api.binance.us/api/v3/account?${BODY}&signature=${SIGN}" \
//     -H "X-MBX-APIKEY: <api_key>"


/**
 * Returns the current value of a Crypto to USD in Coinbase.
 *
 * @param {"BTC"} crypto ticker
 * 
 * @returns The positions in your portfolio.
 *
 * @customfunction
 */

function binance_quote(symbol) {

var myurl = `https://api.binance.us/api/v3/ticker/price?symbol=${symbol}USD`
var result = UrlFetchApp.fetch(myurl);
var contents = result.getContentText();
var json = JSON.parse(contents);
var price = Number(json["price"]);

return price

}
