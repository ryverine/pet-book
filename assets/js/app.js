

$(document).ready(function () 
{
	/*** GLOBAL ***/


	var signInArea = $("#signInArea");
	var mainContentArea = $("#mainContentArea");

	var defaultGoogleUser = {	
		key: "",
		name: "", 
		email: "", 
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


	function updateUserInfoArea(name, email, photo)
	{
		if(email === "")
		{
			$("#profileImage").attr("src", "#");
			$("#googleDisplayName").text("");
			$("#googleEmail").text("");
			$("#userProfileArea").hide();
		}
		else
		{
			$("#profileImage").attr("src", photo);
			$("#googleDisplayName").text(name);
			$("#googleEmail").text(email);
			$("#userProfileArea").show();
		}
	}


	function logReturningUser(userKey)
	{
		if(userKey != "")
		{
			var loginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

			console.log("logReturningUser("+userKey+") @ " + loginDateTime);

			database.ref().child("users/"+ userKey).update(
			{
				login: loginDateTime
			});
		}
	}


	function addNewUserToDatabase()
	{
		console.log("addNewUserToDatabase()");
		console.log("currentUser.name: " + currentUser.name);
		console.log("currentUser.email: " + currentUser.email);
		console.log("currentUser.key: " + currentUser.key);

		var userAddedDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		var userLoginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

		var ref = database.ref().child("users");

		if(currentUser.email != "")// only add people with email
		{
			//NEW USER, do they have a pet?
			console.log("addNewUserToDatabase(): userPetsArray.length = " + userPetsArray.length);
			if(userPetsArray.length > 0)
			{
				var newUserKey = database.ref().child("users").push(
				{
					name: currentUser.name,
					email: currentUser.email,
					added: userAddedDateTime,
					login: userLoginDateTime,
					pets:{
						pets_updated: userAddedDateTime
					}
				}).key;

				console.log("NEW USER KEY:" + newUserKey);

				currentUser = {
					key: newUserKey,
					name: currentUser.name,
					email: currentUser.email
				};

				for (var i = 0; i < userPetsArray.length; i++)
				{
					var petname = userPetsArray[i].pet_name;
					var petbreed = userPetsArray[i].pet_breed;
					var petsex = userPetsArray[i].pet_sex;
					var petage = userPetsArray[i].pet_age;
					var petweight = userPetsArray[i].pet_weight;
					var petsize = userPetsArray[i].pet_size;
		
					database.ref().child("users/"+ newUserKey + "/pets").push(
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
	}



/*
	function findUserKey(userEmail)
	{
		console.log("findUserKey("+userEmail+")");

		var userKey = "";
		
		var ref = database.ref().child("users");

		ref.orderByChild("email").equalTo(userEmail).once("child_added", function(snapshot)
		{
			if(snapshot.child("email").val().toUpperCase() === userEmail.toUpperCase())
			{
				console.log(userEmail + " found in DB: " + snapshot.key);
				userKey = snapshot.key;
			}
		});

		return userKey;
	}
*/


	/*function getPetData(userKey)
	{
		console.log("getPetData("+userKey+")");

		userPetsArray = [];

		//ADD PET DATA TO userPetsArray

		var ref = database.ref().child("users/"+userKey+"/pets");


		ref.orderByKey().on("child_added", function(snapshot)
		{
			if(snapshot.key === "pets_updated")
			{
				console.log("getPetData: INSIDE ON - snapshot.key = pets_updated");
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

			console.log("getPetData: INSIDE ON: " + snapshot.key);

		}).then(function()
		{
			console.log("getPetData: INSIDE THEN: " + snapshot.key);

			for(var i = 0; i < userPetsArray.length; i++)
			{
				console.log("THEN FOR-LOOP: " + userPetsArray[i].pet_name );
			}


			// want to now load data of pets array onto page!!!!!!!!!!!!!!!!!!!!

		});

		console.log("getPetData("+userKey+"): END OF FUNCTION");

	}*/


	function populatePetData()
	{
		var petDataArea = $("#petDataArea");
		petDataArea.empty();

		console.log("populatePetData: BEFORE FOR-LOOP");

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


	/*function findPetKey(petName)
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
	}*/


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
		console.log("ADD BUTTON CLICKED");
		console.log("USER NAME: " + currentUser.name);
		console.log("USER EMAIL: " + currentUser.email);
		console.log("USER KEY: " + currentUser.key);

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

				var petUpdateTime = moment().format("MM/DD/YYYY HH:mm:ss");

				$("#petUpdateTime").text("Last Updated: " + petUpdateTime);

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

						populatePetData();

						database.ref("users/"+currentUser.key+"/pets").update(
						{
							pets_updated: petUpdateTime
						});
					}
					else
					{
						// ADD NEW USER
						addNewUserToDatabase();
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
		console.log("NON-GOOGLE SIGN IN");

		userPetsArray = [];

		var selectedUser = $("#testUserSelect").children("option:selected");

		updateUserInfoArea(selectedUser.val().trim(), selectedUser.attr("data-email").trim(), selectedUser.attr("data-photo").trim());

		signInArea.hide();
		
		mainContentArea.show();

		var userName = selectedUser.val().trim();
		var userEmail = selectedUser.attr("data-email").trim();
		var userKey = "";

		loadUserData(userName, userEmail, userKey);
		
		// MAP SECTION
		$("#mapid").show();
		locator();

		// AMAZON SECTION
		$('.amazon-stuff').show();

		$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');
	});


	function loadUserData(userName, userEmail, userKey)
	{
		currentUser = {
			key: "",
			name: userName,
			email: userEmail
		};

		var ref = database.ref().child("users");

		ref.orderByChild("email").equalTo(userEmail).once("child_added").then(function(snapshot)
		{
			//if(snapshot.child("email").val().toUpperCase() === userEmail.toUpperCase())
			//{
				console.log(userEmail + " found in DB: " + snapshot.key);
				userKey = snapshot.key;
			//}

			if(userKey === "")
			{
				console.log("NEW USER LOG-IN:");
			}
			else
			{
				console.log("RETURNING USER LOG-IN: " + userKey);

				currentUser = {
					key: userKey,
					name: userName,
					email: userEmail
				};

				var pets = snapshot.child("pets");
				pets.forEach(function(petSnapshot) 
				{
					var petKey = petSnapshot.key;
					var petData = petSnapshot.child("pet_name").val();

					console.log("PETS: " + petKey + " = " + petData);

					if(petKey != "pets_updated")
					{
						var tmpPetObj = {
							pet_age: petSnapshot.child("pet_age").val(),
							pet_breed: petSnapshot.child("pet_breed").val(),
							pet_name: petSnapshot.child("pet_name").val(),
							pet_sex: petSnapshot.child("pet_sex").val(),
							pet_size: petSnapshot.child("pet_size").val(),
							pet_weight: petSnapshot.child("pet_weight").val()
						};
		
						userPetsArray.push(tmpPetObj);
					}
				});

				populatePetData();
			}

			logReturningUser(userKey);

		})
		.catch(function(error)
		{
			console.log("USER DB Error: " + "\n" +  error);
		});
	}


	$("#btn-googleSignOut").on("click", function()
	{
		firebase.auth().signOut();

		updateUserInfoArea("", "", "");

		// THIS IS ONLY NEEDED FOR TESTING:
		// setUserData(defaultGoogleUser);

		userPetsArray = [];
		$("petDataArea").empty();
		
		$('.amazon-stuff').hide();
		$('body').find('script').attr('src', '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082').remove();
		$("#mapid").hide();

		mainContentArea.hide();
		signInArea.show();
	});


	$("#btn-googleSignIn").on("click", function()
	{
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().useDeviceLanguage();
		provider.addScope("profile");
		provider.addScope("email");

		userPetsArray = [];

		var theUser = function (provider)
		{
			return firebase.auth().signInWithPopup(provider).then(function (result) 
			{
				updateUserInfoArea(result.user.displayName, result.user.email, result.user.photoURL);

				loadUserData(result.user.displayName, result.user.email, "");

				setUserData(result.user)

				locator();

				signInArea.hide();

				mainContentArea.show();

				$('.amazon-stuff').show();

				$('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=cb16da6f-a242-41e1-b8b6-27ccbbf85082"></script>');

				$("#mapid").show();

			}).catch(function (error) {
			console.log("Google sign-in error: " + "\n" +  error);
			});
		}
	});


	$(document).on("click", "button.btn-openClose", function()
	{
		var buttonClasses = $(this).attr("class");

		if(buttonClasses.search("fa-plus") > -1)
		{
			$(this).attr("class", "btn");
			$(this).addClass("fas");
			$(this).addClass("fa-minus");
			$(this).addClass("btn-openClose");

			$(this).parent().siblings(".petName").find("div").show();

			var petDetailDiv = $(this).parent().siblings(".petName").children().text();
			
			var petDetailDivText = petDetailDiv.split("Size: ");

			var size = petDetailDivText[1];

			amazonSearchCall(size);
		}
		else if(buttonClasses.search("fa-minus") > -1)
		{
			$(this).attr("class", "btn");
			$(this).addClass("fas");
			$(this).addClass("fa-plus");
			$(this).addClass("btn-openClose");

			$(this).parent().siblings(".petName").find("div").hide();

			amazonSearchCall("");
		}
		else
		{
			// THIS SHOULD NEVER OCCUR
		}

	});

	function amazonSearchCall(petSize)
	{
		console.log("amazonSearchCall("+petSize+")");

		if(petSize === "")
		{
			// clear and/or hide amazon area
		}
		else
		{
			// do the amazon seach with pet size value
		}
	}


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





	/*** DATABASE LISTENERS **

	database.ref().on("child_added", function(childSnapshot) 
	{
		console.log("CHILD ADDED");

	}, function(errorObject) {
		console.log("Errors handled: " + errorObject.code);
	});

	*/


});


