var $loginForm = $('#block-login-form');
// Toogle Mobile Login
var loginVisibilityToggle = {
	init: function() {
	  this.cacheDom();
	  this.bindEvents();
	},
	cacheDom: function() {
	  // CHANGE HERE
	  this.$toggleLoginBtn = $('#login-block');
	},
	bindEvents: function() {
	  this.$toggleLoginBtn.on('click touchstart', this.defineLinkFunction.bind(this));
	},
	render: function() {
	  var $that = $loginForm;
	  // ADD CLASS FOR CSS USAGE
	  if ($that.hasClass('login-form-open')) {
	    $that.removeClass('login-form-open');
	    setTimeout(function(){
	      $that.hide();
	    }, 180);
	  } else {
	    $that.show();
	    setTimeout(function(){
	      $that.addClass('login-form-open');
	    }, 10);
	  }
	},
	defineLinkFunction: function(e) {
	  e.preventDefault();
	  e.stopPropagation();
    this.render();
  }
};
loginVisibilityToggle.init();