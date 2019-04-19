var express    = require('express')
var bodyParser = require('body-parser')
const driver = require('bigchaindb-driver')

const alice = new driver.Ed25519Keypair()
const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')


var app = express()

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  console.log(req.body) // populated!
  const tx = driver.Transaction.makeCreateTransaction(
    { message: req.body },
    null,
    [ driver.Transaction.makeOutput(
        driver.Transaction.makeEd25519Condition(alice.publicKey))],
    alice.publicKey)
  const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
  console.log(conn.postTransactionCommit(txSigned))
  next()
})

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
