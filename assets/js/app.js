

$(document).ready(function() 
{
	/*** GLOBAL ***/


	var signInArea = $("#signInArea");
	var mainContentArea = $("#mainContentArea");

	var defaultGoogleUser = {	displayName: "Unknown", 
								email: "unknown@unknown.unknown", 
								photoURL: "assets/images/tmpProfileImg.png"};

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


	function updateUserInfo (theUser)
	{
		googleUser = theUser;

		$("#googleDisplayName").text(theUser.displayName);
		$("#googleEmail").text(theUser.email);

		var profileImg = $("#profileImage");
		profileImg.attr("src", theUser.photoURL);

		$("#profileImageArea").html(profileImg);

		// ADD USER TO FIREBASE
		addUserToFirebase(theUser);
	}


	function addUserToFirebase(theUser)
	{
		console.log("addUserToFirebase("+theUser+")");
		// https://firebase.google.com/docs/database/admin/structure-data
		// https://firebase.google.com/docs/database/admin/save-data
		// https://firebase.google.com/docs/database/admin/retrieve-data

		var userName = theUser.displayName;
		var userEmail = theUser.email;
		var userAddedDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		var userLoginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");


		// IS THIS A NEW USER?
		var userKey = findUserKey(userEmail);

		if(userKey === "")
		{
			console.log("ADD NEW USER");

			var userKey = database.ref().child("users").push(
			{
				user_name: userName,
				user_email: userEmail,
				user_added: userAddedDateTime,
				user_login: userLoginDateTime,
				pets:{
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

			for (var i = 0; i < userPetsArray.length; i++)
			{
				var petname = userPetsArray[i].pet_name;
				var petbreed = userPetsArray[i].pet_breed;
				var petsex = userPetsArray[i].pet_sex;
				var petage = userPetsArray[i].pet_age;
				var petweight = userPetsArray[i].pet_weight;
				var petsize = userPetsArray[i].pet_size;

				database.ref().child("users/"+ userKey + "/pets").push(
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
		else
		{
			console.log("UPDATE EXISTING USER LOGIN TIME");

			database.ref().child("users/"+ userKey).update(
			{
				user_login: userLoginDateTime
			});
		}
	}

	function findUserKey(userEmail)
	{
		console.log("findUserKey("+userEmail+")");
		// https://firebase.google.com/docs/reference/js/firebase.database.Reference.html#equalto
		// https://firebase.google.com/docs/reference/js/firebase.database.Query.html

		var userKey = "";
		
		var ref = database.ref().child("users");

		//ref.orderByChild("user_email").equalTo(userEmail).once("child_added").then(function(snapshot)
		ref.orderByChild("user_email").equalTo(userEmail).once("child_added", function(snapshot)
		{
  			// console.log("snapshot: " + snapshot);
  			// console.log("snapshot.key: " + snapshot.key);

			if(snapshot.child("user_email").val().toUpperCase() === userEmail.toUpperCase())
			{
				//console.log("USER FOUND");
				//console.log("user name: " + snapshot.child("user_name").val());
				userKey = snapshot.key;
			}
  			/*if(snapshot.child("user_email").val().toUpperCase() === userEmail.toUpperCase())
  			{
  				console.log("USER FOUND" + "\n" + "Key: " + snapshot.key);
  				userKey = snapshot.key;

  			
				tmpTrain.key = snapshot.key;
				tmpTrain.name = snapshot.child("name").val();
				tmpTrain.frequency = snapshot.child("frequency").val();
				tmpTrain.destination = snapshot.child("destination").val();
				tmpTrain.start = snapshot.child("start").val();
				tmpTrain.updateBy_name = snapshot.child("updateBy_name").val();
				tmpTrain.updateBy_email = snapshot.child("updateBy_email").val();
				tmpTrain.updated = snapshot.child("updated").val();
  			}*/
		});

		//console.log("END findUserKey("+userEmail+")");
		//console.log("Key: " + userKey);

		return userKey;
	}

	function addPetToFirebase(theUser, thePet)
	{/*
		// WORK NEEDED HERE
		// FIND SPECIFIED USER IN DB
		// UPDATE THAT USER'S PET INFO

		var userPetName = "dog 1";
		var userPetAge = 3;
		var userPetWeight = 10.5;

		var updateDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

		// find the user
		database.ref().child("user/pets").set(
		{
			petsUpdated: updateDateTime
		});


		database.ref().child("user/pets").push(
		{
			pet:{
				pet_name: userPetName,
				pet_age: userPetAge,
				pet_weight: userPetWeight
			}
		});


		/*
		var usersRef = ref.child("users");
		usersRef.set({
		  alanisawesome: {
		    date_of_birth: "June 23, 1912",
		    full_name: "Alan Turing"
		  },
		  gracehop: {
		    date_of_birth: "December 9, 1906",
		    full_name: "Grace Hopper"
		  }
		});
		*/
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
			
			//console.log("result user display name: " + googleUser.displayName);

			updateUserInfo(result.user);

			signInArea.hide();
			mainContentArea.show();

			$('.amazon-stuff').show();
			
			$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
			
			$("#userProfileArea").show();

			$("#mapid").show();

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
		$('body').find('script').attr('src', '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082').remove();
		mainContentArea.hide();
	}


	function locator()
	{
		navigator.geolocation.getCurrentPosition(function(location) 
		{
			var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
			console.log(latlng);
			var mymap = L.map('mapid').setView(latlng, 13);
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiYWJoaW5heWFhMTc4NyIsImEiOiJjanV4aGlqNzUwbjduM3ltd2J1YTVjNXhuIn0.Bz3gZ4NIgZagdLg_ZoFuEQ', 
			{
			  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
			  maxZoom: 18,
			  id: 'mapbox.streets',
			  accessToken: 'sk.eyJ1IjoiYWJoaW5heWFhMTc4NyIsImEiOiJjanV4aGlqNzUwbjduM3ltd2J1YTVjNXhuIn0.Bz3gZ4NIgZagdLg_ZoFuEQ'
			}).addTo(mymap);
		  console.log(L.tileLayer);
			L.marker(latlng).addTo(mymap)
							.bindPopup("Current location").openPopup();
		
		});
	}


	/*** PAGE EVENTS ***/


	$("#btn-size_xs").on("click", function(){
		event.preventDefault();
	});

	$("#btn-size_sm").on("click", function(){
		event.preventDefault();
	});

	$("#btn-size_md").on("click", function(){
		event.preventDefault();
	});

	$("#btn-size_lg").on("click", function(){
		event.preventDefault();
	});

	$("#btn-size_xl").on("click", function(){
		event.preventDefault();
	});

	$("#btn-size_unk").on("click", function(){
		event.preventDefault();
	});

	$("#btn-add").on("click", function()
	{
		event.preventDefault();
		console.log("ADD BUTTON CLICKED");
	});

	$("#btn-update").on("click", function()
	{	
		event.preventDefault();
		console.log("UPDATE BUTTON CLICKED");
	});	

	$("#btn-remove").on("click", function()
	{
		event.preventDefault();
		console.log("REMOVE BUTTON CLICKED");
	});


	$("#btn-noSignIn").on("click", function()
	{	
		console.log("NON GOOGLE SIGN-IN CLICKED");

		// MAIN PAGE AREAS
		signInArea.hide();
		mainContentArea.show();


		var selectedUser = $("#testUserSelect").children("option:selected");

		defaultGoogleUser.displayName = selectedUser.val().trim();
		defaultGoogleUser.email = selectedUser.attr("data-email").trim();
		defaultGoogleUser.photoURL = selectedUser.attr("data-photo").trim();

		// SET USER DATA
		/*defaultGoogleUser = {	displayName: "Unknown", 
								email: "unknown@unknown.unknown", 
								photoURL: "assets/images/tmpProfileImg.png"};*/

		updateUserInfo(defaultGoogleUser);

		$("#userProfileArea").show();

		// MAP SECTION
		$("#mapid").show();
		locator();

		// AMAZON SECTION
		$('.amazon-stuff').show();

		$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
		
	});


	$("#btn-googleSignOut").on("click", function(){
		googleSignOut();
	});


	 // user signs-in with google account
	$("#btn-googleSignIn").on("click", function()
	{
		console.log("GOOGLE SIGN IN CLICKED");
		// https://firebase.google.com/docs/reference/js/firebase.User
		var tmp = googleSignIn();
		//console.log("tmp:" + "\n" + tmp);
	});


	/*** DATABASE LISTENERS ***/


	database.ref().on("child_added", function(childSnapshot) 
	{
		// do stuff as the database changes
	// Handle the errors
	}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
	});


});


