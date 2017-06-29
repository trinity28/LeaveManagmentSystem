var express = require('express');
var router = express.Router();

// Get Homepage

var Leave=require('../models/leave')
router.get('/', ensureAuthenticated, function(req, res){
	id=req.user._id
	if(req.user.role==='manager'){
			Leave.find().sort('-RequestedAt').exec(function(err, contact) {
	        if (err) {
	        	console.log("get error")
	            return res.status(400).send();
	        } else {
	        	 console.log(contact)
	            res.render('index',{contact: contact});
	        }
	        });
		
	} else {
		//req.flash('error_msg','You are not logged in');
		Leave.find({User_id:id}).exec(function(err, contact) {
	        if (err) {
	        	console.log("get error")
	            return res.status(400).send();
	        } else {
	        	 console.log(contact)
	            res.render('emp',{contact: contact});
	        }
	        });
		
	}
	
});
router.get('/leaves',ensureAuthenticated, function(req, res){
	if(req.user.role==='employee'){
			res.render('leaveform');
		} 
	
});
router.post('/leaves',function(req,res){
 	
 	console.log(req.user.name)
 	var StartDate=req.body.StartDate,
	EndDate=req.body.EndDate,
	LeaveType=req.body.LeaveType,
	Reason=req.body.Reason,
	RequestBy=req.user.name,
	User_id=req.user._id

    
	req.checkBody('StartDate', 'StartDate is required').notEmpty();
	req.checkBody('EndDate', 'EndDate is required').notEmpty();
	req.checkBody('LeaveType', 'LeaveType is required').notEmpty();
	req.checkBody('Reason', 'Reason is required').notEmpty();
	
	var errors = req.validationErrors();
	if(errors){
		res.render('leaveform',{
			errors:errors
		});
	}
	else{
	var new_user= new Leave({
			RequestBy: RequestBy,
			User_id:User_id,
			Reason:Reason,
			LeaveType: LeaveType,
			StartDate: StartDate,
			EndDate:EndDate}
		);
	
	

	new_user.save(function(err) {
		if (err) {
			console.log(err)
			res.render('leaveform',{
			err:err
		});
		} else {
			res.redirect('/');
		}
	});
	}

	
 })
router.put('/leaves/:_id',function(req,res){
 
 	 Leave.findById(req.params._id,function(err,data){
		var leave=data;
		
		leave.ApprovalStatus=req.body.ApprovalStatus;
		

		leave.save(function(err,data){
			if(err){
				console.log("put error")
				throw err;
			}
			console.log("put suces")
			
			res.redirect('/');
		})



	})
 	 
 })

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;