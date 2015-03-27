var express = require('express'),
	upupup = require('./app.js'),
	app = express(),
	port = 3000


app.use(upupup)

app.listen(port, function () {
	console.log('Sever listening on port', port)
})