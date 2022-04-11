const express = require('express')
const path = require("path");
const createError = require("http-errors");
const app = express();
const port= 3000;
const logger= require('morgan');

// set UserList
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
app.use(logger('combined'));

// set mongoDB
const mongoose = require('mongoose');
const {request} = require("express");
mongoose.connect("mongodb+srv://test:test@cluster0.yuixa.mongodb.net/Info?retryWrites=true&w=majority");
var InfoSchema = mongoose.Schema({
    name: String,
    description: String,
});

InfoSchema.method.getName = function(){
    return this.name;
};
InfoSchema.method.getDescription = function(){
    return this.description;
};

var InfoModel = mongoose.model("Info", InfoSchema);

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
  res.render('landingPage', {Title: "Test Title in App.js", message: "This is a message from JS app"})
})
// something else
app.get("/somethingElse", function(req,res){
  res.render('somethingElse', {Title: "Something Else Page"})
})

// index page
app.get("/index", function(req, res){
    res.render('index', {Title: "Index Page"})
})

// save endpoint
app.post('/save', function(req, res){
    console.log("Data Post Operation");
    console.log(mongoose.connection.readyState)
    try{
        var Name= req.body.name;
        var Des = req.body.description;
        let Info = new InfoModel({name: Name, description: Des});
        console.log(Info);
        Info.save().then(r => console.log(r));
    }
    catch(e){
        console.log("Exception inserting a doc");
    }

    // res.send('complete');
});

// getInfo endpoint
const getInfo = async function(req, res){
    console.log('Accessing to DB')
    let Info_func = () => (InfoModel.findOne({_name: "Huy Tuan Tran"}).exec());
    console.log(Info_func);
    try{res.send({"Info list": await Info_func})}
    catch(e){
        console.log(e);
    }
}
app.get('/info_get', getInfo)

// error page
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
