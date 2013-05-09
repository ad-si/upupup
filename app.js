var formidable = require('formidable'),
	http = require('http'),
	util = require('util'),
	fs = require('fs'),
	auth = require('http-auth")

http.createServer(function(req, res) {

	basic.apply(req, res, function(username) {
        	// Your request handling logic goes there
        	res.end("Welcome to private area - " + username + "!");

	if(req.url == '/upload' && req.method.toLowerCase() == 'post') {

		var form = new formidable.IncomingForm(),
			files = [],
			fields = []

		/*form.on('file', function(field, file){
		 console.log(field, value)
		 fields.push()
		 })*/


		form
			.on('field', function(field, value) {
				console.log(field, value)
				fields.push({
					name: field,
					value: value
				})
			})

			.on('file', function(field, file) {
				console.log(file.name)

				files.push({
					name: file.name,
					type: file.type,
					size: file.size
				})

				var path = '/var/www/labs/upload/files/' + file.name.toLowerCase().replace(/ /g, '-')

				fs.rename(file.path, path, function(error){
					if(error)
						console.log('Error: ' + error)
				})
			})

			.on('end', function() {

				console.log('upload done')

				res.writeHead(200, {'content-type': 'text/plain'})

				res.write('Upload completed')
				//res.write('received fields:\n\n ' + util.inspect(fields))
				res.write('\n\n')
				res.end('received files:\n\n ' + util.inspect(files))
			})

		form.parse(req)

		return
	}

	res.writeHead(200, {'content-type': 'text/html'})
	res.end(
		'<form action="/upload" enctype="multipart/form-data" method="post">' +
			//'<label>Name: <label><input type="text" name="title"><br>' +
			'<input type="file" name="upload" multiple="multiple"><br>' +
			'<input type="submit" value="Upload">' +
			'</form>'
	)

)}


}).listen(1234)
