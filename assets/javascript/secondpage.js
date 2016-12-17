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

var destination_options = 
  [["Atlanta, GA", "ATL"],
  ["Chicago, IL " , "ORD"],
  ["Los Angeles, CA" , "LAX"],
  ["Denver, CO"   , "DEN"],
  ["New York, NY" , "JFK"],
  ["San Francisco, CA" , "SFO"],
  ["Charlotte, NC" , "CLT"]];

var flight_request = {
  "request": {
    "slice": [
      {
        "origin": "AUS",
        "destination": "LAX",
        "date": "2017-01-25"
      }
    ],
    "passengers": {
      "adultCount": 1,
    },
    "solutions": 2,
    "refundable": false
  }
};


flight_options_ref.on("value", function(snapshot) {
	var starting_airport = snapshot.airport;
	var date = snapshot.date;
	var email = snapshot.emailAddress;
	var name = snapshot.firstName;
})
// console.log(starting_airport);

var destination_number = Math.floor(Math.random() * (destination_options.length));

flight_request.request.slice[0].origin = starting_airport;
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
 success: function (data) {
  //Once we get the result you can either send it to console or use it anywhere you like.
  console.log(JSON.stringify(data));
},
  error: function(){
   //Error Handling for our request
   alert("Access to Google QPX Failed.");
 }
});



function initMap() {
	var austin = {lat: 30.307182, lng: -97.755996};
	var map = new google.maps.Map(document.getElementById('map'), {
 		zoom: 5,
 		center: austin
});
var marker = new google.maps.Marker({
   position: austin,
   map: map
});