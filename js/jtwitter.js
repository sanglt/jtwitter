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
    if (username.test(text)) {
      text = text.replace(username, '<a href="http://twitter.com/$2">$1$2</a>');
    }
    return text;
  }	
});