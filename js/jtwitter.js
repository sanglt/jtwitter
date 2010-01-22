jQuery(function ($){
  /**
   * Class twitterClass
   * @param {Object} options: options user input
   */
  var twitterClass = function (options) {
    // Store tweet receive
    this.statuses = [];
    // Default options
    this.options = {
      'screen_name' : '',
      'count'       : 5
    }
    // Extends options
    options && $.extend(this.options, options);
    // twitter callback url
    this.callUrl = {
      'user' : 'http://twitter.com/statuses/user_timeline.json'
    }
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
  }
  
  /**
   * Parse time from tweet string to human readable.
   * @param {String} timeValue: time from tweet receive
   * @return {String} : A human read time.
   */
  twitterClass.prototype.parseTime = function (timeValue) {
    var values = timeValue.split (" ");
    timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse (timeValue);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt ((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    if (delta < 60) {
      return 'less than a minute ago';
    } else if(delta < 120) {
      return 'about a minute ago';
    } else if(delta < (60*60)) {
      return  (parseInt (delta / 60)).toString() + ' minutes ago';
    } else if(delta < (120*60)) {
      return 'about an hour ago';
    } else if(delta < (24*60*60)) {
      return 'about ' + (parseInt (delta / 3600)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
      return '1 day ago';
    } else {
      return (parseInt (delta / 86400)).toString() + ' days ago';
    }
  }
});