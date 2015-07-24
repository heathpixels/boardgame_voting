Parse.initialize("pNtTrIuHsxuyVUVIS3zS3xoeODD08lhYWFlQPKdP", "Ovi9IPHB7UhgpyeH1doioqEIzyuxOGQ80HsINpXp");
/*security
get a new key from parse generated and don't check into repo
check for cross site scripting
check validity of input and output from user
*/

/*voting
then permanently update css to reflect vote
update css when logged out. (no yellow meeples)
fix alert message after logged out while trying to vote.

be able to undo votes
update the vote table again
update game total in database
update remainVotes for user

update status meeples
when user votes 
set currentUser status to going
update user list to turn status meeple green

when user logs in and votesRemaining === 5 
set currentUser status to busy
update status meeple red in user list

autoreset:
votes to 5
games to 0
status to unknown
*/

/*learn what the heck makes the meeples work!!!*/

/*improvements:

flicker when user creates new account and gamer list updates
- could add fade in fade out css
- could make it so just the new user is added

Allow users to move the dialog boxes around
- use onmousedown, onmousemove, onmouseup events to update x,y of box
- use jquery drag or equivalent function
*/

//DEBUG flag
var debug = true;

var currentUser = null;

window.onload = function() {
  if(debug){console.log("onload");}
  populateUserList();
  populateGameVotes();
  eventHandlers();
}; 

var eventHandlers = function() {
  if(debug){console.log("eventHandlers");}

  //iterate through meeple voting buttons in game table
  for(var count = 0; count < document.getElementsByClassName('gamevote').length; count++){

      //setup onclick event handlers for each meeple voting button in game table
      document.getElementsByClassName('gamevote')[count].onclick = function() {

        //when voting meeple clicked get the number of votes user selected
        //TODO: see if you can remove 'gamevote' class altogether and get value of the meeple without spitting the classname
        var voteNumber = this.className.split(" ")[1].split("-")[1];
        //get the row of the game voted on by traversing up the DOM of the parent nodes of meeple clicked
        var gameNode = this.parentNode.parentNode.parentNode;
        //save away the current list item clicked
        var meepleClicked = this;
        
        //if user is logged in continue, else ask them to log in
        if(currentUser){

          //get votes user has remaining from database
          var votesRemaining = currentUser.get("votesRemaining");
          //calculate how many meeples user would have left after vote
          var meeplesAfterVote = votesRemaining - voteNumber; 

          //user will vote on game with a value 1-5 meeples
          //before saving vote see if user has enough votes left
          //if votes remaining is valid continue else alert user
          if(meeplesAfterVote >= 0){

            if(debug){console.log("You voted "+voteNumber+" on the game "+ gameNode.id + ". " + "You have " + meeplesAfterVote + " meeples left.");}

            //create game object
            var Games = Parse.Object.extend("Games");
            //create vote object
            var Votes = Parse.Object.extend("Votes");
            //create query on game objects
            var query = new Parse.Query(Games);

            //find game object matching the id of the row that was clicked in the game table
            query.get(gameNode.id, {
              //if successful
              success: function(games) {

                //get previousVotes for this game from database
                var previousVote = games.get("vote");
                //if previousVote is undefined set to 0
                if(!previousVote){previousVote=0;}
                //alert user what they voted and thank them if they used all their votes
                if(meeplesAfterVote != 0){
                  alert("You voted "+voteNumber+" on the game " + games.get("game") + ". " + "You have " + meeplesAfterVote + " meeple(s) left.");
                }else{
                  alert("You voted "+voteNumber+" on the game " + games.get("game") + ". " + "You have " + meeplesAfterVote + " meeples left. Thanks for voting, see you at Game Night!");
                }

                //creating game object
                var gameObject = new Games();
                //saving new vote total for that game
                gameObject.save({objectId: gameNode.id, vote: previousVote + parseInt(voteNumber)});
                //updating the game table with the new total
                gameNode.getElementsByClassName('votes')[0].innerHTML = previousVote + parseInt(voteNumber);

                //save vote
                var voteObject = new Votes();
                var gameNumber = "Game"+games.get("gameOrder");
                var relation = voteObject.relation("Voters");
                relation.add(currentUser);
                voteObject.set(gameNumber, voteNumber);
                voteObject.save();

                //update votesRemaining for the currentUser
                currentUser.set("votesRemaining", meeplesAfterVote);

                //TODO: update what the user voted on user.set("gameVotes", {});
                currentUser.save();
                console.log(meepleClicked);
                meepleClicked.className += " selected";
              },
              error: function(object, error) {
                console.log(error);
              }
            });
          } else {
            alert("You only have enough meeples left to vote " + votesRemaining + " on this game. Otherwise, you will have to remove "+ (voteNumber-votesRemaining) +" meeple(s) from other games to vote "+ voteNumber +" on this game.")
          }
        } else {
          alert("You need to login before you can vote!");
        }
      };
    }
};

// use cloud code or delete from here
var votingReset = function () {
  if(debug){console.log("votingReset");}
  //get list of users
  //cycle over the length of the array
  //set votesRemaining to 5 for all users
  var query = new Parse.Query(Parse.User);
  query.find({
      success: function(users) {
        for( var i=0; i < users.length; i++ ){
          users[i].set('votesRemaining', 5);
          users[i].save();
        }
      }
  });
};

var populateGameVotes = function() {
  if(debug){console.log("populateGameVotes");}
  var Games = Parse.Object.extend("Games");
  var query = new Parse.Query(Games);
  query.ascending("gameOrder");
  query.find({
    success: function(games) {
      for( var i=0; i < games.length; i++ ){
          document.getElementsByClassName('votes')[i].innerHTML = games[i].get("vote");
        //need to only add selected to games voted by that person
        //document.getElementsByClassName('votes')[i].previousSibling.getElementsByClassName("star-"+games[i].get("vote")).className += " selected";
      }
    }
  });
};

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

var showVotingDialog = function() {
  if(debug){console.log("showVotingDialog");}
  document.getElementById("howto_dialog").style.display = "block";
};

var hideVotingDialog = function() {
  if(debug){console.log("hideVotingDialog");}
  document.getElementById("howto_dialog").style.display = "none";
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
    currentUser = "";
		document.getElementById("login_btn_label").innerHTML = "You must login to vote!";
		document.getElementById("login_button").innerHTML = "LogIn";
    document.getElementById("login_button").onclick = showDialog;
    for(var count = 0; count < document.getElementsByClassName('gamevote').length; count++){
      document.getElementsByClassName('gamevote')[count].classList.remove("selected");
    }
};

var toggleDialog = function() {
  if(debug){console.log("toggleDialog");}
	document.getElementById("dialog_title").innerHTML = "Create Account";
	document.getElementById("login_dialog_btn").style.display = "none";
  document.getElementById("email_label").style.display = "inline";
  document.getElementById("txtbox_email").style.display = "inline";
  document.getElementById("create_account").style.display = "none";
  document.getElementById("submit_button").style.display = "inline";
};

var register = function() {
  if(debug){console.log("register");}
	var user = new Parse.User();
	var username = document.getElementById("txtbox_gamer").value;
	user.set("username", username);
	user.set("password", document.getElementById("txtbox_password").value);
	user.set("email", document.getElementById("txtbox_email").value);
  user.set("votesRemaining", 5);
	
	user.signUp(null, {
  		success: function(user) {
        currentUser = Parse.User.current();
  			document.getElementById("login_btn_label").innerHTML = username;
  			document.getElementById("login_button").innerHTML = "Logout";
    		document.getElementById("login_button").onclick = logout;
        resetUserList();
    		hideDialog();
  		},
  		error: function(user, error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});
}

var login = function() {
  if(debug){console.log("login");}
	var username = document.getElementById("txtbox_gamer").value;
	Parse.User.logIn(username, document.getElementById("txtbox_password").value, {
    success: function(user) {
      currentUser = Parse.User.current();
      document.getElementById("login_btn_label").innerHTML = username;
  	  document.getElementById("login_button").innerHTML = "Logout";
      document.getElementById("login_button").onclick = logout;
      hideDialog();
    },
    error: function(user, error) {
   	  alert("Error: " + error.code + " " + error.message);
    }
  });
};



