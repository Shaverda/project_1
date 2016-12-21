//FOR NOW, I JUST SET IT TO DISPLAY ONLY ONE FLIGHT =/
//TODO: loop through arrayed items in data to find cheapest flight

var config = {
    apiKey: "AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo",
    authDomain: "jetsetters-866cf.firebaseapp.com",
    databaseURL: "https://jetsetters-866cf.firebaseio.com",
    storageBucket: "jetsetters-866cf.appspot.com",
    messagingSenderId: "26725366808"
};

firebase.initializeApp(config);

var database = firebase.database();
var flight_options_ref = database.ref("flight_options");

var destination_options = [
    ["Atlanta, GA", "ATL"],
    ["Chicago, IL ", "ORD"],
    ["Los Angeles, CA", "LAX"],
    ["Denver, CO", "DEN"],
    ["New York, NY", "JFK"],
    ["San Francisco, CA", "SFO"],
    ["Charlotte, NC", "CLT"]
];

var destination_number = Math.floor(Math.random() * (destination_options.length));


var flight_request = {
    "request": {
        "slice": [{
            "origin": "AUS",
            "destination": "LAX",
            "date": "2017-01-25",
            "maxStops": 0
        }],
        "passengers": {
            "adultCount": 1,
        },
        "solutions": 1,
        "refundable": false
    }
};

var starting_airport, departure_date, email, name, home;

flight_options_ref.on("value", function(snapshot) {
    starting_airport = snapshot.val().airport;
    departure_date = snapshot.val().date;
    email = snapshot.val().emailAddress;
    name = snapshot.val().firstName;
    home = snapshot.val().home_city;

    console.log(destination_options[destination_number][1]);

    flight_request.request.slice[0].origin = starting_airport;
    flight_request.request.slice[0].date = departure_date;
    flight_request.request.slice[0].destination = destination_options[destination_number][1];

    console.log(flight_request);

    $.ajax({
        type: "POST",
        //Set up your request URL and API Key.
        url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo",
        contentType: 'application/json', // Set Content-type: application/json
        dataType: 'json',
        // The query we want from Google QPX, This will be the variable we created in the beginning
        data: JSON.stringify(flight_request),
        success: function(data) {
            //Once we get the result you can either send it to console or use it anywhere you like.
            console.log(JSON.stringify(data));
            console.log(data);
            var city_obj = data.trips.data;

            function homepage_returner() {
                window.location.href = 'index.html';
            }
            if (!(city_obj.hasOwnProperty("city"))) {
                setTimeout(homepage_returner, 5000);
                $("#map").hide();
                $("#heading_info").html("<h1 style='font-weight:500;'> Sorry. There are no flights from this location. You will be redirected to the home page, but really you should probably redirect your life. </h1>");
            }
            var destinationcity = data.trips.data.city[1].name;
            var sales_price = data.trips.tripOption[0].saleTotal.substr(3);
            console.log(sales_price);
            $("#flight-price").html("Flight price: $" + sales_price);
            var flight_info = data.trips.data.carrier[0].name + " #" + data.trips.tripOption[0].slice[0].segment[0].flight.number;
            $("#flight-info").html("Flight information: " + flight_info);
            var departure_time = data.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime.slice(11,16);
            console.log(departure_time);
            $("#departure-time").html("Departure time: " + departure_time);
            $("#departure-date").html("Departure Date: " + departure_date);

            $("#destinationHolder").html(destinationcity);
            $('#loading-image').hide();
        },
        error: function() {
            //Error Handling for our request
            alert("Access to Google QPX Failed.");
        }
    });

});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 40.054, lng: -98.866 }
    });

    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
    var address = destination_options[destination_number][0];

    console.log(address);
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


// phil's api key:  AIzaSyDyVvbCSBe7Wv70cNxYuHT_yr2qUhjMymY
//shelby's api key: AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo
