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

var populateUserList = function() {
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
populateUserList();

var showDialog = function() {
	document.getElementById("login_dialog").style.display = "block";
};

var hideDialog = function() {
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
	document.getElementById("txtbox_gamer").value = "";
	document.getElementById("txtbox_password").value = "";
	document.getElementById("txtbox_email").value = "";
};


var logout = function() {
		Parse.User.logOut();
		document.getElementById("login_btn_label").innerHTML = "You must login to vote!";
		document.getElementById("login_button").innerHTML = "LogIn";
    	document.getElementById("login_button").onclick = showDialog;
	};

var toggleDialog = function() {
	document.getElementById("dialog_title").innerHTML = "Create Account";
	document.getElementById("login_dialog_btn").style.display = "none";
  	document.getElementById("email_label").style.display = "inline";
    document.getElementById("txtbox_email").style.display = "inline";
    document.getElementById("create_account").style.display = "none";
    document.getElementById("submit_button").style.display = "inline";
}

var register = function() {
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