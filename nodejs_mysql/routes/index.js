var express = require('express');
var router = express.Router();

/* home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  var db = req.con;
  var data = "";

  var user = "";
  var user = req.query.user;

  var filter = "";
  if(user){
    filter = 'WHERE userid = ?';
  }

  db.query('SELECT * FROM test.info', function(err, rows){
    if(err){
      console.log(err);
    }
    data = rows;

    // usee index.ejs
    res.render('index',{title:'Personal Information', data:data, user:user});

  })
});

// add page
router.get('/add', function(req, res, next){

  // use userAdd.ejs
  res.render('userAdd',{title:'Add info'});
});

// add post
router.post('/userAdd', function(req, res, next){
  var db = req.con;

  var sql = {
    userid:req.body.userid,
    password:req.body.password,
    email:req.body.email
  }

  //console.log(sql);
  var qur = db.query('INSERT INTO info SET ?', sql, function(err, rows) {
    if (err) {
        console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/');
  });
});

// edit page
router.get('/userEdit', function(req, res, next){
  var id = req.query.id;
  var db = req.con;
  var data="";

  db.query('SELECT * FROM info WHERE id = ?', id, function(err,rows){
    if(err){
      console.log(err);
    }

    data = rows
    res.render('userEdit',{title:'Edit info', data:data});
  });
});

// edit post
router.post('/userEdit',function(req, res, next){
  var db = req.con;
  var id = req.body.id;

  var sql = {
    userid: req.body.userid,
    password: req.body.password,
    email:  req.body.email
  };

  var qur = db.query('UPDATE info SET ? WHERE id = ?',[sql, id], function(err, rows){
    if(err){
      console.log(err);
    }

    res.setHeader('Content-Type','application/json');
    res.redirect('/');
  });
});

// delete get
router.get('/userDelete', function(req, res, next) {

  var id = req.query.id;
  var db = req.con;

  var qur = db.query('DELETE FROM info WHERE id = ?', id, function(err, rows) {
      if (err) {
          console.log(err);
      }
      res.redirect('/');
  });
});
module.exports = router;