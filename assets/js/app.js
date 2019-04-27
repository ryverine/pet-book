

$(document).ready(function() 
{
	/*** GLOBAL ***/

	var signInArea = $("#signInArea");
	var mainContentArea = $("#mainContentArea");

	var defaultGoogleUser = {	
		displayName: "Unknown", 
		email: "unknown@unknown.unknown", 
		photoURL: "assets/images/tmpProfileImg.png"};

	var googleUser = defaultGoogleUser;

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
		$("#googleDisplayName").text(theUser.displayName);
		$("#googleEmail").text(theUser.email);

		var profileImg = $("#profileImage");
		profileImg.attr("src", theUser.photoURL);

		$("#profileImageArea").html(profileImg);

		// ADD USER TO FIREBASE
		storeDataInFirebase(theUser);
	}

	
	function storeDataInFirebase(theUser)
	{
		// https://firebase.google.com/docs/database/admin/structure-data
		// https://firebase.google.com/docs/database/admin/save-data
		// https://firebase.google.com/docs/database/admin/retrieve-data

		var userName = theUser.displayName;
		var userEmail = theUser.email;
		var userAddedDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		var userLoginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

		var userPetName = "dog 1";
		var userPetAge = 3;
		var userPetWeight = 10.5;

		//var userRef = .child("users")
		database.ref().child("user").push(
		{
			name: userName,
			email: userEmail,
			userAdded: userAddedDateTime,
			lastLogin: userLoginDateTime,
			pet:{
				name: userPetName,
				age: userPetAge,
				weight: userPetWeight
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
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().useDeviceLanguage();

		provider.addScope("profile");
		provider.addScope("email");

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
		$('body').find('script').attr('src', '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082').remove();
		mainContentArea.hide();
	}







	/*** PAGE EVENTS ***/

	$("#btn-googleSignIn").on("click", function()
	{
		var tmp = googleSignIn();
	});

	$("#btn-noSignIn").on("click", function()
	{	
		signInArea.hide();
		mainContentArea.show();
		$('.amazon-stuff').show();
		$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
		$("#userProfileArea").show();
		updateUserInfo(defaultGoogleUser);
	});

	$("#btn-googleSignOut").on("click", function()
	{
		googleSignOut();
	});

	/*** DATABSE LISTENERS ***/

	database.ref().on("child_added", function(childSnapshot) 
	{
		// do stuff as the database changes
	// Handle the errors
	}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
	});




 });




