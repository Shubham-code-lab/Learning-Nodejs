const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const expressHandlebars = require('express-handlebars');

const app = express();

// PUG :-Built in
// app.set('view engine', 'pug'); //view engine (templating engine)  which pug  
// app.set('views', 'views');    //no need when your views folder contain pug files it is set default, otherwise('views', 'folderName')

// express-handlebars :- 3rd party
// app.engine('hbs',expressHandlebars.engine({
//     extname: '.hbs',
//     defaultLayout: 'main-layout',    //set to null if you don't have main-layout
//     layoutsDir: 'views/layouts/'             
// })); //it is not built in engine so we register it like this and now we use (hbs) as extension we can name as we want 
// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');
app.set('views', 'views'); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: 'Not Found'});         //render 404.pug 
});

app.listen(3000);
