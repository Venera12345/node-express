const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const add = require('./routes/add');
const auth = require('./routes/auth');
const home = require('./routes/home');
const card = require('./routes/card');
const courses = require('./routes/courses');
const order = require('./routes/order');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const User = require('./models/users');
const hbs = exphbs.create({

})
const password = 'NNxOiWlCYdXNIt1i'

//настройка handalbars
app.engine('hbs', exphbs({
    layout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');
// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(async (req,res,next)=>{
    try {
        const user = await User.findById('6040a5d1a4e32432a857ed70');
        req.user = user;
        next()
    } catch (e) {
        console.log(e);
    }

})
app.use('/', home);
app.use('/add', add);
app.use('/card', card);
app.use('/courses', courses);
app.use('/order', order);
app.use('/auth', auth);

const PORT = process.env.PORT || 3000;
async function start () {
    try{
        const url = 'mongodb+srv://Venera:NNxOiWlCYdXNIt1i@cluster0.hqc7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        await mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});
        const candidate = await User.findOne();
         if(!candidate){
           const user = new User({
               email: 'venera_husainova@mail.ru',
               name: 'Venera',
               card: {
                   item: []
               }
           });
           await user.save();
         }
        app.listen(PORT, ()=>{
            console.log('Сервер запущен на порту ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }

}
start()

