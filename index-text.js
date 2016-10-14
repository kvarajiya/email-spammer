var credentials = require('./config.js');

var nodemailer = require('nodemailer');
var request = require('request');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://'+credentials.emailuser+'%40gmail.com:'+credentials.emailpass+'@smtp.gmail.com');

var msg = ""

request.get(credentials.url, {
	'auth': {
	'user': credentials.user,
	'pass': credentials.pass,
}
},function (error, response, body) {
  if(response.statusCode == 200){
    // console.log('document received')

    result = JSON.parse(body)
 	for(var i = 0; i < 1; i++) {
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
		 	for(var i = 0; i < 1 ; i++) {
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

					var waitTill = new Date(new Date().getTime() + 1 * 1000);
					while(waitTill > new Date());

				    // send mail with defined transport object
					transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					        return console.log(error);
					    }
					    console.log('Message sent: ' + info.response);
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
