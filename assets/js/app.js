// ryan's js

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
		$("#userProfileArea").show();
		updateUserInfo(defaultGoogleUser);
	});

	$("#btn-googleSignOut").on("click", function(){
		googleSignOut();
	});

 });




