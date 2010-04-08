jQuery(function ($){
  /**
   * Class twitterClass
   * @param {Object} options: options user input
   */
  var twitterClass = function () {
    // Default options
    this.options = {
      'screen_name' : 'sanglt',
      'count'       : 5,
      'wrap'        : '<li class="tweetElement" />'
    }
    // twitter callback url
    this.callUrl = {
      'user' : 'http://twitter.com/statuses/user_timeline.json?callback=?',
      'search' : 'http://search.twitter.com/search.json?callback=?'
    }
  }
  
  /**
   * Set options from user input
   * @param {Object} options
   */
  twitterClass.prototype.setOptions = function (options) {
    options && $.extend(this.options, options);
  }
  
  /**
   * parse username from text and replace with link to twitter profile
   * @param {String} text: a text contain username like @username...
   * @return {String} text: a text contain username has been replace with link to twitter profile
   */
  twitterClass.prototype.parseUsername = function (text) {
    var username = /(@)([a-zA-Z0-9_]+)/ig;
    if (username.test (text)) {
      text = text.replace (username, '<a href="http://twitter.com/$2">$1$2</a>');
    }
    return text;
  }
  
  /**
   * Replace link with a link to them.
   * @param {String} text: a text contain link like http://abc...
   * @return {String} text: a text contain link has been replace
   */
  twitterClass.prototype.parseLink = function (text) {
    var link = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ig;
    if (link.test (text)) {
      text = text.replace (link, '<a href="$1://$2$3$4$5$6">$1://$2$3$4$5$6</a>');
    }
    return text;
  }
  
  /**
   * Replace hashtag to twitter search page
   * @param {String} text: a text contain hastag link #fb #trending...
   * @return {String} text: a text contain link to twitter search page
   */
  twitterClass.prototype.parseHashTag = function (text) {
    var hashtag = /(\#)([a-zA-Z0-9_\.-]+)/ig;
    if (hashtag.test (text)) {
      text = text.replace (hashtag, '<a href="http://twitter.com/search?q=%23$2">$1$2</a>');
    }
    return text;
  }
  
  twitterClass.prototype.parseToHTML  = function (text) {
    var replace = { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };
    for (var character in replace) {
      var regex = new RegExp(replace[character], 'g');
      text = text.replace(regex, character);
    }
    return text;
  }
  
  /**
   * Parse time from tweet string to human readable.
   * @param {String} timeValue: time from tweet receive
   * @return {String} : A human read time.
   */
  twitterClass.prototype.parseTime = function (timeValue) {
    var j = new Date();
    var f = new Date(timeValue);
    if ($.browser.msie) {
        f = Date.parse(h.replace(/( \+)/, " UTC$1"))
    }
    var i = j - f;
    var c = 1000, d = c * 60, e = d * 60, g = e * 24, b = g * 7;
    if (isNaN(i) || i < 0) {
        return ""
    }
    if (i < c * 7) {
        return "right now"
    }
    if (i < d) {
        return Math.floor(i / c) + " seconds ago"
    }
    if (i < d * 2) {
        return "about 1 minute ago"
    }
    if (i < e) {
        return Math.floor(i / d) + " minutes ago"
    }
    if (i < e * 2) {
        return "about 1 hour ago"
    }
    if (i < g) {
        return Math.floor(i / e) + " hours ago"
    }
    if (i > g && i < g * 2) {
        return "yesterday"
    }
    if (i < g * 365) {
        return Math.floor(i / g) + " days ago"
    }
    else {
        return "over a year ago"
    }
  }
  
  twitterClass.prototype.parseTweet = function (parentElement, data) {
    var self = this;
    $.each(data.results, function (index, tweet) {
      //console.log(tweet);
      tweet.text = self.parseLink(tweet.text)
      tweet.text = self.parseUsername(tweet.text)
      tweet.text = self.parseHashTag(tweet.text);
      var linkTweet  = '<a href="http://twitter.com/' + tweet.from_user + '/status/' + tweet.id + '">'+ self.parseTime(tweet.created_at) + '</a>';
      var linkReply = '';
      if (tweet.to_user_id !== null && tweet.to_user !== null && tweet.in_reply_to_status_id !== null) {
        linkReply = ' <a href="http://twitter.com/' + tweet.to_user + '">in reply to ' + tweet.to_user + ' </a>';
      }
      var tweetHTML = tweet.text + '<br />' + linkTweet + ' from ' + self.parseToHTML(tweet.source) + linkReply;
      $(self.options.wrap).html(tweetHTML).appendTo(parentElement);
    });
  }
  
  
  /**
   * Get user tweet
   * @param {Object} element
   * @return {Object} element, for jQuery continue use. Like that: $('#list').userTweet().css()....
   */
  twitterClass.prototype.getUserTweet = function (element) {
    // Check options
    var options = this.options;
    // Cache this object
    var self = this;
    $.getJSON(self.callUrl.search, { 'q': 'from:' + options.screen_name, 'rpp': options.count}, function (data) {
      self.parseTweet(element, data);
    });
    // For jQuery continue use
    return element;
  }
  
  
  
  // Extend $.fn
  $.extend($.fn, {
    // get user tweet
    'userTweet': function () {
      // Create twitter client object
      var twitterClient = new twitterClass();
      // Get user input options
      var options = {};
      if (arguments[0] !== undefined) options.screen_name = arguments[0];
      if (arguments[1] !== undefined) options.count = arguments[1];
      // Set options
      twitterClient.setOptions(options);
      // Get tweet of user
      this.html('');
      return twitterClient.getUserTweet(this); 
    },
  });
});
