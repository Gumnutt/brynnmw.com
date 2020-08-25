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