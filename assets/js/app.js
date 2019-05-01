

$(document).ready(function () {
	/*** GLOBAL ***/


	var signInArea = $("#signInArea");
	var mainContentArea = $("#mainContentArea");

	var defaultGoogleUser = {
		displayName: "Unknown",
		email: "unknown@unknown.unknown",
		photoURL: "assets/images/tmpProfileImg.png"
	};

	var googleUser = defaultGoogleUser;

	var userPetsArray = [];

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


	/*** FUNCTIONS ***/


	function updateUserInfo(theUser) {
		googleUser = theUser;

		$("#googleDisplayName").text(theUser.displayName);
		$("#googleEmail").text(theUser.email);

		var profileImg = $("#profileImage");
		profileImg.attr("src", theUser.photoURL);

		$("#profileImageArea").html(profileImg);

		// ADD USER TO FIREBASE
		addUserToFirebase(theUser);
	}


	function addUserToFirebase(theUser) {

		var userName = theUser.displayName;
		var userEmail = theUser.email;
		var userAddedDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		var userLoginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");


		// IS THIS A NEW USER?
		var userKey = findUserKey(userEmail);

		if (userKey === "") {

			var userKey = database.ref().child("users").push(
				{
					user_name: userName,
					user_email: userEmail,
					user_added: userAddedDateTime,
					user_login: userLoginDateTime,
					pets: {
						pets_updated: userAddedDateTime
					}
				}).key;

			var pet00 = {
				pet_name: "Muffins",
				pet_breed: "Rottweiler",
				pet_sex: "Female",
				pet_age: 5,
				pet_weight: 120.5,
				pet_size: "XL",
				pet_updated: userAddedDateTime
			}

			var pet01 = {
				pet_name: "Boss Daddy",
				pet_breed: "Chihuahua",
				pet_sex: "Male",
				pet_age: 6,
				pet_weight: 4,
				pet_size: "SM",
				pet_updated: userAddedDateTime
			}

			var pet02 = {
				pet_name: "Mr. Bubs",
				pet_breed: "Labrador Retriever",
				pet_sex: "Male",
				pet_age: 3,
				pet_weight: 50,
				pet_size: "MD",
				pet_updated: userAddedDateTime
			}

			userPetsArray.push(pet00);
			userPetsArray.push(pet01);
			userPetsArray.push(pet02);

			for (var i = 0; i < userPetsArray.length; i++) {
				var petname = userPetsArray[i].pet_name;
				var petbreed = userPetsArray[i].pet_breed;
				var petsex = userPetsArray[i].pet_sex;
				var petage = userPetsArray[i].pet_age;
				var petweight = userPetsArray[i].pet_weight;
				var petsize = userPetsArray[i].pet_size;

				database.ref().child("users/" + userKey + "/pets").push(
					{
						pet_name: petname,
						pet_breed: petbreed,
						pet_sex: petsex,
						pet_age: petage,
						pet_weight: petweight,
						pet_size: petsize
					});
			}
		}
		else {

			database.ref().child("users/" + userKey).update(
				{
					user_login: userLoginDateTime
				});
		}
	}

	function findUserKey(userEmail) {

		var userKey = "";

		var ref = database.ref().child("users");

		ref.orderByChild("user_email").equalTo(userEmail).once("child_added", function (snapshot) {

			if (snapshot.child("user_email").val().toUpperCase() === userEmail.toUpperCase()) {
				userKey = snapshot.key;
			}
		});

		return userKey;
	}

	function addPetToFirebase(theUser, thePet) {
	}


	function googleSignIn() {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().useDeviceLanguage();

		provider.addScope("profile");
		provider.addScope("email");

		return firebase.auth().signInWithPopup(provider).then(function (result) {
			updateUserInfo(result.user);
			locator();
			signInArea.hide();
			mainContentArea.show();

			$('.amazon-stuff').show();
			$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
			$("#userProfileArea").show();
			updateUserInfo(result.user);


		}).catch(function (error) {
		});

	}


	function googleSignOut() {
		firebase.auth().signOut();
		updateUserInfo(defaultGoogleUser);
		signInArea.show();
		$('.amazon-stuff').hide();
		$('body').find('script').attr('src', '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082').remove();
		mainContentArea.hide();
	}
	// Map Marker icon
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

	// Ajax call to locate vet, park, petsmart 
	function mapCall(map, lattitiude, longitude, searchLocation, iconColor, getName, getAdd, getPhone) {
		var queryURL = "https://api.tomtom.com/search/2/search/" + searchLocation + ".json?key=7UeVqnmHxlzBP6n8ZWtpdW82KS6nnBoM&lat=" + lattitiude + "&lon=" + longitude + "&radius=60000";
		$.ajax({
			url: queryURL,
			method: "GET"
		})

			.then(function (response) {
				for (i = 0; i < response.results.length; i++) {
					var placeLat = response.results[i].position.lat;
					var placelon = response.results[i].position.lon;
					var latlng = new L.LatLng(placeLat, placelon);

					var result = response.results[i];
					var bound = `${getName ? result.poi.name : searchLocation} 
				  ${getAdd ? result.address.freeformAddress : ""}
				  ${getPhone ? result.poi.phone : ""}`

					L.marker(latlng, { icon: GetIcon(iconColor) }).addTo(map).bindPopup(bound).openPopup();
				}

			});
	}
	// locating user's current location
	function locator() {
		navigator.geolocation.getCurrentPosition(function (location) {
			var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
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
			// button click to populate nearby petsmarts
			$("#shopButton").on("click", function () {
				mapCall(mymap, lat, long, "Petsmart", "green", false, true, false);
			});
			// button click to populate nearby vets


			$("#vetButton").on("click", function () {
				mapCall(mymap, lat, long, "veterinarian", "orange", true, false, true)
			});

			// button click to populate nearby paks

			$("#parkButton").on("click", function () {
				mapCall(mymap, lat, long, "park", "red", true, false, false)

			});
		});

	}




	/*** PAGE EVENTS ***/


	$("#btn-size_xs").on("click", function () {
		event.preventDefault();
	});

	$("#btn-size_sm").on("click", function () {
		event.preventDefault();
	});

	$("#btn-size_md").on("click", function () {
		event.preventDefault();
	});

	$("#btn-size_lg").on("click", function () {
		event.preventDefault();
	});

	$("#btn-size_xl").on("click", function () {
		event.preventDefault();
	});

	$("#btn-size_unk").on("click", function () {
		event.preventDefault();
	});

	$("#btn-add").on("click", function () {
		event.preventDefault();
	});

	$("#btn-update").on("click", function () {
		event.preventDefault();
	});

	$("#btn-remove").on("click", function () {
		event.preventDefault();
	});


	$("#btn-noSignIn").on("click", function () {

		// MAIN PAGE AREAS
		signInArea.hide();
		mainContentArea.show();
		locator();

		var selectedUser = $("#testUserSelect").children("option:selected");

		defaultGoogleUser.displayName = selectedUser.val().trim();
		defaultGoogleUser.email = selectedUser.attr("data-email").trim();
		defaultGoogleUser.photoURL = selectedUser.attr("data-photo").trim();

	});


	$("#btn-googleSignOut").on("click", function () {
		googleSignOut();
	});


	// user signs-in with google account
	$("#btn-googleSignIn").on("click", function () {
		var tmp = googleSignIn();
	});


	/*** DATABASE LISTENERS ***/


	database.ref().on("child_added", function (childSnapshot) {
		// do stuff as the database changes
		// Handle the errors
	}, function (errorObject) {
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


