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