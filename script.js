Parse.initialize("pNtTrIuHsxuyVUVIS3zS3xoeODD08lhYWFlQPKdP", "Ovi9IPHB7UhgpyeH1doioqEIzyuxOGQ80HsINpXp");

/*voting
every meeple has event handler to say I am clicked!
event handler will have to figure out which in the row 1-5 was clicked
will have to figure out which game it corresponds to
do a check to make sure they have enough votes and if not give an alert
save vote to database and then
then permanently update css to reflect vote
also update total vote in table
*/

/*create how the voting works dialog
similar to showdialog when clicked
then have rules
then click on x will hide dialog
*/

/*learn what the heack makes the meeples work!!!*/

/*when user logs in or creates account update the gamer list*/

/*improvements:
make list alphabetical for gamers - DONE!!!!

glitch when user creates new account and gamer list updates
- could add fade in fade out css
- could make it so just the new user is added
*/

window.onload = function() {
     if(debug){console.log("onload");}
    populateUserList();
  }; 

var debug = true;

var populateUserList = function() {
  if(debug){console.log("populateUserList");}
	var query = new Parse.Query(Parse.User);
	query.ascending("username");
	query.find({
  		success: function(users) {
    		for( var i=0; i < users.length; i++ ){
    			document.getElementById("user_list").innerHTML += "<li class='status_neutral'>" + users[i].get('username') + "</li>";
    		}
  		}
	});
};

var clearUserList = function() {
   if(debug){console.log("clearUserList");}
  document.getElementById("user_list").innerHTML = "";
};

var resetUserList = function() {
  if(debug){console.log("resetUserList");}
  clearUserList();
  populateUserList();
};

var showDialog = function() {
   if(debug){console.log("showDialog");}
	document.getElementById("login_dialog").style.display = "block";
};

var hideDialog = function() {
   if(debug){console.log("hideDialog");}
	document.getElementById("login_dialog").style.display = "none";
	document.getElementById("dialog_title").innerHTML = "Login";
	document.getElementById("login_dialog_btn").style.display = "inline";
  	document.getElementById("email_label").style.display = "none";
    document.getElementById("submit_button").style.display = "none";
    document.getElementById("create_account").style.display = "block";
        document.getElementById("txtbox_email").style.display = "none";
    clearDialog();
};

var clearDialog = function() {
   if(debug){console.log("clearDialog");}
	document.getElementById("txtbox_gamer").value = "";
	document.getElementById("txtbox_password").value = "";
	document.getElementById("txtbox_email").value = "";
};


var logout = function() {
   if(debug){console.log("logout");}
		Parse.User.logOut();
		document.getElementById("login_btn_label").innerHTML = "You must login to vote!";
		document.getElementById("login_button").innerHTML = "LogIn";
    	document.getElementById("login_button").onclick = showDialog;
	};

var toggleDialog = function() {
   if(debug){console.log("toggleDialog");}
	document.getElementById("dialog_title").innerHTML = "Create Account";
	document.getElementById("login_dialog_btn").style.display = "none";
  	document.getElementById("email_label").style.display = "inline";
    document.getElementById("txtbox_email").style.display = "inline";
    document.getElementById("create_account").style.display = "none";
    document.getElementById("submit_button").style.display = "inline";
}

var register = function() {
   if(debug){console.log("register");}
	var user = new Parse.User();
	var username = document.getElementById("txtbox_gamer").value;
	user.set("username", username);
	user.set("password", document.getElementById("txtbox_password").value);
	user.set("email", document.getElementById("txtbox_email").value);
	
	/*user.set("votesRemaining", 5);
	user.set("gameVotes", {});*/
  
	user.signUp(null, {
  		success: function(user) {
  			document.getElementById("login_btn_label").innerHTML = username;
  			document.getElementById("login_button").innerHTML = "Logout";
    		document.getElementById("login_button").onclick = logout;
        resetUserList();
    		hideDialog();
    		clearDialog();
  		},
  		error: function(user, error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});
}
/*
after a game night:
 everyone's status goes to neutral
 game votes go to zero
 user votes return to 5
 ------
 user logs in & uses a vote:
 each user has a status
 upon vote, if they haven't voted yet... call status_going
 update/refresh userlist with new status
 ----
 when we make the user list
 set the class according to user status
*/
var login = function() {
   if(debug){console.log("login");}
	var username = document.getElementById("txtbox_gamer").value;
	Parse.User.logIn(username, document.getElementById("txtbox_password").value, {
  success: function(user) {
    document.getElementById("login_btn_label").innerHTML = username;
  	document.getElementById("login_button").innerHTML = "Logout";
    document.getElementById("login_button").onclick = logout;
    hideDialog();
    clearDialog();
  },
  error: function(user, error) {
   	alert("Error: " + error.code + " " + error.message);
  }
});
};

var meepleClicked = function() {
   if(debug){console.log("meepleClicked");}
	alert("You have voted!");
};

var ilist = document.images;

for(var i = 0; i < ilist.length; i++) {
   	ilist[i].onclick=meepleClicked;
}


//user will vote on game with a value 1-5
/*var Games = Parse.Object.extend("Games");
var games = new Games();
games.save({game: "Pandemic", vote: 5}).then(function(object) {
});*/