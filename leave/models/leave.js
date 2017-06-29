var mongoose = require('mongoose');

// leave Schema
var LeaveSchema = mongoose.Schema({
	User_id:{
		type:String
	},
	StartDate:{
		type:Date,
		validate: [StartDateValidator, ' Start Date must be greater than Current date']
	},
	EndDate:{
		type:Date,
		validate: [dateValidator, ' End Date must be greater than Start date']
	},
	LeaveType: {
		type: String, 
		enum: ["Sick", "Maternity", "dash"]
	},
	Reason: {
		type: String,
		required:true
	},
	RequestBy: {
		type: String
	},
	RequestedAt: {
		type:Date,
		default: Date.now
	},
	ApprovalStatus: {
		type: String, 
		enum: ["Approved", "Rejected",'Pending'],
		default: 'Pending'
	},
	ApprovedAt: {
		type:Date
	}
});


function dateValidator(value) {
 
  return this.StartDate <= value;
}
function StartDateValidator(value) {
 
  return value >= Date.now();
}
var Leave = module.exports = mongoose.model('Leave', LeaveSchema);
module.exports.addLeave=function(genre,callback){
	Leave.create(genre,callback);
}