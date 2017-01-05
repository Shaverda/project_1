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

var destination_options = [ //hard-coded destination array of arrays w/ the city name and the airport code linked
    ["Atlanta, GA", "ATL"],
    ["Chicago, IL ", "ORD"],
    ["Los Angeles, CA", "LAX"],
    ["Denver, CO", "DEN"],
    ["New York, NY", "JFK"],
    ["San Francisco, CA", "SFO"],
    ["Charlotte, NC", "CLT"]
];

var destination_number = Math.floor(Math.random() * (destination_options.length));
//finds a random destination number 

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

flight_options_ref.on("value", function(snapshot) { //pulls firebase values from database
    starting_airport = snapshot.val().airport;
    departure_date = snapshot.val().date;
    email = snapshot.val().emailAddress;
    name = snapshot.val().firstName;
    home = snapshot.val().home_city;

    flight_request.request.slice[0].origin = starting_airport; //replaces our flight request for QPX w/ firebase data values
    flight_request.request.slice[0].date = departure_date;
    flight_request.request.slice[0].destination = destination_options[destination_number][1];

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
            var data_obj = data.trips.data;

            function homepage_returner() {
                window.location.href = 'index.html';
            }
            if (!(data_obj.hasOwnProperty("city"))) { //Essentially checks to see if QPX returns no flights; object returned by QPX will have no .city property if no flights were found. Handler displays error headline for 5 seconds before redirecting to home page to re-try inputs.
                setTimeout(homepage_returner, 10000);
                $(".animation-examples").hide();
                $("#heading_info").html("<h1 style='font-weight:500;'> Sorry. There are no flights from this location. You will be redirected to the home page, but really you should probably redirect your life. </h1>");
            }
            var destination_city = data_obj.city[1].name;
            var sales_price = data.trips.tripOption[0].saleTotal.substr(3);
            var flight_info = data_obj.carrier[0].name + " #" + data.trips.tripOption[0].slice[0].segment[0].flight.number;
            var departure_time = data.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime.slice(11, 16);

            $("#flight-price").html("Flight price: $" + sales_price);
            $("#flight-info").html("Flight information: " + flight_info);
            $("#departure-time").html("Departure time: " + departure_time);
            $("#departure-date").html("Departure Date: " + moment(departure_date).format('MMMM Do, YYYY'));
            $("#destinationHolder").html(destination_city);
            $('#loading-image').hide();
        },
        error: function() {
            //Error Handling for our request
            alert("Access to Google QPX Failed.");
        }
    });

});

function initMap() { //initializes map on page load, adding a marker to the chosen randomzied destination
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
            var iconBase =  'https://maps.google.com/mapfiles/kml/shapes/';
            var icon = {
    url: "http://i83.photobucket.com/albums/j309/typically/dancing_banana_by_legoman824-d57biz.gif", // url
    scaledSize: new google.maps.Size(80, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};

            var marker = new google.maps.Marker({
                map: resultsMap,
                 animation: google.maps.Animation.DROP,

                 optimized:false, // <-- required for animated gif
                position: results[0].geometry.location,
                 icon: icon
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function eventful_request() {
    var formatted_eventful_date = moment(departure_date).format('YYYYMMDD00');
    var future_eventful_search_date = moment(departure_date).add(7, 'days').calendar();
    future_eventful_search_date = moment(future_eventful_search_date).format('YYYYMMDD00');

    var formatted_eventful_dates = formatted_eventful_date + "-" + future_eventful_search_date;

    var oArgs = {
        app_key: "hbM7xmwCJxwk2hjn",
        q: "music",
        where: destination_options[destination_number][0],
        "date": formatted_eventful_dates,
        sort_order: "popularity",
    };

    console.log(oArgs);

    EVDB.API.call("/events/search", oArgs, function(data) {
        console.log(JSON.stringify(data));
        console.log(data);
  		var i = 0;
    	$(".event").each(function(){
    		var formatted_date = moment(data.events.event[i].start_time).format('MMMM DD YY');
    		$(this).find(".event-month").html(formatted_date.slice(0,3));
    		$(this).find(".event-day").html(formatted_date.slice(-5,-3));
    		$(this).find(".event-desc-header").html(data.events.event[i].title);
    		$(this).find(".rsvp").attr("href", data.events.event[i].url);
    		i++;
    	});
    });


}

eventful_request();

$("#fuck-off").click(function(){
    location.reload();
})

// phil's api key:  AIzaSyDyVvbCSBe7Wv70cNxYuHT_yr2qUhjMymY
//shelby's api key: AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo


