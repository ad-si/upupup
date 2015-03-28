var path = require('path'),
	express = require('express'),

	upupup = require('./app.js'),

	app = express(),
	port = 3000


app.use(express.static(path.join(__dirname, 'public')))

app.use(upupup)

app.listen(port, function () {
	console.log('Sever listening on port', port)
})