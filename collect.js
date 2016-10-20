var credentials = require('./config.js');
fs = require('fs');
var request = require('request');

// create reusable transporter object using the default SMTP transport
// var transporter = nodemailer.createTransport('smtps://'+credentials.emailuser+'%40gmail.com:'+credentials.emailpass+'@smtp.gmail.com');

var msg = ""
var i=0

request.get(credentials.url, {
	'auth': {
	'user': credentials.user,
	'pass': credentials.pass,
}
},function (error, response, body) {
  if(response.statusCode == 200){
    // console.log('document received')

    result = JSON.parse(body)
 	for(var i = 0; i < result.results.length; i++) {
 		spaceurl = result.results[i]._links.self
 		request.get(spaceurl+'/content/', {
			'auth': {
			'user': credentials.user,
			'pass': credentials.pass,
		}
		},function (error, response, body) {
		  if(response.statusCode == 200){
		    // console.log('document received')

		    result = JSON.parse(body)
		 	for(var i = 0; i < result.page.results.length ; i++) {
		 		pageurl = result.page.results[i]._links.self
		 		
		 		request.get(pageurl+'?expand=space,body.view,version,container', {
					'auth': {
					'user': credentials.user,
					'pass': credentials.pass,
				}
				},function (error, response, body) {
				  if(response.statusCode == 200){
				    // console.log('document received')
				    result = JSON.parse(body)
				    msg = result.body.view.value

					// setup e-mail data with unicode symbols
					var mailOptions = {
					    from: credentials.from,
					    to: credentials.to,
					    subject: 'Time Tracker Testing - ' + result.title,
					    // subject: 'Hello ✔', // Subject line
					    // text: 'Hello world 🐴', // plaintext body
					    // html: '<b>Hello world 🐴</b>' // html body
					    text: msg,
					    html: msg
					};

					var filename = "./data/" + (i++) + ".json"

					fs.writeFile(filename, JSON.stringify(mailOptions), function (err) {
					  if (err) return console.log(err);
					  console.log('file sucessfully created!');
					});

				  } else {
				    console.log('error: '+ response.statusCode)
				    console.log(body)
				  }
				});

		 	}
		  } else {
		    console.log('error: '+ response.statusCode)
		    console.log(body)
		  }
		});
 	}
  } else {
    console.log('error: '+ response.statusCode)
    console.log(body)
  }
});