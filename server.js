var path = require('path'),
	express = require('express'),
	serveIndex = require('serve-index'),

	upupup = require('./app.js'),

	app = express(),
	port = 3000


app.use(express.static(path.join(__dirname, 'public')))

app.use('/files', express.static(path.join(__dirname, 'files')))
app.use('/files', serveIndex('files', {icons: true}))

app.use(upupup)

app.listen(port, function () {
	console.log('Sever listening on port', port)
})