$('document').ready(function() {

  //function that creates a dynamic tweet for the single tweet object
  function createTweetElement(tweetObj) {
    let $tweet = $('<article>').addClass('tweet');

    // adding child elements <header>, <p>, and <footer>
    let $header = $('<header>').addClass('tweet-header');
    let $para = $('<p>').addClass('tweetslist');
    let $footer = $('<footer>');

    $tweet.append($header);
    $tweet.append($para);
    $tweet.append($footer);

    //adding child elements to <header>
    //let $iLogo = $('<i>').addClass('far fa-smile');

    let $iLogo = $('<img>');
    $iLogo.attr("src", tweetObj.user.avatars.small);
    $iLogo.attr("align", "top");
    let $label = $('<label>');
    $label.text(tweetObj["user"]["name"]);
    let $span = $('<span>').addClass('tweetid').text(tweetObj["user"]["handle"]);

    $header.append($iLogo);
    $header.append($label);
    $header.append($span);

    //adding value to <p> (value is tweet text)
    $para.text(tweetObj.content.text);

    //adding children to <footer>
    let todayDate = new Date(); //.getDate();
    let createdDate = new Date(tweetObj.created_at); //.getDate();
    let dt = todayDate.getTime() - createdDate; //in milliseconds

    dt = Math.floor(dt / (1000 * 60 * 60 * 24));

    if(dt < 0) {
      dt = 0;
    }

    //let dt = todayDate - createdDate;
    //let dt = new Date().getDate() - new Date(tweetObj.created_at).getDate();
    $footer.text(dt + " days ago");

    let $spanFooter = $('<span>').addClass("tweetstats");
    $footer.append($spanFooter);

    //adding children to <span> within a footer
    let $iFlag = $('<i>').addClass("fas fa-flag");
    let $iRetweet = $('<i>').addClass("fas fa-retweet");
    let $iLovetweet = $('<i>').addClass("fas fa-heart");

    $spanFooter.append($iFlag);
    $spanFooter.append($iRetweet);
    $spanFooter.append($iLovetweet);

    return $tweet;
  }


  //function that renders the dynamic tweets on html page for array of tweets object passed to it
  function renderTweets(tweets) {
    //loops through tweets
    //calls createTweetElement for each tweet
    //takes return value and prepend it to the tweets container
    for(let tweetObj of tweets) {
      let $tweet = createTweetElement(tweetObj);
      $('#realtweets').prepend($tweet);
    }
  }


  //Event handler when user submits new tweet
  $('#tweetform').on('submit', (event) => {
    event.preventDefault();

    if(validateTweetForm()) {
      $.ajax({
        url: '/tweets',
        type: 'POST',
        data: $("form#tweetform").serialize(),
        success: function( datareceived, status, jQxhr ){
          //calling helper function that renders most recently added tweet
          loadMostRecentTweet();

          $("#tweetform #counter").text("140");
          $("#text").val("");
          $("#text").focus();
        }
      });
    } else {
      $('#text').focus();
    }
  });


  //function that renders most recently added tweet by the user
  function loadMostRecentTweet() {
    $.ajax({
        url: '/tweets',
        type: 'GET',
        success: function( tweetsReceived){
          let len = tweetsReceived.length;
          let $tweet = createTweetElement(tweetsReceived[len-1]);
          $('#realtweets').prepend($tweet);
        }
    });
  }

  //Helper function that loads all tweets fetched from the server
  function loadTweets() {
    $.ajax({
        url: '/tweets',
        type: 'GET',
        success: function( tweetsReceived){
          renderTweets(tweetsReceived);
        }
    });
  }

  //function that validates the tweet entered by the user (not empty nor over 140 chars)
  function validateTweetForm() {
    let result = true;
    let tweetText = $("#text").val();
    let $li = "";

    $('#errList').html("");

    if(tweetText == null || tweetText.trim() == "") {
      $li = ('<li>No tweet!...Tweet please!</li>');

      $("#errList").append($li);
      result = false;
    }


    if(tweetText.length > 140) {
      $li = ('<li>Tweet limit is 140 characters only!</li>');
      $("#errList").append($li);
      result = false;
    }

    return result;
  }

  //fetching and rendering all tweets when the page is loaded for the first time
  loadTweets();
});   //ready() ends here