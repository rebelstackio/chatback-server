'use strict';
const nodemailer = require('nodemailer');

const ERROR = require('error');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'libresoft2@gmail.com',
		pass: 'LibreSoftPeru'
	}
});


const recoverSessionEmailNotification = function _recoverSession( email , token, next) {
	let mailOptions = {
			from: 'no-reply@rebelchat.com', // sender address
			to: email,
			subject: 'Recover Session', // Subject line
			text: 'Code: ' + token, // plain text body
			html: '<b>Code:</b> ' + token // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return next(
					new ERROR.ServerError(
						error
					)
				)
			} else {
				LOGGER.info( 'Email sent: ' + info.messageId + ' ' + info.response );
				return next(null);
			}
	});
}

exports.recoverSessionEmailNotification = recoverSessionEmailNotification;
