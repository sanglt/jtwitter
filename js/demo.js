jQuery(function ($) {
  $('#getUserTweet').click(function () {
    $('#tweetUserList').userTweet($('#screen_name').val(), $('#screen_limit').val());
  });
});
