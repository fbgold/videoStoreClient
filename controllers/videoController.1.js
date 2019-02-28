var express = require('express');
const rp = require('request-promise');

const router = express.Router();

router.post('/', (req, res) => {
    let body = req.body;
    console.log(body)
    let url = "http://localhost:4040/video/updateStore/";

    var options = {
        method: 'POST',
        uri: "http://localhost:4040/video/updateStore/",
        body: {
            storeInfo: body
        },
        json: true // Automatically stringifies the body to JSON
    };
    
    rp(options).then((storeData)=>{
        console.log(body);

        res.redirect("/video/")
    })
    .catch(function (err) {
        console.log(err);
    });



    
})

function getMovieData(res,url,page){
    rp(url)
        .then((movieRecord) => {
            console.log("got it");
            res.render(page, {
                viewTitle: "Display Video",
                movieData : JSON.parse(movieRecord),
            })
        })
        .catch((err) => {
            console.log("Error: " + err);
        })
}
router.get('/allMovies', (req, res) => {
    let page = "allMovies";
    let url = "http://localhost:4040/video/0";
    getMovieData(res,url,page);
});

router.get('/movie/:Id', (req, res) => {
    const id = req.params.Id;
    let url = "http://localhost:4040/video/" + id;
    //let page = "allMovies";
    let page = "editMovie";
 
    getMovieData(res,url,page);
});

router.get('/', (req, res) => {
    const id = 0;
    let url = "http://localhost:4040/video/" + id;
    let page = "allMovies";
    //let page = "editMovie";
 
    getMovieData(res,url,page);
});

/********** STORE functions************/
function getResultFromDB(url){
   return rp(url)
    .then((result) => {
        return JSON.parse(result);
    })
    .catch((err) => {
        console.log("Error: " + err);
    })
}


router.get('/store/:id', (req, res) => {
    let id = req.params.id;
    if (id == undefined)   
        id = 0;

    let url = "http://localhost:4040/video/store/" + id;
    let page = "listStores";
    getResultFromDB(url).then((storeRecord)=>{
        res.render(page, {
            viewTitle: "Video Stores",
            storeData : storeRecord,
        });
    });
});

router.get('/editStore/:id', (req, res) => {
    const id = req.params.id;
    let url = "http://localhost:4040/video/store/" + id;

    getResultFromDB(url).then((storeRecord)=>{
        let countryId = storeRecord.City.Country.country_id;

        let url = "http://localhost:4040/video/cities/" + countryId;

        let countryOptSelector = 
        //  ""
        res.render('editStore', {
            viewTitle: "Video Stores",
            storeData : storeRecord,
        });
    });
});

//handle errors
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;