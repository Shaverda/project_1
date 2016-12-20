$( function() {
  $( "#datepicker" ).datepicker({
    showButtonPanel: true
  });
} );

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

$("#submit").on("click", function(event){
  event.preventDefault();
  var name = $("#name-area").val().trim();
  var email = $("#email-area").val().trim();
  var airport_code = document.getElementById('select_start_airport').value;
  var home;
  var home = document.getElementById('select_start_airport').textContent;
  // $("div[class='start-airport']").each(function() {
  //   if (this.value === airport_code) {
  //     home = this.textContent;
  //   }
  // }) 
  //NEED A GOOD PROPER WAY TO LOG HOME ADDRESS IN ORDER TO ADD A 2ND MARKER TO MAP
  //console.log(home);

  var departure_date = $("#datepicker").val();
  departure_date = moment(departure_date).format('YYYY-MM-DD');

  flight_options_ref.set({
    firstName : name,
    emailAddress : email,
    airport : airport_code,
    date: departure_date,
    home_city : home
  });

  window.location.href = 'index2.html';

});



 // phil's api key:  AIzaSyDyVvbCSBe7Wv70cNxYuHT_yr2qUhjMymY
 //shelby's api key: AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo





