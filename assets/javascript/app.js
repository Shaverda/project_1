$( function() { //calendar widget thing
  $( "#datepicker" ).datepicker({
    showButtonPanel: true
  });
} );

var config = {  //firebase config
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
  var home = $("#select_start_airport option[value="+airport_code+"]").text();

  var departure_date = $("#datepicker").val();
  departure_date = moment(departure_date).format('YYYY-MM-DD');

  flight_options_ref.set({  //sets values in firebase
    firstName : name,
    emailAddress : email,
    airport : airport_code,
    date: departure_date,
    home_city : home
  });

  //TODO: PROVIDE ERROR HANDLING for if user inputs weird submissions

  window.location.href = 'index2.html'; //navigates to next page.

});



 // phil's api key:  AIzaSyDyVvbCSBe7Wv70cNxYuHT_yr2qUhjMymY
 //shelby's api key: AIzaSyBPM6wdALkjvVZGjgS0ziYqkfBjB1CzZMo





