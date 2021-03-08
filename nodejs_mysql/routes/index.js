let express = require('express');
let router = express.Router();
let sum=0;
/* home page. */
router.get('/', (req, res, next)=> {
  // res.render('index', { title: 'Express' });

  let db = req.con;
  let data = "";

  let user = "";
  user = req.query.user;

  let filter = "";
  if(user){
    filter = 'WHERE userid = ?';
  }

  db.query(`SELECT * FROM test.info`, (err, rows)=>{
    if(err){
      console.log(err);
    }
    data = rows;
    sum = data.length;

    // usee index.ejs
    res.render('index',{title:'Personal Information', data:data, user:user});

  })
});

// add page
router.get('/add', (req, res, next)=>{

  // use userAdd.ejs
  res.render('userAdd',{title:'Add info'});
});

// add post
router.post('/userAdd', (req, res, next)=>{
  let db = req.con;
  
  let sql = {
    id:sum,
    userid:req.body.userid,
    password:req.body.password,
    email:req.body.email
  }

  //console.log(sql);
  let qur = db.query('INSERT INTO info SET ?', sql, (err, rows) => {
    if (err) {
        console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/');
  });
});

// edit page
router.get('/userEdit', (req, res, next) => {
  let id = req.query.id;
  let db = req.con;
  let data="";

  db.query('SELECT * FROM info WHERE id = ?', id, (err,rows) => {
    if(err){
      console.log(err);
    }

    data = rows
    res.render('userEdit',{title:'Edit info', data:data});
  });
});

// edit post
router.post('/userEdit', (req, res, next) => {
  let db = req.con;
  let id = req.body.id;

  let sql = {
    userid: req.body.userid,
    password: req.body.password,
    email:  req.body.email
  };

  let qur = db.query('UPDATE info SET ? WHERE id = ?',[sql, id], (err, rows) => {
    if(err){
      console.log(err);
    }

    res.setHeader('Content-Type','application/json');
    res.redirect('/');
  });
});

// delete get
router.get('/userDelete', (req, res, next) => {

  let id = req.query.id;
  let db = req.con;

  let qur = db.query('DELETE FROM info WHERE id = ?', id, (err, rows) => {
      if (err) {
          console.log(err);
      }
      res.redirect('/');
  });
});
module.exports = router;