

$(document).ready(function() 

{
	var signInArea = $("#signInArea");
	var mainContentArea = $("#mainContentArea");

	var defaultGoogleUser = {	displayName: "Unknown", 
								email: "unknown@unknown.unknown", 
								photoURL: "assets/images/tmpProfileImg.png"};

	var googleUser = defaultGoogleUser;

  // Initialize Firebase
	var config = {
		apiKey: "AIzaSyCW7EalByCr2vcv91omxvV58cuGC2OFWzc",
		authDomain: "pet-book-ab160.firebaseapp.com",
		databaseURL: "https://pet-book-ab160.firebaseio.com",
		projectId: "pet-book-ab160",
		storageBucket: "pet-book-ab160.appspot.com",
		messagingSenderId: "618815444187"
	};

	firebase.initializeApp(config);

	var database = firebase.database();

	function updateUserInfo (theUser)
	{
		$("#googleDisplayName").text(theUser.displayName);
		$("#googleEmail").text(theUser.email);

		var profileImg = $("#profileImage");
		profileImg.attr("src", theUser.photoURL);

		$("#profileImageArea").html(profileImg);
	}

	function googleSignIn()
	{
		// https://firebase.google.com/docs/reference/js/firebase.auth.GoogleAuthProvider
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().useDeviceLanguage();

		provider.addScope("profile");
		provider.addScope("email");


		// https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html#signinwithpopup
		return firebase.auth().signInWithPopup(provider).then(function(result)
		{
			//var token = result.credential.accessToken;
			googleUser = result.user;
			console.log("result user display name: " + googleUser.displayName);

			signInArea.hide();
			mainContentArea.show();
			$('.amazon-stuff').show();
			$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
			$("#userProfileArea").show();
			updateUserInfo(result.user);
			$("#mapid").show();
			$("#buttonDiv").show();

		
		}).catch(function(error)
		{
			console.log("Google sign-in error: " + "\n" +  error);
		});

	}

	function googleSignOut()
	{
		firebase.auth().signOut();
		updateUserInfo(defaultGoogleUser);
		signInArea.show();
		$('.amazon-stuff').hide();
		$("#mapid").hide();
		$("#buttonDiv").hide();
		$('body').find('script').attr('src', '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082').remove();
		mainContentArea.hide();
	}

	database.ref().on("child_added", function(childSnapshot) 
	{
		// do stuff as the database changes
	// Handle the errors
	}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
	});

 	// user signs-in with google account
	$("#btn-googleSignIn").on("click", function()
	{
		console.log("SIGN IN CLICKED");
		// https://firebase.google.com/docs/reference/js/firebase.User
		var tmp = googleSignIn();
		//console.log("tmp:" + "\n" + tmp);
	});

	$("#btn-noSignIn").on("click", function()
	{	
		console.log("NO GOOGLE CLICKED");
		signInArea.hide();
		mainContentArea.show();
		$('.amazon-stuff').show();
		$("#mapid").show();
		locator();
		$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
		$("#userProfileArea").show();
		updateUserInfo(defaultGoogleUser);
	});

	$("#btn-googleSignOut").on("click", function(){
		googleSignOut();
	});

	function GetIcon(color) {
		var icon = new L.Icon({
		  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + color + '.png',
		  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		  iconSize: [25, 41],
		  iconAnchor: [12, 41],
		  popupAnchor: [1, -34],
		  shadowSize: [41, 41]
		});
		return icon;
	  }
	
	
	  function mapCall(map, lattitiude, longitude, searchLocation, iconColor, getName, getAdd, getPhone) {
		var queryURL = "https://api.tomtom.com/search/2/search/" + searchLocation + ".json?key=7UeVqnmHxlzBP6n8ZWtpdW82KS6nnBoM&lat=" + lattitiude + "&lon=" + longitude + "&radius=60000";
		$.ajax({
		  url: queryURL,
		  method: "GET"
		})
	
		  .then(function (response) {
			console.log(response);
			for (i = 0; i < response.results.length; i++) {
			  var placeLat = response.results[i].position.lat;
			  var placelon = response.results[i].position.lon;
			  console.log(placeLat, placelon);
			  var latlng = new L.LatLng(placeLat, placelon);
	
			  var result = response.results[i];
			  var bound = `${getName ? result.poi.name : searchLocation} 
				  ${getAdd ? result.address.freeformAddress : ""}
				  ${getPhone ? result.poi.phone : ""}`
	
			  L.marker(latlng, { icon: GetIcon(iconColor) }).addTo(map).bindPopup(bound).openPopup();
			}
	
		  });
	  }
	
	
	  navigator.geolocation.getCurrentPosition(function (location) {
		var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
		console.log(latlng);
		var lat = location.coords.latitude;
		var long = location.coords.longitude;
		var mymap = L.map('mapid').setView(latlng, 13);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiYWJoaW5heWFhMTc4NyIsImEiOiJjanV4aGlqNzUwbjduM3ltd2J1YTVjNXhuIn0.Bz3gZ4NIgZagdLg_ZoFuEQ',
		  {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox.streets',
			accessToken: 'sk.eyJ1IjoiYWJoaW5heWFhMTc4NyIsImEiOiJjanV4aGlqNzUwbjduM3ltd2J1YTVjNXhuIn0.Bz3gZ4NIgZagdLg_ZoFuEQ'
		  }).addTo(mymap);
		L.marker(latlng).addTo(mymap)
		  .bindPopup("Current location").openPopup();
	
		$("#shopButton").on("click", function () {
		  mapCall(mymap, lat, long, "Petsmart", "green", false, true, false);
		});
	
	
		$("#vetButton").on("click", function () {
		  mapCall(mymap, lat, long, "veterinarian", "orange", true, false, true)
		});
		$("#parkButton").on("click", function () {
		  mapCall(mymap, lat, long, "park", "red", true, false, false)
		});
	  });
	
	
	
	
	
		

});


