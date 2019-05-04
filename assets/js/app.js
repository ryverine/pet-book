$(document).ready(function () 
{

	/*** GLOBAL ***/


	var signInArea = $("#signInArea");

	var mainContentArea = $("#mainContentArea");
	mainContentArea.hide();


	var defaultGoogleUser = {	
		key: "",
		name: "", 
		email: "", 
	};

	var currentUser = defaultGoogleUser;

	var selectedPet = {
		pet_name: "",
		pet_breed: "",
		pet_age: "",
		pet_weight: "",
		pet_sex: "",
		pet_size: ""
	};

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
			$("#profileImage").hide();
			$("#googleDisplayName").text("");
			$("#googleEmail").text("");
	
			$("#btn-googleSignOut").hide();
		}
		else
		{
			$("#profileImage").attr("src", photo);
			$("#profileImage").show();
			$("#googleDisplayName").text(name);
			$("#googleEmail").text(email);
			$("#btn-googleSignOut").show();
		}
	}



	function logReturningUser(userKey)
	{
		if(userKey != "")
		{
			var loginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

			database.ref().child("users/"+ userKey).update(
			{
				login: loginDateTime
			});
		}
	}



	function addNewUserToDatabase()
	{
		var userAddedDateTime = moment().format("MM/DD/YYYY HH:mm:ss");
		var userLoginDateTime = moment().format("MM/DD/YYYY HH:mm:ss");

		var ref = database.ref().child("users");

		if(currentUser.email != "")
		{
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


	function populatePetData()
	{
		var petDataArea = $("#petDataArea");
		petDataArea.empty();

		for(var i = 0; i < userPetsArray.length; i++)
		{
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

			var editButton = $("<button>");
			editButton.attr("class", "btn");
			editButton.addClass("btn-editPetData");
			editButton.text("Edit");

			petDataSummaryRow.append(iconData);
			petDataSummaryRow.append(nameData);
			nameData.append(editButton);

			var petDataDetailDiv = $("<div>");
			petDataDetailDiv.attr("class", "petDataDetail");

			var breedDiv = $("<div>");
			breedDiv.attr("class", "petBreed");
			breedDiv.text("Breed: " + userPetsArray[i].pet_breed);

			var sexDiv = $("<div>");
			sexDiv.attr("class", "petSex");
			sexDiv.text("Sex: " + userPetsArray[i].pet_sex);

			var ageDiv = $("<div>");
			ageDiv.attr("class", "petAge");
			ageDiv.text("Age: " + userPetsArray[i].pet_age);

			var weightDiv = $("<div>");
			weightDiv.attr("class", "petWeight");
			weightDiv.text("Weight: " + userPetsArray[i].pet_weight);

			var sizeDiv = $("<div>");
			sizeDiv.attr("class", "petSize");
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


	/*** PAGE EVENTS ***/


	$("#btn-size_xs").on("click", function()
	{

		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();

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

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
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

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_lg").on("click", function()
	{

		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_xl").on("click", function()
	{

		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-size_unk").on("click", function()
	{

		event.preventDefault();

		$(this).attr("class", "btn btn-primary sizeButton_pressed");

		selectedPetSize = $(this).text().toLowerCase();

		$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
		$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
	});


	$("#btn-add").on("click", function()
	{
		event.preventDefault();

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
						addNewUserToDatabase();
					}
				}
				else
				{
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

					var editButton = $("<button>");
					editButton.attr("class", "btn");
					editButton.addClass("btn-editPetData");

					petDataSummaryRow.append(iconData);
					petDataSummaryRow.append(nameData);
					nameData.append(editButton);
		
					var petDataDetailDiv = $("<div>");
					petDataDetailDiv.attr("class", "petDataDetail");
		
					var breedDiv = $("<div>");
					breedDiv.attr("class", "petBreed");
					breedDiv.text("Breed: " + breed);
		
					var sexDiv = $("<div>");
					sexDiv.attr("class", "petSex");
					sexDiv.text("Sex: " + sex);
		
					var ageDiv = $("<div>");
					ageDiv.attr("class", "petAge");
					ageDiv.text("Age: " + age);
		
					var weightDiv = $("<div>");
					weightDiv.attr("class", "petWeight");
					weightDiv.text("Weight: " + weight);
		
					var sizeDiv = $("<div>");
					sizeDiv.attr("class", "petSize");
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

				selectedPet = {
					pet_name: "",
					pet_breed: "",
					pet_age: "",
					pet_weight: "",
					pet_sex: "",
					pet_size: ""
				};
			}
		}

	});


	$("#btn-noSignIn").on("click", function()
	{	
		userPetsArray = [];

		$("petDataArea").empty();

		selectedPet = {
			pet_name: ""
		}

		selectedPetSize = "";

		/*** DELETE EVERYTHING BELOW FOR FINAL ***/
		var selectedUser = $("#testUserSelect").children("option:selected");

		updateUserInfoArea(selectedUser.val().trim(), selectedUser.attr("data-email").trim(), selectedUser.attr("data-photo").trim());

		signInArea.hide();
		
		mainContentArea.show();
		//locator();

		var userName = selectedUser.val().trim();
		var userEmail = selectedUser.attr("data-email").trim();
		var userKey = "";

		loadUserData(userName, userEmail, userKey);
		/*** DELETE EVERYTHING ABOVE FOR FINAL ***/
		

		/*** USE EVERYTHING BELOW FOR FINAL ***/
		/*
			currentUser = {
				key: ""
				name: "";
				email: "";
			}
			updateUserInfoArea("", "", "";
		*/
		/*** USE EVERYTHING ABOVE FOR FINAL ***/



		$("#mapid").show();
		//locator();

		// AMAZON SECTION
		
		amazonCall('default');


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
			userKey = snapshot.key;

			if(userKey != "")
			{
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

		userPetsArray = [];
		$("petDataArea").empty();

		selectedPet = {
			pet_name: ""
		}

		currentUser = {
			email: ""
		}

		selectedPetSize = "";
		
		$('.amazon-stuff').hide();
		$('body').find('#amazon-code').remove();
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

		firebase.auth().signInWithPopup(provider).then(function (result) 
		{
			updateUserInfoArea(result.user.displayName, result.user.email, result.user.photoURL);

			loadUserData(result.user.displayName, result.user.email, "");

			locator();

			signInArea.hide();

			mainContentArea.show();
			
				amazonCall('default');
				$("#mapid").show();


		}).catch(function (error) 
		{
			console.log("Google sign-in error: " + "\n" +  error);
		});
		
	});


	$(document).on("click", "button.btn-openClose", function()
	{
		var buttonClasses = $(this).attr("class");

		var editButton = $(this).parent().siblings(".petName").find("button.btn-editPetData");

		if(buttonClasses.search("fa-plus") > -1)
		{
			$(editButton).show();

			var petDataArea_parent = $("#petDataArea");

			var minusButtons = $(petDataArea_parent).find("button.fa-minus");

			for (var btn = 0; btn<minusButtons.length; btn++)
			{
				var btnClasses = $(minusButtons[btn]).attr("class");
				if(btnClasses.search("fa-minus") > -1)
				{
					$(minusButtons[btn]).parent().siblings(".petName").find("div.petDataDetail").hide();
					$(minusButtons[btn]).parent().siblings(".petName").find("button.btn-editPetData").hide();
					
					$(minusButtons[btn]).attr("class", "btn");
					$(minusButtons[btn]).addClass("fas");
					$(minusButtons[btn]).addClass("fa-plus");
					$(minusButtons[btn]).addClass("btn-openClose");
				}
			}

			$(this).attr("class", "btn");
			$(this).addClass("fas");
			$(this).addClass("fa-minus");
			$(this).addClass("btn-openClose");

			var allPetDataDivText = $(this).parent().siblings(".petName").text();
			var findPetName = allPetDataDivText.split("Breed");
			var name = findPetName[0].replace("Edit","");

			var petDataDetail_div = $(this).parent().siblings(".petName").find("div.petDataDetail");
			petDataDetail_div.show();

			var petBreedDivText = $(petDataDetail_div).find("div.petBreed").text();
			var petSexDivText = $(petDataDetail_div).find("div.petSex").text();
			var petAgeDivText = $(petDataDetail_div).find("div.petAge").text();
			var petWeightDivText = $(petDataDetail_div).find("div.petWeight").text();
			var petSizeDivText = $(petDataDetail_div).find("div.petSize").text();

			petBreedDivText = petBreedDivText.split("Breed: ");
			petSexDivText = petSexDivText.split("Sex: ");
			petAgeDivText = petAgeDivText.split("Age: ");
			petWeightDivText = petWeightDivText.split("Weight: ");
			petSizeDivText = petSizeDivText.split("Size: ");

			var breed = petBreedDivText[1];
			var sex = petSexDivText[1];
			var age = petAgeDivText[1];
		    var weight = petWeightDivText[1];
			var size = petSizeDivText[1];

			selectedPet = {
				pet_name: name, 
				pet_breed: breed,
				pet_age: age,
				pet_weight: weight,
				pet_sex: sex,
				pet_size: size
			};

			$('body').find('#amazon-code').remove();

			amazonCall(size);

		}
		else if(buttonClasses.search("fa-minus") > -1)
		{
			$(editButton).hide();

			$(this).attr("class", "btn");
			$(this).addClass("fas");
			$(this).addClass("fa-plus");
			$(this).addClass("btn-openClose");

			$(this).parent().siblings(".petName").find("div.petDataDetail").hide();

			selectedPet = {
				pet_name: "",
				pet_breed: "",
				pet_age: "",
				pet_weight: "",
				pet_sex: "",
				pet_size: ""
			};

			amazonCall("");

		}
		else
		{
			// THIS SHOULD NEVER OCCUR
		}
	});

	$(document).on("click", "button.btn-editPetData", function()
	{
		if(selectedPet.pet_name != "")

		{
			$("#petNameInput").val(selectedPet.pet_name);
			$("#petBreedInput").val(selectedPet.pet_breed);
			$("#petSexInput").val(selectedPet.pet_sex);
			$("#petAgeInput").val(selectedPet.pet_age);
			$("#petWeightInput").val(selectedPet.pet_weight);

			var sizeButtons = $("#initialPetDataInputArea").find("button.sizeButton");

			for (var i = 0; i<sizeButtons.length; i++)
			{	
				var currentSizeButton = $(sizeButtons[i]).text();

				if(selectedPet.pet_size.toUpperCase() === currentSizeButton.toUpperCase())
				{
					$(sizeButtons[i]).attr("class", "btn");
					$(sizeButtons[i]).addClass("btn-primary");
					$(sizeButtons[i]).addClass("sizeButton_pressed");

					selectedPetSize = selectedPet.pet_size.toLowerCase();
				}
				else
				{
					$(sizeButtons[i]).attr("class", "btn");
					$(sizeButtons[i]).addClass("btn-primary");
					$(sizeButtons[i]).addClass("sizeButton");
				}
			}

			location.href='#dataInputArea';
		}
	});


	function amazonSearchCaller(petSize)
	{
		if(petSize === "")
		{
			$("#petNameInput").val(selectedPet.pet_name);
			$("#petBreedInput").val(selectedPet.pet_breed);
			$("#petSexInput").val(selectedPet.pet_sex);
			$("#petAgeInput").val(selectedPet.pet_age);
			$("#petWeightInput").val(selectedPet.pet_weight);

			var sizeButtons = $("#initialPetDataInputArea").find("button.sizeButton");

			for (var i = 0; i<sizeButtons.length; i++)
			{	
				var currentSizeButton = $(sizeButtons[i]).text();

				if(selectedPet.pet_size.toUpperCase() === currentSizeButton.toUpperCase())
				{
					$(sizeButtons[i]).attr("class", "btn");
					$(sizeButtons[i]).addClass("btn-primary");
					$(sizeButtons[i]).addClass("sizeButton_pressed");

					selectedPetSize = selectedPet.pet_size.toLowerCase();
				}
				else
				{
					$(sizeButtons[i]).attr("class", "btn");
					$(sizeButtons[i]).addClass("btn-primary");
					$(sizeButtons[i]).addClass("sizeButton");
				}
			}

			location.href='#dataInputArea';
		}
	});


	function amazonSearchCaller(petSize)
	{
		if(petSize === "")
		{
			$("#petNameInput").val(selectedPet.pet_name);
			$("#petBreedInput").val(selectedPet.pet_breed);
			$("#petSexInput").val(selectedPet.pet_sex);
			$("#petAgeInput").val(selectedPet.pet_age);
			$("#petWeightInput").val(selectedPet.pet_weight);

			var sizeButtons = $("#initialPetDataInputArea").find("button.sizeButton");

			for (var i = 0; i<sizeButtons.length; i++)
			{	
				var currentSizeButton = $(sizeButtons[i]).text();

				if(selectedPet.pet_size.toUpperCase() === currentSizeButton.toUpperCase())
				{
					$(sizeButtons[i]).attr("class", "btn");
					$(sizeButtons[i]).addClass("btn-primary");
					$(sizeButtons[i]).addClass("sizeButton_pressed");

					selectedPetSize = selectedPet.pet_size.toLowerCase();
				}
				else
				{
					$(sizeButtons[i]).attr("class", "btn");
					$(sizeButtons[i]).addClass("btn-primary");
					$(sizeButtons[i]).addClass("sizeButton");
				}
			}

			location.href='#dataInputArea';
		}
	};

	$("#btn-update").on("click", function()
	{	
		event.preventDefault();

		$("#initialPetDataInputArea_error").text(dataError);

		if(currentUser.email != "")
		{
			$("#initialPetDataInputArea_error").text("");

			var name_input = $("#petNameInput").val();
			var breed_input = $("#petBreedInput").val();
			var sex_input = $("#petSexInput").val();
			var age_input = $("#petAgeInput").val();
			var weight_input = $("#petWeightInput").val();

			if(	selectedPet.pet_name.toUpperCase() === name_input.toUpperCase() && 
				selectedPet.pet_breed.toUpperCase() === breed_input.toUpperCase() && 
				selectedPet.pet_sex.toUpperCase() === sex_input.toUpperCase() && 
				selectedPet.pet_age.toUpperCase() === age_input && 
				selectedPet.pet_weight.toUpperCase() === weight_input && 
				selectedPet.pet_size.toUpperCase() === selectedPetSize.toUpperCase())
			{
				$("#initialPetDataInputArea_error").text("No data has been changed!");
			}
			else
			{
				if(selectedPet.pet_name != "")
				{
					var dataError = validatePetData(name_input, breed_input, sex_input, age_input, weight_input, selectedPetSize);

					if(dataError === "")
					{
						for(var i = 0; i < userPetsArray.length; i++)
						{
							if(selectedPet.pet_name.toUpperCase() === userPetsArray[i].pet_name.toUpperCase())
							{
								userPetsArray[i].pet_name = name_input;
								userPetsArray[i].pet_breed = breed_input;
								userPetsArray[i].pet_age = age_input;
								userPetsArray[i].pet_weight = weight_input;
								userPetsArray[i].pet_sex = sex_input;
								userPetsArray[i].pet_size = selectedPetSize;
							}
						}

						populatePetData();

						var petUpdateTime =  moment().format("MM/DD/YYYY HH:mm:ss");
						$("#petUpdateTime").text(petUpdateTime);

						$("#petNameInput").val("");
						$("#petBreedInput").val("");
						$("#petSexInput").val("");
						$("#petAgeInput").val("");
						$("#petWeightInput").val("");

						$("#btn-size_xs").attr("class", "btn btn-primary sizeButton");
						$("#btn-size_sm").attr("class", "btn btn-primary sizeButton");
						$("#btn-size_md").attr("class", "btn btn-primary sizeButton");
						$("#btn-size_lg").attr("class", "btn btn-primary sizeButton");
						$("#btn-size_xl").attr("class", "btn btn-primary sizeButton");
						$("#btn-size_unk").attr("class", "btn btn-primary sizeButton");

						$("#initialPetDataInputArea_error").text("");

						if(currentUser.key != "")
						{
							var petKey = "";

							var userKey = currentUser.key;

							var ref = database.ref().child("users/"+userKey+"/pets");

							ref.orderByChild("pet_name").equalTo(selectedPet.pet_name).once("child_added").then(function(snapshot)
							{
								petKey = snapshot.key

								database.ref("users/"+currentUser.key+"/pets/"+petKey).update(
								{
									pet_name: name_input,
									pet_breed: breed_input,
									pet_age: age_input,
									pet_weight: weight_input,
									pet_sex: sex_input,
									pet_size: selectedPetSize
								});

								database.ref("users/"+currentUser.key+"/pets").update(
								{
									pets_updated: petUpdateTime
								});

								selectedPetSize = "";

								selectedPet = {
									pet_name: "",
									pet_breed: "",
									pet_age: "",
									pet_weight: "",
									pet_sex: "",
									pet_size: ""
								};
							});
						}
					}
				}
			}
		}
	});	


	$("#btn-remove").on("click", function()
	{
		event.preventDefault();

		if(currentUser.email != "")
		{
			var petToRemoveName = $("#petNameInput").val();


			if(selectedPet.pet_name != "" && selectedPet.pet_name.toUpperCase() === petToRemoveName.toUpperCase())
			{
				var petToRemoveIndex = -1;

				for(var i = 0; i < userPetsArray.length; i++)
				{
					if(selectedPet.pet_name.toUpperCase() === userPetsArray[i].pet_name.toUpperCase())
					{
						petToRemoveIndex = i;
						break;
					}
				}

				if(petToRemoveIndex > -1)
				{
					var splicedArray = userPetsArray.splice(petToRemoveIndex, 1);

					populatePetData();

					var petUpdateTime =  moment().format("MM/DD/YYYY HH:mm:ss");
					$("#petUpdateTime").text(petUpdateTime);

					selectedPet = {
						pet_name: "",
						pet_breed: "",
						pet_age: "",
						pet_weight: "",
						pet_sex: "",
						pet_size: ""
					};

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

					$("#initialPetDataInputArea_error").text("");

					if(currentUser.key != "")
					{
						var petKey = "";

						var userKey = currentUser.key;

						var ref = database.ref().child("users/"+userKey+"/pets");

						ref.orderByChild("pet_name").equalTo(petToRemoveName).once("child_added").then(function(snapshot)
						{
							petKey = snapshot.key

							database.ref().child("users/"+userKey+"/pets/"+petKey).remove();

							database.ref("users/"+currentUser.key+"/pets").update(
							{
								pets_updated: petUpdateTime
							});

						});
					}

				}

			}

			$("#initialPetDataInputArea_error").text("");
		}

	});


	$("#btn-clear").on("click", function()
	{
		event.preventDefault();
		
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

		$("#initialPetDataInputArea_error").text("");

		selectedPet = {
			pet_name: "",
			pet_breed: "",
			pet_age: "",
			pet_weight: "",
			pet_sex: "",
			pet_size: ""
		};

		var petDataArea_parent = $("#petDataArea");

		var petNameTd = petDataArea_parent.find("td.petName");

		var openCloseButtons = petDataArea_parent.find("button.btn-openClose");

		var editButtons = petDataArea_parent.find("button.btn-editPetData");

		var petDataDetailDivs = petDataArea_parent.find("div.petDataDetail");

		for( var i = 0; i < petNameTd.length; i++)
		{
			$(openCloseButtons[i]).attr("class", "btn");
			$(openCloseButtons[i]).addClass("fas");
			$(openCloseButtons[i]).addClass("fa-plus");
			$(openCloseButtons[i]).addClass("btn-openClose");

			$(editButtons[i]).hide();
			
			$(petDataDetailDivs[i]).hide();
		}

	});
	
	//Amazon Ad Creation
	function amazonCall(value){
	
		if (value === 'default'){        
			adNumber = "cb16da6f-a242-41e1-b8b6-27ccbbf85082"
		}
		else if (value === 'toy'){
			adNumber = "bb002f23-2c42-410b-bb77-3bd9a43fcff5"
		}
		else if (value === 'small'){
			adNumber = "6b183ca8-fca7-48ef-b527-b0ff3e77c060";
		}
		else if (value === 'medium'){
			adNumber = "93405050-3b68-4b29-b656-39f17da1c256";
		}
		else if (value === 'large'){
			adNumber = "0c90518e-e974-440f-8b1f-655456df68fe";
		}
		else{
			adNumber = "3148660e-e283-4315-ab35-fea0d8bcc2ac";
		}
	
		renderScript(adNumber)
	}
	
	function renderScript(adNumber){
		var associate=
		$('.amazon-stuff').show();
		$('body').append('<script id="amazon-code" src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=' + adNumber + '"></script>');
		$('.amazon-stuff').attr('id', "amzn-assoc-ad-" + adNumber);
	}


});

