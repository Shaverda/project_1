//$(document).ready(){

var FlightRequest = {
  "request": {
    "slice": [
      {
        "origin": "DCA",
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

$.ajax({
   type: "POST",
   //Set up your request URL and API Key.
   url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo", 
   contentType: 'application/json', // Set Content-type: application/json
   dataType: 'json',
   // The query we want from Google QPX, This will be the variable we created in the beginning
   data: JSON.stringify(FlightRequest),
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
}


//}