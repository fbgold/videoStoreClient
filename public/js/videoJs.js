
let options = {
    dataType: "json",
    crossDomain: true,
    type: "GET",
    contentType:"application/json",
}

$(document).ready(function(){
    $('#country').change( function(){
        var country = $(this). children("option:selected"). val();
        state = getStates(country);
    });
    $('#state').change( function(){
        var state = $(this). children("option:selected"). val();
        //state = getStates(country);
        city = getCities(state);
    });

/***************************************** */
    function getStates(country){
        /*   get states */
        let stateUrl = "http://localhost:4040/video/states/" + country;
        $.ajax({
            url: stateUrl,
            options
        })
        .done(function(states){
            $("#state").html("");
            
            console.log("STATES: " + states);

            let optionStr='';
            $.each(states, function(i,item){
                if (i == 0)
                    optionStr += "<option selected>";
                else
                    optionStr += "<option>";
                optionStr += item.district + '</option>';
                console.log(optionStr);
            })
            $("#state").html(optionStr);

            city = getCities(states[0].district);

        })
        .fail(function(err){
            console.log("error: " + JSON.stringify(err));

            alert( "error: " + JSON.stringify(err));
        })
        .always(function() {
            
        });
    }

/**************************************************** */
    function getCities(state){
        //var state = $("#state"). children("option:selected"). val();

        let cityUrl = "http://localhost:4040/video/cities/" + state;
        $.ajax({
            url: cityUrl,
            options
        })
        .done(function(data){
            $("#city").html("");
            let optionStr='';
            $.each(data, function(i,item){
                if (i == 0)
                    optionStr += "<option selected value=";
                else
                    optionStr += "<option value=";
                optionStr += item.city_id + '>' + item.city + '</option>';
                console.log(optionStr);
            })
            $("#city").html(optionStr);
        })
        .fail(function(err) {
            console.log("error: " + JSON.stringify(err));
            alert( "error: " + JSON.stringify(err));
        })
        .always(function() {
            
        });
    }
});

