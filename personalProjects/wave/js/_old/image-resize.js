(function($) {
    $.fn.resizeToCover = function () {
      this.each(function() {
        if($(this).is('img')) {
          var viewport = $(this).parent();
          var img = $(this);
          var org_img = new Image();
          org_img.src = img.attr("src");
          var image_original_width = org_img.width;
          var image_original_height = org_img.height;
          var scale_hoz = viewport.width()/image_original_width;
          var scale_ver = viewport.height()/image_original_height;
          var scale = scale_hoz > scale_ver ? scale_hoz : scale_ver;
          img.width(scale*image_original_width);
          img.height(scale*image_original_height);
          var scrollleft = (img.width()-viewport.width())/2;
          var scrolltop = (img.height()-viewport.height())/2;
          img.css({
            position: 'relative',
            top: -scrolltop,
            left: -scrollleft
          });
        }
      });
    }
})(jQuery);