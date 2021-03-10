const express = require('express');
const router = express.Router();

/* home page. */
router.get('/', (req, res, next)=> {
  // res.render('index', { title: 'Express' });

  const {con} = req;

  const {user} = req.query;

  let filter = "";
  if(user){
    filter = 'WHERE userid = ?';
  }

  con.query(`SELECT * FROM info ${filter}` ,user , (err, rows)=>{
    if(err){
      console.log(err);
    }
    let data = rows;

    // usee index.ejs
    res.render('index',{title:'Personal Information', data, user});

  })
});

// add page
router.get('/add', (req, res, next)=>{

  // use userAdd.ejs
  res.render('userAdd',{title:'Add info'});
});

// add post
router.post('/userAdd', (req, res, next)=>{
  const {con} = req;
  let {userid, password, email} = req.body
  let sql = {
    userid,
    password,
    email,
  }

  //console.log(sql);
  let qur = con.query(`INSERT INTO info SET ?`,sql, (err, rows) => {
    if (err) {
        console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/');
  });
});

// edit page
router.get('/userEdit', (req, res, next) => {
  const {id} = req.query;
  const {con} = req;

  con.query(`SELECT * FROM info WHERE id = ${id}`, (err,rows) => {
    if(err){
      console.log(err);
    }

    let data = rows
    res.render('userEdit',{title:'Edit info', data:data});
  });
});

// edit post
router.post('/userEdit', (req, res, next) => {
  const {con} = req;
  let id = req.body.id;
  const {userid, password, email} = req.body
  let sql = {
    userid,
    password,
    email,
  };

  let qur = con.query(`UPDATE info SET ${sql} WHERE id = ${id}]`, (err, rows) => {
    if(err){
      console.log(err);
    }

    res.setHeader('Content-Type','application/json');
    res.redirect('/');
  });
});

// delete get
router.get('/userDelete', (req, res, next) => {

  const {id} = req.query;
  const {con} = req;

  let qur = con.query(`DELETE FROM info WHERE id = ${id}`, (err, rows) => {
      if (err) {
          console.log(err);
      }
      res.redirect('/');
  });
});
module.exports = router;