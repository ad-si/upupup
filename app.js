var formidable = require('formidable'),
	http = require('http'),
	util = require('util'),
	fs = require('fs'),
	path = require('path'),
	auth = require('http-auth'),
	express = require('express'),
	app = express(),

	basic = auth({
		authRealm: "Private area.",
		authList: ['guest:iamavisitor7']
	})


app.get('/', function (request, response) {

	basic.apply(request, response, function () {

		response.send(
			'<form action="/upload" enctype="multipart/form-data" method="post">' +
			'<input type="file" name="upload" multiple="multiple">' +
			'<br>' +
			'<br>' +
			'<input type="submit" value="Upload">' +
			'</form>'
		)
	})
})


app.get('/upload', function (request, response) {
	response.redirect('/')
})
app.post('/upload', function (request, response) {

	basic.apply(request, response, function () {

		var form = new formidable.IncomingForm(),
			files = [],
			fields = []


		function makeDir(callback) {

			var directoryName = new Date()
					.toJSON()
					.replace(/:/g, '-')
					.slice(0, 19),
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
						callback(directoryPath)
				})
		}

		function onField(field, value) {

			console.log(field, value)

			fields.push({
				name: field,
				value: value
			})
		}

		function onFile(field, file, directoryName) {

			console.log(file.name)

			files.push({
				name: file.name,
				type: file.type,
				size: file.size
			})

			var newfilePath = path.join(
				directoryName,
				file.name
					.toLowerCase()
					.replace(/ /g, '-')
			)

			fs.rename(
				file.path,
				newfilePath,
				function (error) {
					if (error) throw error
				}
			)
		}

		function onEnd() {

			response.send(
				'<h1>Upload completed</h1>' +
				'\n\n' +
				'Received files:\n\n' +
				'<ul>' +
				files
					.map(function (file) {
						return '<li>' + file.name + '</li>'
					})
					.join('') +
				'</ul>' +
				'<br>' +
				'<a href="/">Upload more</a>'
			)
			response.end()
		}


		makeDir(function (directoryPath) {

			form
				.on('field', onField)
				.on('file', function (field, file) {
					onFile(field, file, directoryPath)
				})
				.on('end', onEnd)

			form.parse(request)
		})
	})
})

module.exports = app
