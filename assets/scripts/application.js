$(document).ready(function(){
    var $body = $('.tweet-container');
    window.numOfTweetsSeen = 0;
    var newTweetsBox = $('.newTweetsCount');
    var newTweetNumber = newTweetsBox.find(".newTweetNumber");
    var remainingTweets;
    var nameFilter;

    function displayTweets(tweetsAlreadySeen, displayUpToIndex, notInitial) {
    	if(notInitial) { tweetsAlreadySeen += 1; }
    	for(var i = tweetsAlreadySeen; i <= displayUpToIndex; i++) {
	      	var tweet = (nameFilter !== undefined) ? streams.users[nameFilter][i] : streams.home[i];
	      	var $tweet = $('<div></div>');
	      	$tweet.append('<span class="user"> @'+ tweet.user +':</span>')
	      	$tweet.append('<span class="message"> '+ tweet.message +'</span>')
	      	$tweet.append('<p class="date">Posted '+moment(tweet.created_at).fromNow()+'</p>')
	      	$tweet.addClass("tweet");
            $tweet.attr('data-date',tweet.created_at);
	      	$tweet.insertAfter(newTweetsBox);
    	}
    	if(nameFilter === undefined) { 
    		numOfTweetsSeen = displayUpToIndex;
    	}
    }

    function numberOfNewTweets() {
    	return ((streams.home.length - 1) - numOfTweetsSeen);
    }

    function setNewTweetsBox() {
    	if(numberOfNewTweets() > 0 && nameFilter == undefined){
    		if(newTweetsBox.css("display") === "none") {
    			newTweetsBox.show();
    		}
    		newTweetNumber.text(numberOfNewTweets());
    	}
    }

    function displayNewTweets() {
      remainingTweets = +newTweetNumber.text();
      displayTweets(numOfTweetsSeen, numOfTweetsSeen + remainingTweets, true)
      newTweetsBox.slideUp('fast');
    }

    function changeUserTimeline() {
    	nameFilter = ($(this).text()).replace(/[ @:]/g,"");
    	$('.timeline-name').text(nameFilter+"'s");
    	newTweetsBox.hide();
    	$('.tweet').remove();
    	displayTweets(0,streams.users[nameFilter].length-1)
    }

    function writeTweet(message) {
      var tweet = {};
      tweet.user = visitor;
      tweet.message = message;
      tweet.created_at = new Date();
      addTweet(tweet);
    };

    function addTweet(newTweet) {
      var username = newTweet.user;
      streams.users[username].push(newTweet);
      streams.home.push(newTweet);
    };

    function updatePostTime() {
        $('.tweet').each(function(i) {
            $(this).find('.date').text("Posted " + moment($(this).data('date')).fromNow());
        });
    }

    streams.users.visitor = [];
    var visitor = 'visitor';

    // Display initial tweets
    displayTweets(numOfTweetsSeen, streams.home.length - 1);

    // Onclick handler to display new tweets
    $(newTweetsBox).on('click',displayNewTweets);

 	// Event handler to print an individuals timeline
    $body.on('click', '.user', changeUserTimeline);

    // Event handler to return to main "page"
    $('.home-button').on('click', function() {
    	if(nameFilter) { 
    		$('.tweet').remove(); 
	    	nameFilter = undefined;
	    	$('.timeline-name').text("Main");
	    	setNewTweetsBox();
	    	displayTweets(0, numOfTweetsSeen, true);
    	}
    });

    $('.tweet-input').on('click', function() {
        if($('.user-tweet').val() !== "") {
            writeTweet($('.user-tweet').val());
        }
        $('.user-tweet').val("");
        setNewTweetsBox();
        displayNewTweets();
    });

    // Sets page to check for new tweets every 5 seconds
    setInterval( setNewTweetsBox, 5000);
    // Updates date on posts every minute
    setInterval( updatePostTime, 30000);
});