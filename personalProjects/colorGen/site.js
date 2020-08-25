$(window).load(function(){

    /* For quick copy-paste */
    $('input').focus(function(){this.select();});

    /* Change color on every key input. */
    $('#hex').bind('blur keydown', function (event) {
        var el = this;
        setTimeout(function () {
            var rgb = [],
                $input = $(el),
                fail = false,
                original = $input.val(),
            
            hex = (original+'').replace(/#/, '');
            
            if (original.length === 1 && original !== '#') { $input.val('#' + original); }
            if (hex.length == 3) hex = hex + hex;

            for (var i = 0; i < 6; i+=2) {
               rgb.push(parseInt(hex.substr(i,2),16));
               fail = fail || rgb[rgb.length - 1].toString() === 'NaN';
            }

            $('#rgb').val(fail ? '' : 'rgb(' + rgb.join(',') + ')');
            $('#hsl').val(fail ? '' : 'hsl(' + rgbToHsl.apply(null, rgb).join(',') + ')');
               
            $('body').css('backgroundColor', $('#rgb').val());
        }, 13);
    });

    /* Function to convert rgb-to-hsl. */
    
    function rgbToHsl(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) { h = s = 0; } 
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return [(h*100+0.5)|0, ((s*100+0.5)|0) + '%', ((l*100+0.5)|0) + '%'];
    }
});


$(document).ready(function() {
 
    if ( !("placeholder" in document.createElement("input")) ) {
        $("input[placeholder], textarea[placeholder]").each(function() {
            var val = $(this).attr("placeholder");
            if ( this.value == "" ) {
                this.value = val;
            }
            $(this).focus(function() {
                if ( this.value == val ) {
                    this.value = "";
                }
            }).blur(function() {
                if ( $.trim(this.value) == "" ) {
                    this.value = val;
                }
            })
        });
 
        // Clear default placeholder values on form submit
        $('form').submit(function() {
            $(this).find("input[placeholder], textarea[placeholder]").each(function() {
                if ( this.value == $(this).attr("placeholder") ) {
                    this.value = "";
                }
            });
        });
    }
});