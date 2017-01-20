var express = require('express');
var config = require('../config');
var path = require('path');
var articleModel = require('../models/articleModel.js');
var logger =  require('../lib/log.js').logger('viewRouter');
var router = express.Router();
var ppt2png = require('ppt2png');
var unoconv = require('unoconv');
var office2pdf = require('office2pdf'),
  generatePdf = office2pdf.generatePdf;


// router.post('/ppt', function(req, res) {
// 	var path = req.body.path;
// 	var index = path.lastIndexOf('.');
// 	var imgPath = path.substr(0,index) + '/pdf';
// 	var pdfPath = path.substr(0,index) + '.pdf';
// 	path = config.uploadDir + '/' + path;
// 	imgPath = config.uploadDir + '/' + imgPath;
// 	path= path.replace(/\//g,'\\');
// 	imgPath= path.replace(/\//g,'\\');
// 	pdfPath= path.replace(/\//g,'\\');
	
// 	console.log(path);console.log(imgPath);
// 	// generatePdf(path, function(err, result) {
// 	// 	console.log(err);
// 	// }); 
//   	sh -c unoconv -f pdf -o \\young\\node\\moka\\public\\uploads\\jsjn\\课件\\A.军训技能\\战伤救护.ppt \\young\\node\\moka\\public\\uploads\\jsjn\\课件\\A.军训技能\\战伤救护.ppt
//   	 unoconv  -f pdf  /young/node/moka/public/uploads/jsjn/1.ppt
// 	ppt2png(path, imgPath, function(err,result){
// 	    if(err) {
// 	    	console.log(err);
// 	        return res.json({
// 	        	success : false
// 	        });
// 	    } else {
// 	        console.log('convert successful.');
// 	        console.log(result);
// 	        return res.json({
// 	        	success : true,
// 	        	data : result
// 	        });
// 	    }
// 	}); 
// });
var exec = require('child_process').exec;
router.post('/ppt', function(req, res) {
	var path = req.body.path;
	var id = req.body.id;
	var index = path.lastIndexOf('.');
	var pdfPath = path.substr(0,index) + '.pdf';
	var view_name = pdfPath;
	var srcPath = config.uploadDir + '/' + pdfPath;
	path = config.uploadDir + '/' + path;
	pdfPath = config.uploadDir + '/' + pdfPath;
	// path= path.replace(/\//g,'\\');
	// pdfPath= pdfPath.replace(/\//g,'\\');
	

	var cmd = 'java -jar /home/young/utils/pptUtils.jar "' + path + '" "'+ pdfPath +'"';
	console.log(cmd);
	exec(cmd, [], function(re){
		// console.log(re);
		articleModel.updateViewName(id, view_name, function(err){
			if(err){
				return res.json({
					success : false,
					msg : '转换失败，请重试'
				});
			}
			return res.json({
				success : true,
				src : view_name
			});
		});
		
	})
});


router.post('/doc', function(req, res) {
	var path = req.body.path;
	var index = path.lastIndexOf('.');
	var pdfPath = path.substr(0,index) + '.pdf';
	var viewName = pdfPath;
	var srcPath = config.uploadDir + '/' + pdfPath;
	path = config.uploadDir + '/' + path;
	pdfPath = config.uploadDir + '/' + pdfPath;
	path= path.replace(/\//g,'\\');
	pdfPath= pdfPath.replace(/\//g,'\\');
	
	var cmd = 'java -jar d://pptUtils.jar "' + path + '" "'+ pdfPath +'"';
	console.log(cmd);
	exec(cmd, [], function(re){
		console.log(re);
		res.json({
			src : srcPath
		});
	})
});

module.exports = router;



// var msopdf = require('node-msoffice-pdf');
// router.post('/ppt', function(req, res) {
// 	var path = req.body.path;
// 	var index = path.lastIndexOf('.');
// 	var imgPath = path.substr(0,index) + '/pdf';
// 	var pdfPath = path.substr(0,index) + '.pdf';
// 	path = config.uploadDir + '/' + path;
// 	imgPath = config.uploadDir + '/' + imgPath;
// 	path= path.replace(/\//g,'\\');
// 	imgPath= path.replace(/\//g,'\\');
// 	pdfPath= path.replace(/\//g,'\\');
// 	msopdf(null, function(error, office) { 
// 	    if (error) { 
// 	      console.log("Init failed", error);
// 	      return;
// 	    }
// 	   office.powerPoint({input: path, output: pdfPath}, function(error, pdf) { 
// 	       if (error) { 
// 	           console.log("Woops", error);
// 	       } else { 
// 	           console.log("Saved to", pdf);
// 	       }
// 	   });
// 	   office.close(null, function(error) { 
// 	       if (error) { 
// 	           console.log("Woops", error);
// 	       } else { 
// 	           console.log("Finished & closed");
// 	       }
// 	   });
// 	});
// });

// msopdf(null, function(error, office) { 
 
//     if (error) { 
//       console.log("Init failed", error);
//       return;
//     }
 
//    /*
//      There is a queue on the background thread, so adding things is non-blocking.
//    */
 
//    office.word({input: "infile.doc", output: "outfile.pdf"}, function(error, pdf) { 
//       if (error) { 
//            /* 
//                Sometimes things go wrong, re-trying usually gets the job done
//                Could not get remoting to repiably not crash on my laptop
//            */
//            console.log("Woops", error);
//        } else { 
//            console.log("Saved to", pdf);
//        }
//    });
 
 
//    office.excel({input: "infile.xlsx", output: "outfile.pdf"}, function(error, pdf) { 
//        if (error) { 
//            console.log("Woops", error);
//        } else { 
//            console.log("Saved to", pdf);
//        }
//    });
 
 
//    office.powerPoint({input: "infile.pptx", output: "outfile.pdf"}, function(error, pdf) { 
//        if (error) { 
//            console.log("Woops", error);
//        } else { 
//            console.log("Saved to", pdf);
//        }
//    });
 
//    /*
//      Word/PowerPoint/Excel remain open (for faster batch conversion)
 
//      To clean them up, and to wait for the queue to finish processing
//    */
 
//    office.close(null, function(error) { 
//        if (error) { 
//            console.log("Woops", error);
//        } else { 
//            console.log("Finished & closed");
//        }
//    });
// });