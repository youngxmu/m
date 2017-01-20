var nodemailer = require('nodemailer');
 
// create reusable transporter object using SMTP transport
// var smtpTransport = nodemailer.createTransport("SMTP", {
//     host: "smtp.163.com", // hostname
//     secureConnection: true, // use SSL
//     port: 465,
//     auth: {
//         user: "m18995603859@163.com",
//         pass: "123456mm"
//     }
// });

var smtpTransport = nodemailer.createTransport({
    service: "QQ", // hostname
    auth: {
        user: "251795559@qq.com",
        pass: "zcz19630928"
    }
});
 
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
 


exports.sendMail = function(options, callback) {
    // send mail with defined transport object
    smtpTransport.sendMail(options, function(error, info) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log('Message sent: ' + info.response);
            callback();
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};

 