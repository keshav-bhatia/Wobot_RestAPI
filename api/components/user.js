const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req,res,next)=>{
	User.find({email:req.body.email})
		.exec()
		.then(user =>{
			if(user.length >= 1){
				console.log(user);
				return res.status(409).json({
					message:'User Already Exist!!'
				});
			}
			else{
				bcrypt.hash(req.body.password,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}
					else{
						const user = new User({
							_id:new mongoose.Types.ObjectId(),
							email:req.body.email,
							password:hash
						})
						user
							.save()
							.then(result=>{
								console.log(result);
								res.status(201).json({
									message:'User Successfully Created!!'
								});
							})
					}
				});	
			}

		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({
				error:err
			});
		});
};

exports.login = (req,res,next)=>{
	User.find({email:req.body.email})
		.exec()
		.then(user=>{
			if(user.length < 1){
				return res.status(401).json({
					message:'Auth Failed!!'
				});
			}
			else{
				bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
					if(err){
						// console.log(err);		
						return res.status(401).json({
							message:'Auth Failed!!'
						});
					}
					if(result){
						const token = jwt.sign(
							{
								email:user[0].email,
								Id:user[0]._id
							},
							'secret',
							{
								expiresIn:'1h'
							}
						);

						return res.status(200).json({
							message:'Auth Successful!!',
							token:token
						});
					}
					return res.status(401).json({
						message:'Auth Failed!!'
					});
				});
			}
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({
				error:err
			});
		});
};

