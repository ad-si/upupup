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

		form
			.on('field', function (field, value) {
				console.log(field, value)
				fields.push({
					name: field,
					value: value
				})
			})

			.on('file', function (field, file) {
				console.log(file.name)

				files.push({
					name: file.name,
					type: file.type,
					size: file.size
				})

				var filePath = path.join(
					__dirname,
					'files',
					file.name.toLowerCase().replace(/ /g, '-')
				)

				fs.rename(file.path, filePath, function (error) {
					if (error)
						console.log('Error: ' + error)
				})
			})

			.on('end', function () {

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
			})

		form.parse(request)
	})
})

module.exports = app
