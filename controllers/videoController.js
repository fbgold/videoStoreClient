var express = require('express');
const rp = require('request-promise');

const router = express.Router();
const awsUrl = 'http://ec2-13-52-98-240.us-west-1.compute.amazonaws.com:4040/video/'
router.post('/', (req, res) => {
    let body = req.body;
    console.log(body)
    //let url = "http://localhost:4040/video/updateStore/";
    let url = awsUrl + 'updateStore/';

    var options = {
        method: 'POST',
        //uri: "http://localhost:4040/video/updateStore/",
        uri = awsUrl + 'updateStore/',
        
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

/***************************************************************** */
/*
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
*/
/******************************All Movies */
router.get('/allMovies', (req, res) => {
    let page = "allMovies";
    //let url = "http://localhost:4040/video/0";
    let url = awsUrl + 'updateStore/';

    getResultFromDB(url,page,res);
});

router.get('/movie/:Id', (req, res) => {
    //let url = "http://localhost:4040/video/" + req.params.Id;
    let url = awsUrl + + req.params.Id;

    let page = "editMovie";
    getResultFromDB(url,page,res);

});

router.get('/', (req, res) => {
    const id = 0;
    //let url = "http://localhost:4040/video/" + id;
    let url = awsUrl + '+ id';

    let page = "allMovies";
    getResultFromDB(url,page,res);
});

/********** STORE functions************/
function getResultFromDB(url,page,res){
   return rp(url)
    .then((result) => {

        if (page == undefined){
            return JSON.parse(result)
        }

        result = JSON.parse(result)
        res.render(page, {
            viewTitle: page,
            Result: result,
        });
    })
    .catch((err) => {
        console.log("Error: " + err);
        return err;
    })
}


router.get('/store/:id', (req, res) => {
    let id = req.params.id;
    if (id == undefined)   
        id = 0;

    //let url = "http://localhost:4040/video/store/" + id;
    let url = awsUrl + 'store/'+ id;

    let page = "listStores";
    getResultFromDB(url,page,res);
 });

router.get('/editStore/:id', (req, res) => {
    const storeId = req.params.id;
    let url = "http://localhost:4040/video/store/" + storeId;

    getResultFromDB(url).then((storeRecord) =>{
        let countr_id = storeRecord[0].Address.City.Country.country_id;
        //url = "http://localhost:4040/video/states/" + countr_id;
        let url = awsUrl + 'states/'+ countr_id;

        getResultFromDB(url).then((stateRecord)=>{
            storeRecord[0].states = stateRecord;

            //url = "http://localhost:4040/video/cities/" + storeRecord[0].Address.district;
            let url = awsUrl + 'cities/'+ toreRecord[0].Address.district;

            getResultFromDB(url).then((cityRecord)=>{
                storeRecord[0].cities = cityRecord;
                //url = "http://localhost:4040/video/countries/";
                let url = awsUrl + 'countries';

                getResultFromDB(url).then((countries)=>{
                    storeRecord[0].countries = countries;
                    res.render('editStore', {
                        viewTitle: "Video Stores",
                        storeData : storeRecord[0],
                    });
                })
            });
        });

        
        console.log(storeRecord);
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