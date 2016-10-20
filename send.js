var credentials = require('./config.js');
var nodemailer = require('nodemailer');
var fs = require('fs')
var readline = require('readline')

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://'+credentials.emailuser+'%40gmail.com:'+credentials.emailpass+'@smtp.gmail.com');

var msg = ""
var lines = []

var num = Math.floor(Math.random() * (5 - 1) + 1);
var filename = './data/template-'+num+'.txt'
var attachment = './data/template-'+num+'.pdf'

console.log(num)

if(num > 2) {
	filename = './data/template-'+(num-2)+'.txt'
	attachment = './data/template-'+(num-2)+'.pdf'
}

var rl = readline.createInterface({
      input : fs.createReadStream(filename),
      output: process.stdout,
      terminal: false
})
rl.on('line',function(line){
     // console.log(line) //or parse line
     msg += line;
     lines.push(line);
})
rl.on('error',function(err){
     console.log(err) //or parse line
})
rl.on('close',function(){
     
	if(num > 2)
	{
		var mailOptions = {
		    from: credentials.from,
		    to: credentials.to,
		    subject: 'Time Tracker Testing - ' + lines[Math.floor(Math.random() * (lines.length - 1) + 1)],
		    // subject: 'Hello ✔', // Subject line
		    // text: 'Hello world 🐴', // plaintext body
		    // html: '<b>Hello world 🐴</b>' // html body
		    text: msg,
		    html: msg,
		    attachments: [ { path: attachment } ]
		};
	}
	else {

		var mailOptions = {
		    from: credentials.from,
		    to: credentials.to,
		    subject: 'Time Tracker Testing - ' + lines[Math.floor(Math.random() * (lines.length - 1) + 1)],
		    // subject: 'Hello ✔', // Subject line
		    // text: 'Hello world 🐴', // plaintext body
		    // html: '<b>Hello world 🐴</b>' // html body
		    text: msg,
		    html: msg
		};

	}

	transporter.sendMail(mailOptions, function(error, info){
	if(error){
	    return console.log(error);
	}
	console.log('Message sent: ' + info.response);
	});

})