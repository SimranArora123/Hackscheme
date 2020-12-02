const express= require('express')
const mongoose =require('mongoose')
const ejs =require('ejs')
const bodyParser = require("body-parser");
const User = require('./models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const indexRoute = require('./routes/index')


mongoose.connect("mongodb+srv://admin-hospital:hospital123@cluster0.5mlfk.mongodb.net/Api?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


app.use(require('express-session')({
    secret: 'this is my secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next();
})

app.use(indexRoute)

const companySchema = mongoose.Schema({
    Address: String,
    CompanyType:String,
    ContractType: String,
    Crop: String,
    Name: String,
    Price: String,
    CIN: String,
    email: String,
    contactNo: String

});


const yojnaSchema = mongoose.Schema({
  Title:String,
  Description:String,
  Image:String,
  link:String   

});


const blogSchema = mongoose.Schema({
    Technology: String,
    Use: String,
    image: String,

});
const Yojna_info = mongoose.model("Yojna_info", yojnaSchema);
const Blog_info = mongoose.model('Blog_info', blogSchema)
const Company_info = mongoose.model('Company_info', companySchema)





app.get('/', (req, res) => {
    Blog_info.find((err, blog) => {
        if (err)
            console.log(err)
        else
            res.render('blog',{blog:blog})
    })

})

app.get('/schemes', (req, res) => {
    Yojna_info.find((err, yojna) => {
        if (err)
            console.log(err)
        else
            res.render('scheme',{yojna:yojna})
    })

})

app.get('/company', (req, res) => {
    Company_info.find((err, company) => {
        if (err)
            console.log(err)
        else{
        console.log(company)
        res.render('company',{company:company})
        }
    })

})
app.post('/schemes', isLoggedIn,function (req, res) {
    var newblog = {
        Technology: req.body.Technology,
        Use: req.body.Use,
        image: req.body.image
        
    }
    Blog_info.create(newblog, function (err, newlyCreated) {
        if (err)
            console.log(err)
        else
            res.redirect('/')

    })

})

app.get('/schemes/new',isLoggedIn, function (req, res) {
    res.render('new')
})




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()
    res.redirect('/login')
}


app.listen(3000, () => console.log('server started on port 3000'))