const express = require('express')
const path = require("path");
const createError = require("http-errors");
const app = express()
const port= 3000
const logger= require('morgan')
const UserList = [{username: 'test', password:'1234'},
  {username: 'htt5059', password: 'HuyTran'},
  {userName: 'CMPSC421', password: 'netcentric'}];

// set Passport
const Auth_password = require('passport');
const bodyParser = require("express");
const {route} = require("express/lib/router");
const LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({extended: false}));
app.use(Auth_password.initialize(undefined));

Auth_password.use('local', new LocalStrategy(
    function(username, password, done){
        console.log(username+' '+password);
        let checkUser = username;
        let Info = UserList.find(el => {
            if (el.username == checkUser)
                return el;
        });
        console.log('Found this: '+Info);
        if(Info === undefined || Info === null)
            return done(null, false, {message: 'Incorrect User Name \n'});
        if(Info.password !== password)
            return done(null, false, {message: 'Incorrect Password \n'});
        else{
            console.log("Log in successfully <<<<"+Info.username+">>>> \n");
            return done(null, Info);
        }
    }
))

// set logger
app.use(logger('dev'))

// set view
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')))

// login page
app.get('/login', function (req, res){
    res.render('login', {Title: "Login Page"});
})

app.post('/login', Auth_password.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false
}))

// main page
app.get("/", function(req,res){
  res.render('index', {Title: "Test Title in App.js", message: "This is a message from JS app"})
})
// something else
app.get("/somethingElse", function(req,res){
  res.render('somethingElse', {Title: "Something Else Page"})
})

app.use(function(req, res){
  res.send('<!DOCTYPE html>'+
  '<body>'+
      '<p>Error Page</p>'+
      '<img src=\"./images/sad%20face.png\">'+
  '</body>+</html>');
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(port, () => {
  console.log("Server Running")
})

module.exports = app;
