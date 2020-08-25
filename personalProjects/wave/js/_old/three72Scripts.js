<script>
		var isMobile;
		var windowLg = 768;
		var $footerMenuToggles = $('.mega-menu').find('.mega-menu-title');

		$(window).on('resize', function() {
		  // Expand all links on desktop and collapse on mobile
		  if (viewport().width >= windowLg) {
		    isMobile = false;
		    $footerMenuToggles.nextAll().show();
		  } else {
		    isMobile = true;
		    $footerMenuToggles.nextAll().hide();
		  }

		});
		$(window).resize();

		/*
		  Footer links toggle
		*/
		$footerMenuToggles.on('click', function(e) {
		  e.stopPropagation();

		  if (!isMobile) {
		    return false;
		  } else {
		    if ($(this).next().css('display') === 'none') {
		      $(this).addClass('footer-links-visible').nextAll().slideDown('fast');
		    } else {
		      $(this).removeClass('footer-links-visible').nextAll().slideUp('fast');
		    }
		  }

		});

		// Get accurate viewport width
		function viewport() {
		    var e = window, a = 'inner';
		    if (!('innerWidth' in window )) {
		        a = 'client';
		        e = document.documentElement || document.body;
		    }
		    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}
	</script>

	<!-- To Top JS -->

	<script>
	$(document).ready(function(){
	  $('.ScrollTop').click(function() {
	    $('html, body').animate({scrollTop: 0}, 800);
	  return false;
	    });
	});
	</script>

	<!-- Seach Menu -->
	<script>
	// CHANGE HERE
	var $searchForm = $('#block-search-form');

	/*
	  Toggle mobile search.
	*/
	var searchVisibilityToggle = {
	  init: function() {
	    this.cacheDom();
	    this.bindEvents();
	  },
	  cacheDom: function() {
	    // CHANGE HERE
	    this.$toggleBtn = $('#search-block');
	  },
	  bindEvents: function() {
	    this.$toggleBtn.on('click touchstart', this.defineLinkFunction.bind(this));
	  },
	  render: function() {
	    var $that = $searchForm;

	    // ADD CLASS FOR CSS USAGE
	    if ($that.hasClass('search-form-open')) {
	      $that.removeClass('search-form-open');
	      setTimeout(function(){
	        $that.hide();
	      }, 180);
	    } else {
	      $that.show();
	      setTimeout(function(){
	        $that.addClass('search-form-open');
	      }, 10);
	    }
	  },
	  defineLinkFunction: function(e) {
	    e.preventDefault();
	    e.stopPropagation();

	    this.render();
	  }
	};

	searchVisibilityToggle.init();
	</script>



	<!-- Login Menu -->
		<script>
	// CHANGE HERE
	var $loginForm = $('#block-login-form');

	/*
	  Toggle mobile search.
	*/
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
	</script>