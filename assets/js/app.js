

$(document).ready(function () 
{
	/*** GLOBAL ***/


	var signInArea = $("#signInArea");
	var mainContentArea = $("#mainContentArea");

	var defaultGoogleUser = {	
		key: "",
		displayName: "", 
		email: "", 
		photoURL: ""
	};

	var currentUser = defaultGoogleUser;

	var defaultPet = {
		key: "",
		name: ""
	};

	var selectedPet = defaultPet;

	var userPetsArray = [];

	var selectedPetSize = "";

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


	function updateUserInfoArea(theUser)
	{
		if(theUser.email === "")
		{
			$("#profileImage").attr("src", "#");
			$("#googleDisplayName").text("");
			$("#googleEmail").text("");
			$("#userProfileArea").hide();
		}
		else
		{
			$("#profileImage").attr("src", theUser.photoURL);
			$("#googleDisplayName").text(theUser.displayName);
			$("#googleEmail").text(theUser.email);
			$("#userProfileArea").show();
		}
	}

	function logReturningUser(userKey)
	{
		console.log("logReturningUser("+userKey+")");

		var loginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

		database.ref().child("users/"+ userKey).update(
		{
			login: loginDateTime
		});

		populatePetData(userKey); // populates userPetsArray
	}

	function setUserData(theUser)
	{
		// IF THIS IS AN EXISTING USER THEN WE WANT TO POPULATE THE PAGE WITH THEIR INFO
		// OTHERWISE, ADD NEW USER TO DATABASE (but only if they have a pet)

		var userName = theUser.displayName;
		var userEmail = theUser.email;
		var userPhotoURL = theUser.photoURL;
		var userAddedDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		var userLoginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		
		updateUserInfoArea(theUser);

		if(userEmail != "")// only add people with email
		{
			// IS THIS A NEW USER?
			var userKey = findUserKey(userEmail);

			if(userKey === "")
			{ 
				//NEW USER
				if(userPetsArray.length > 0)
				{
					var newUserKey = database.ref().child("users").push(
					{
						displayName: userName,
						email: userEmail,
						added: userAddedDateTime,
						login: userLoginDateTime,
						photoURL: userPhotoURL,
						pets:{
							pets_updated: userAddedDateTime
						}
					}).key;

					currentUser = {
						key: newUserKey,
						displayName: userName,
						email: userEmail,
						photoURL: userPhotoURL
					};

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

						$("#petUpdateTime").text("Last Updated: " + userAddedDateTime);
					}
				}
			}
			else
			{
				console.log("UPDATE EXISTING USER LOGIN TIME");

				logReturningUser(userKey);
			}
		}
		else
		{
			$("#profileImage").attr("src", "#");
			$("#googleDisplayName").text("");
			$("#googleEmail").text("");

			currentUser = {
				key: "",
				displayName: "",
				email: "",
				photoURL: ""
			};

			$("#userProfileArea").hide();
		}
	}


	function populatePetData(userKey)
	{
		console.log("getPetData("+userKey+")");

		userPetsArray = [];
		var petDataArea = $("#petDataArea");
		petDataArea.empty();

		//var petUpdateTime = "";

		var ref = database.ref().child("users/"+userKey+"/pets");

		ref.orderByKey().on("child_added", function(snapshot)
		{
  			// console.log("snapshot: " + snapshot);
  			// console.log("snapshot.key: " + snapshot.key);

			//userKey = snapshot.key;

			if(snapshot.key === "pets_updated")
			{
				//petUpdateTime = snapshot.val();
			}
			else
			{
				var tmpPetObj = {
					pet_age: snapshot.child("pet_age").val(),
					pet_breed: snapshot.child("pet_breed").val(),
					pet_name: snapshot.child("pet_name").val(),
					pet_sex: snapshot.child("pet_sex").val(),
					pet_size: snapshot.child("pet_size").val(),
					pet_weight: snapshot.child("pet_weight").val()
				};

				userPetsArray.push(tmpPetObj);
			}

		});

		//console.log("petUpdateTime = " + petUpdateTime);

		for(var i = 0; i < userPetsArray.length; i++)
		{
			console.log("userPetsArray["+i+"].pet_name: " + userPetsArray[i].pet_name);

			var petDataSummaryRow = $("<tr>");
			petDataSummaryRow.attr("class", "petDataSummary");

			var iconData = $("<td>");
			iconData.attr("class", "tableDataIndent");

			var iconButton = $("<button>");
			iconButton.attr("class", "btn");
			iconButton.addClass("fas");
			iconButton.addClass("fa-plus");
			iconButton.addClass("btn-openClose");

			iconData.append(iconButton);

			var nameData = $("<td>");
			nameData.attr("class", "petName");
			nameData.text(userPetsArray[i].pet_name);

			petDataSummaryRow.append(iconData);
			petDataSummaryRow.append(nameData);

			var petDataDetailDiv = $("<div>");
			petDataDetailDiv.attr("class", "petDataDetail");

			var breedDiv = $("<div>");
			breedDiv.text("Breed: " + userPetsArray[i].pet_breed);

			var sexDiv = $("<div>");
			sexDiv.text("Sex: " + userPetsArray[i].pet_sex);

			var ageDiv = $("<div>");
			ageDiv.text("Age: " + userPetsArray[i].pet_age);

			var weightDiv = $("<div>");
			weightDiv.text("Weight: " + userPetsArray[i].pet_weight);

			var sizeDiv = $("<div>");
			sizeDiv.text("Size: " + userPetsArray[i].pet_size);

			petDataDetailDiv.append(breedDiv);
			petDataDetailDiv.append(sexDiv);
			petDataDetailDiv.append(ageDiv);
			petDataDetailDiv.append(weightDiv);
			petDataDetailDiv.append(sizeDiv);

			nameData.append(petDataDetailDiv);

			petDataArea.append(petDataSummaryRow);
		}
	}


	function findUserKey(userEmail)
	{
		console.log("findUserKey("+userEmail+")");

		var userKey = "";
		
		var ref = database.ref().child("users");

		ref.orderByChild("email").equalTo(userEmail).once("child_added", function(snapshot)
		{
			console.log("TESTING DATABASE FOR EMAIL: " + snapshot.key);

			if(snapshot.child("email").val().toUpperCase() === userEmail.toUpperCase())
			{
				console.log("userEmail found: " + userEmail);
				userKey = snapshot.key;

				currentUser.key = snapshot.key;
				currentUser.name = snapshot.child("name").val();
				currentUser.displayName = snapshot.child("displayName").val();
				currentUser.email = snapshot.child("email").val();
				currentUser.photoURL = snapshot.child("photoURL").val();
				currentUser.added = snapshot.child("added").val();
				currentUser.login = snapshot.child("login").val();
			}
		});

		return userKey;
	}


	function GetIcon(color) 
	{
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
	function mapCall(map, lattitiude, longitude, searchLocation, iconColor, getName, getAdd, getPhone) 
	{
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
	function locator() 
	{
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


	function validatePetData(name, breed, sex, age, weight, size)
	{
		if(name === "")
		{
			return "Name is required!";
		}
		else if (breed === "")
		{
			return "Breed is required!";
		}
		else if (sex === "")
		{
			return "Sex is required!";
		}
		else if (age === "")
		{
			return "Age is required!";
		}
		else if (weight === "")
		{
			return "Weight is required!";
		}
		else if (size === "")
		{
			return "Size is required!";
		}
		else
		{
			return "";
		}
	}


	function findPetKey(petName)
	{
		console.log("findPetKey(" + petName + ")" );

		var petKey = "";

		var userKey = currentUser.key;

		var ref = database.ref().child("users/"+userKey+"/pets");

		ref.orderByKey().on("child_added", function(snapshot)
		{
			if(snapshot.child("pet_name").val().toUpperCase() === petName.toUpperCase())
			{
				petKey = snapshot.key;
			}
		});

		return petKey;
	}


	/*** PAGE EVENTS ***/


	$("#btn-size_xs").on("click", function()
	{
		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();
		console.log("SELECTED PET SIZE: " + selectedPetSize);

		//$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");

	});


	$("#btn-size_sm").on("click", function()
	{
		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();
		console.log("SELECTED PET SIZE: " + selectedPetSize);

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		//$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_md").on("click", function()
	{
		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();
		console.log("SELECTED PET SIZE: " + selectedPetSize);

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		//$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_lg").on("click", function()
	{
		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();
		console.log("SELECTED PET SIZE: " + selectedPetSize);

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		//$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_xl").on("click", function()
	{
		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();
		console.log("SELECTED PET SIZE: " + selectedPetSize);

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		//$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_unk").on("click", function()
	{
		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();

		console.log("SELECTED PET SIZE: " + selectedPetSize);

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		//$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-add").on("click", function()
	{
		event.preventDefault();
		//console.log("ADD BUTTON CLICKED");

		$("#initialPetDataInputArea_error").text("");

		var name = $("#petNameInput").val();
		var breed = $("#petBreedInput").val();
		var sex = $("#petSexInput").val();
		var age = $("#petAgeInput").val();
		var weight = $("#petWeightInput").val();

		var dataError = validatePetData(name, breed, sex, age, weight, selectedPetSize);

		$("#initialPetDataInputArea_error").text(dataError);

		if(dataError === "")
		{
			var isPetInArray = false;

			for( var i = 0; i < userPetsArray.length; i++)
			{
				if(userPetsArray[i].pet_name.toUpperCase() === name.toUpperCase())
				{
					isPetInArray = true;
					break;
				}
			}

			if(isPetInArray)
			{
				$("#initialPetDataInputArea_error").text("Pet with that name already exists in your account!");
			}
			else
			{
				var pet = {
					pet_age: age,
					pet_breed: breed,
					pet_name: name,
					pet_sex: sex,
					pet_weight: weight,
					pet_size: selectedPetSize
				};

				userPetsArray.push(pet);

				$("#petUpdateTime").text("Last Updated: " + moment().format("MM/DD/YYYY HH:mm:ss"));

				if(currentUser.email != "")
				{
					if(currentUser.key != "")
					{
						var petKey = database.ref().child("users/"+currentUser.key+"/pets").push(
						{
							pet_age: age,
							pet_breed: breed,
							pet_name: name,
							pet_sex: sex,
							pet_weight: weight,
							pet_size: selectedPetSize
						});

						populatePetData(currentUser.key);

						var petsUpdated = moment().format("MM/DD/YYYY HH:mm:ss");

						database.ref("users/"+currentUser.key+"/pets").update(
						{
							pets_updated: petsUpdated
						});
					}
					else
					{
						// this is a new user
						setUserData(currentUser);
					}
				}
				else
				{
					//put div on page
					var petDataArea = $("#petDataArea");

					var petDataSummaryRow = $("<tr>");
					petDataSummaryRow.attr("class", "petDataSummary");
		
					var iconData = $("<td>");
					iconData.attr("class", "tableDataIndent");

					var iconButton = $("<button>");
					iconButton.attr("class", "btn");
					iconButton.addClass("fas");
					iconButton.addClass("fa-plus");
					iconButton.addClass("btn-openClose");

					iconData.append(iconButton);

					var nameData = $("<td>");
					nameData.attr("class", "petName");
					nameData.text(name);
		
					petDataSummaryRow.append(iconData);
					petDataSummaryRow.append(nameData);
		
					var petDataDetailDiv = $("<div>");
					petDataDetailDiv.attr("class", "petDataDetail");
		
					var breedDiv = $("<div>");
					breedDiv.text("Breed: " + breed);
		
					var sexDiv = $("<div>");
					sexDiv.text("Sex: " + sex);
		
					var ageDiv = $("<div>");
					ageDiv.text("Age: " + age);
		
					var weightDiv = $("<div>");
					weightDiv.text("Weight: " + weight);
		
					var sizeDiv = $("<div>");
					sizeDiv.text("Size: " + selectedPetSize);
		
					petDataDetailDiv.append(breedDiv);
					petDataDetailDiv.append(sexDiv);
					petDataDetailDiv.append(ageDiv);
					petDataDetailDiv.append(weightDiv);
					petDataDetailDiv.append(sizeDiv);
		
					nameData.append(petDataDetailDiv);
		
					petDataArea.append(petDataSummaryRow);
				}

				$("#petNameInput").val("");
				$("#petBreedInput").val("");
				$("#petSexInput").val("");
				$("#petAgeInput").val("");
				$("#petWeightInput").val("");

				selectedPetSize = "";

				$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
				$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
				$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
				$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
				$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
				$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
			}
		}

	});


	$("#btn-noSignIn").on("click", function()
	{	
		signInArea.hide();
		mainContentArea.show();

		userPetsArray = [];

		var selectedUser = $("#testUserSelect").children("option:selected");

		/*console.log("READING USER SELECTOR:" + "\n" + 
			"displayName: " + selectedUser.val().trim() + "\n" + 
			"email: " + selectedUser.attr("data-email").trim() + "\n" + 
			"photoURL: " + selectedUser.attr("data-photo").trim()
		);*/

		var selectedUserInfo = {
			key: "",
			displayName: selectedUser.val().trim(),
			email: selectedUser.attr("data-email").trim(),
			photoURL: selectedUser.attr("data-photo").trim()
		};

		//updateUserInfoArea(selectedUserInfo);
		//$("#userProfileArea").show();

		setUserData(selectedUserInfo);

		// MAP SECTION
		$("#mapid").show();
		locator();

		// AMAZON SECTION
		$('.amazon-stuff').show();

		$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
	});


	$("#btn-googleSignOut").on("click", function()
	{
		firebase.auth().signOut();

		updateUserInfoArea(defaultGoogleUser);

		setUserData(defaultGoogleUser);

		userPetsArray = [];
		//empty selectedPet

		signInArea.show();
		$('.amazon-stuff').hide();
		$('body').find('script').attr('src', '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082').remove();
		$("#mapid").hide();
		mainContentArea.hide();
	});


	$("#btn-googleSignIn").on("click", function()
	{
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().useDeviceLanguage();

		provider.addScope("profile");
		provider.addScope("email");

		userPetsArray = [];

		return firebase.auth().signInWithPopup(provider).then(function (result) 
		{
			// NEED TO PUT USER DATA INTO USER INFO AREA
			setUserData(result.user);

			locator();
			signInArea.hide();
			mainContentArea.show();

		}).catch(function (error) {
			console.log("Google sign-in error: " + "\n" +  error);
		});

		$('.amazon-stuff').show();

		$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');

		$("#mapid").show();
	});


	$(document).on("click", "button.btn-openClose", function()
	{
		// this picks up all text in the TD beside the TD that the button is in.
		// including the text of the inner-DIV
		//console.log($(this).parent().siblings(".petName").text().toUpperCase() + " BUTTON CLICKED");
		//console.log("INNER DIV CONTENT: " + "\n" + $(this).parent().siblings(".petName").find("div").text().toUpperCase());

		var buttonClasses = $(this).attr("class");

		if(buttonClasses.search("fa-plus") > -1)
		{
			// the button currently has the + icon
			$(this).attr("class", "btn");
			$(this).addClass("fas");
			$(this).addClass("fa-minus");
			$(this).addClass("btn-openClose");
			// show the inner div
			$(this).parent().siblings(".petName").find("div").show();

		}
		else if(buttonClasses.search("fa-minus") > -1)
		{
			// the button currently has the - icon
			$(this).attr("class", "btn");
			$(this).addClass("fas");
			$(this).addClass("fa-plus");
			$(this).addClass("btn-openClose");
			// hide the inner div
			$(this).parent().siblings(".petName").find("div").hide();
		}
		else
		{
			console.log("BUTTON CLASSES: " + $(this).attr("class"));
		}

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





	/*** DATABASE LISTENERS ***/


	database.ref().on("child_added", function(childSnapshot) 
	{
		console.log("CHILD ADDED");

	}, function(errorObject) {
		console.log("Errors handled: " + errorObject.code);
	});






	
	
	
		

});


