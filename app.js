var formidable = require('formidable'),
	fs = require('fs'),
	path = require('path'),
	auth = require('http-auth'),
	express = require('express'),
	app = express(),

	basic = auth.basic(
		{
			realm: "Adrian's Server"
		},
		function (username, password, callback) {
			callback(
				username === process.env.upupup_user &&
				password === process.env.upupup_password
			)
		}
	)


app.use(auth.connect(basic))

app.get('/', function (request, response) {
	response.render('index.jade')
})


app.get('/upload', function (request, response) {
	response.redirect('/')
})
app.post('/upload', function (request, response) {

	var form = new formidable.IncomingForm(),
		files = [],
		fields = [],
		directoryIsCreated = false,
		directoryPath


	function makeDir(callback) {

		var directoryName = new Date()
			.toJSON()
			.replace(/:/g, '-')
			.slice(0, 19)

		directoryPath = path.join(__dirname, 'files', directoryName)

		fs.mkdir(
			directoryPath,
			function (error) {
				if (error &&
					error.message.search('file already exists') !== -1) {

					console.error(error.message)
					makeDir(callback)
				}
				else
					callback()
			})
	}

	function onField(field, value) {

		console.log(field, value)

		fields.push({
			name: field,
			value: value
		})
	}

	function onFile(field, file) {

		if (file.size > 0) {

			files.push({
				name: file.name,
				type: file.type,
				size: file.size
			})

			if (!directoryIsCreated)
				makeDir(function () {
					moveFile(file)
				})
			else
				moveFile(file)
		}
	}

	function moveFile(file) {

		var newFilePath = path.join(
			directoryPath,
			file.name
				.toLowerCase()
				.replace(/ /g, '-')
		)

		fs.rename(
			file.path,
			newFilePath,
			function (error) {
				if (error) throw error
			}
		)
	}

	function onEnd() {
		response.render('upload.jade', {files: files})
	}

	form
		.on('field', onField)
		.on('file', onFile)
		.on('end', onEnd)

	form.parse(request)
})

module.exports = app
