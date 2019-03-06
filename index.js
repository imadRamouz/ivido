const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const passport = require('passport');
const { mongoURI } = require('./config/database');
const app = express();

require('./config/passport')(passport);

mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(() => console.log('connected to mongoDB database....'))
  .catch(err => console.log(err));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/ideas', ideas);
app.use('/users', users);

// index page route
app.get('/', (req, res) => {
  const title = "Welcome :)";
  res.render('index', { title });
});

// about page route
app.get('/about', (req, res) => {
  res.render('about');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listenning on port ${port} ..............`));