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
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
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
    		//$(this).find(".event-desc-detail").html(data.events.event[i].performers.performer.short_bio);
    		$(this).find(".rsvp").attr("href", data.events.event[i].url);
    		i++;
    	});
    });


}

eventful_request();




// target to give background to
var $div = document.getElementById("gradient");
// rgb vals of the gradients
var gradients = [
  { start: [128,179,171], stop: [30,41,58] },
  { start: [255,207,160], stop: [234,92,68] },
  { start: [212,121,121], stop: [130,105,151] }
];
// how long for each transition
var transition_time = 8;
// how many frames per second
var fps = 60;


// interal type vars
var timer; // for the setInterval
var interval_time = Math.round(1000/fps); // how often to interval
var currentIndex = 0; // where we are in the gradients array
var nextIndex = 1; // what index of the gradients array is next
var steps_count = 0; // steps counter
var steps_total = Math.round(transition_time*fps); // total amount of steps
var rgb_steps = {
  start: [0,0,0],
  stop: [0,0,0]
}; // how much to alter each rgb value
var rgb_values = {
  start: [0,0,0],
  stop: [0,0,0]
}; // the current rgb values, gets altered by rgb steps on each interval
var prefixes = ["-webkit-","-moz-","-o-","-ms-",""]; // for looping through adding styles
var div_style = $div.style; // short cut to actually adding styles
var gradients_tested = false;
var color1, color2;

// sets next current and next index of gradients array
function set_next(num) {
  return (num + 1 < gradients.length) ? num + 1 : 0;
}

// work out how big each rgb step is
function calc_step_size(a,b) {
  return (a - b) / steps_total;
}

// populate the rgb_values and rgb_steps objects
function calc_steps() {
  for (var key in rgb_values) {
    if (rgb_values.hasOwnProperty(key)) {
      for(var i = 0; i < 3; i++) {
        rgb_values[key][i] = gradients[currentIndex][key][i];
        rgb_steps[key][i] = calc_step_size(gradients[nextIndex][key][i],rgb_values[key][i]);
      }
    }
  }
}

// update current rgb vals, update DOM element with new CSS background
function updateGradient(){
  // update the current rgb vals
  for (var key in rgb_values) {
    if (rgb_values.hasOwnProperty(key)) {
      for(var i = 0; i < 3; i++) {
        rgb_values[key][i] += rgb_steps[key][i];
      }
    }
  }

  // generate CSS rgb values
  var t_color1 = "rgb("+(rgb_values.start[0] | 0)+","+(rgb_values.start[1] | 0)+","+(rgb_values.start[2] | 0)+")";
  var t_color2 = "rgb("+(rgb_values.stop[0] | 0)+","+(rgb_values.stop[1] | 0)+","+(rgb_values.stop[2] | 0)+")";

  // has anything changed on this interation
  if (t_color1 != color1 || t_color2 != color2) {

    // update cols strings
    color1 = t_color1;
    color2 = t_color2;

    // update DOM element style attribute
    div_style.backgroundImage = "-webkit-gradient(linear, left bottom, right top, from("+color1+"), to("+color2+"))";
    for (var i = 0; i < 4; i++) {
      div_style.backgroundImage = prefixes[i]+"linear-gradient(45deg, "+color1+", "+color2+")";
    }
  }

  // test if the browser can do CSS gradients
  if (div_style.backgroundImage.indexOf("gradient") == -1 && !gradients_tested) {
    // if not, kill the timer
    clearTimeout(timer);
  }
  gradients_tested = true;

  // we did another step
  steps_count++;
  // did we do too many steps?
  if (steps_count > steps_total) {
    // reset steps count
    steps_count = 0;
    // set new indexs
    currentIndex = set_next(currentIndex);
    nextIndex = set_next(nextIndex);
    // calc steps
    calc_steps();
  }
}

// initial step calc
calc_steps();

// go go go!
timer = setInterval(updateGradient,interval_time);

// phil's api key:  AIzaSyDyVvbCSBe7Wv70cNxYuHT_yr2qUhjMymY
//shelby's api key: AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo
