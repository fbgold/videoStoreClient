const port = 3030;
const express = require('express');
const expbs = require('express-handlebars');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();

app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(bodyparser.json())

app.use(express.static('public'));

const hbs = expbs.create({
    extname:'hbs',
    layoutsDir: path.join(__dirname , '/views/layouts'),
    partialsDir: path.join(__dirname , 'views/segments'), 
    defaultLayout:'mainLayout',
    helpers:{
        eq: function (v1, v2) {
            return v1 === v2;
        },
        ne: function (v1, v2) {
            return v1 !== v2;
        },
        lt: function (v1, v2) {
            return v1 < v2;
        },
        gt: function (v1, v2) {
            return v1 > v2;
        },
        lte: function (v1, v2) {
            return v1 <= v2;
        },
        gte: function (v1, v2) {
            return v1 >= v2;
        },
        and: function () {
            return Array.prototype.slice.call(arguments).every(Boolean);
        },
        or: function () {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    }
});
app.engine('hbs',hbs.engine)
app.set('view engine', 'hbs');  //if changing file extensions, then change 'hbs' to '.myExt'


const videoController = require('./controllers/videoController.js');

app.use('/video',videoController);

app.listen(port,()=>{
    console.log('*Video started on port:' + port);
})
