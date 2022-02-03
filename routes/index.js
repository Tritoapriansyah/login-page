var express = require('express');
var router = express.Router();
var User = require('../models/user');
const url = "mongodb+srv://devn:ma3c140175@devn.je2td.mongodb.net/devn?retryWrites=true&w=majority";
const { Database } = require('quickmongo');
global.db = new Database(url);

db.on("ready", () => {
  console.log('DB connect banh')
})

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.nowa || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({nowa:personInfo.nowa},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							nowa:personInfo.nowa,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"Yay! Berhasil registrasi. Tunggu! sedang mengalihkan halaman..."});
				}else{
					res.send({"Success":"Nomor tersebut sudah terdaftar di database."});
				}

			});
		}else{
			res.send({"Success":"Konfirmasi password tidak sesuai kak"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({nowa:req.body.nowa},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Password salah!"});
			}
		}else{
			res.send({"Success":"Nomor tersebut tidak terdaftar di database!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			db.add(`Saldo_${data.nowa}.saldo`, 0)
			db.get(`Saldo_${data.nowa}`).then(async(agh) => {
		const saldony3 = agh.saldo
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"nowa":data.nowa, "saldo": saldony3});
						})
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({nowa:req.body.nowa},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"Nomor tersebut tidak terdaftar di database!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password berubah!"});
			});
		}else{
			res.send({"Success":"Konfirmasi password tidak sesuai!"});
		}
		}
	});
	
});

module.exports = router;
