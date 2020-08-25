// Thanks to Krilnon at Kirupa.com (Kyle Murray) for a lot of this
        var lightspeed = 299792 // km/s
		 var _1km = 3474.8
        var unit = 'km'
		 var delimeter = ','
		 var decimalmark = '.'
		 var unitname = 'km'
    var currentRAFID = 0 // from requestAnimationFrame
		 var isSpeeding = 0
        var unitTable = {
            km: 1,
            mi: 0.621371,
            au: 6.68458712e-9,
			 lightminutes: 0.0000000555941,
			 earths: 0.0000785238,
            buses: 79.36,
			 bluewhales:33.3333,
			 greatwalls: 0.00011297137305,
            pixels: 0.0002877863474156786
        }
		var msgTimer
		var msgNum = [ $('#msg1'), $('#msg2'), $('#msg3'), $('#msg4'), $('#msg5')]
		var msgIndex = 0
		var startX = window.pageXOffset

//Scroll horizontally with scrollwheel but use default for horizontal swipe on trackpads
// $(document).ready(function() {
//     $('html, body').mousewheel(function(e, delta) {
// 		if( Math.abs(e.deltaX) ) {
//         return
//     } else {
//         this.scrollLeft -= (e.deltaY * 15);
//     }
//         e.preventDefault();
//     });
// });

$(function() {
  // performance.now polyfill for Safari (used for lightspeed calculation)
  if (typeof window.performance === 'undefined') {
      window.performance = {};
  }
  if (!window.performance.now){
    var nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }
    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }
// CHECK THIS TO MAKE IT GO UP AND DOWN

//SHORTCUTS	
    // handles easing to any planet based on their symbolic buttons up top
    

// handles easing to next place of interest via < > buttons
	//get the coordinates of all essay chunks and put them into an array
	//don't forget planets
	var planetMarks = [
		$('#suntxt').offset().left - 200,
		$('#merctxt').offset().left - 200,
		$('#venustxt').offset().left - 200,
		$('#earthtxt').offset().left - 200,
		$('#marstxt').offset().left - 200,
		$('#jupitertxt').offset().left - 200,
		$('#saturntxt').offset().left - 200,
		$('#neptunetxt').offset().left - 200,
		$('#uranustxt').offset().left - 200,
		$('#plutotxt').offset().left - 200,
	];
	//Attach it to the next button
    $('ul.nav a.nextjump').bind('click',function(event){
		cancelLightMsg()
		stopSpeeding();
		var currentDist = (window.pageXOffset );
		//find the next destination
    	$.each(destinations, function(index, value){
			if(currentDist >= value-100) { 
				destinationNext = destinations[index + 1];	
				 }
				else {
				return false
				}
		});
		//scroll there
        $('html, body').stop().animate({
            scrollLeft: destinationNext
        }, 4500,'easeInOutQuad');
        event.preventDefault();
    })
	//Attach it to the prev button
    $('ul.nav a.prevjump').bind('click',function(event){
		cancelLightMsg()
		stopSpeeding();
		var currentDist = (window.pageXOffset );
		//find the prev destination
    	$.each(destinations, function(index, value){
			if(currentDist <= value+100) { 
				destinationNext = destinations[index-1];	
				return false
				}
		});
		//scroll there
        $('html, body').stop().animate({
            scrollLeft: destinationNext
        }, 4500,'easeInOutQuad');
        event.preventDefault();
    })

//CHANGE UNITS
    // show/hide the units dropdown (dropup, really)
    $('#distance-counter').on('click', function(e){
        var $units = $('#unitselect')
        $units.css('display', $units.css('display') == 'none' ? 'block' : 'none')
    })

    // clicking on one of the units changes what the distance counter uses
    $('#unitselect li').on('click', function(e){ 
		 unit = $(e.target).attr('id')
		 unitname = $(e.target).text()
        updateDistance()
        $('#unitselect').css('display', 'none')
        return false
    })
	
//LIGHTSPEED
    // toggles lightspeed on and off
    $('#lightspeeder a').on('click', function(e){
		stopSpeeding()
		if(isSpeeding == 1) {
			cancelLightMsg()
			stopSpeeding()
			isSpeeding = 0
			return false
        	}
		else {
			isSpeeding = 1
			fadeInLightMsg()
			changeUnitToLight()
			$('#lightspeeder a').css('opacity', 1.0)
			$('#lightspeedmsg').css('display', 'block')
       		currentRAFID = startSpeedingAt()
			return false
		}
    })
}); // end big function

// scroll automatically at the speed of light
function startSpeedingAt(){
    stopSpeeding()
    var startX = window.pageXOffset
	var lastTime = window.performance.now() 
    var onEnterFrame = function(now){
		var timeDelta = now - lastTime // milliseconds
       var distance = (lightspeed * timeDelta) / (_1km * 1000)
		//var distance = (lightspeed * multipleOfLightspeed * now) / (_1km * 1000)
        $('html, body').scrollLeft(startX + distance)
        currentRAFID = requestAnimationFrame(onEnterFrame)
    }
    return requestAnimationFrame(onEnterFrame)
}

function changeUnitToLight() {
	unit = 'lightminutes'
	unitname = $('#lightminutes').text()
    updateDistance()
};


function updateDistance(){
  var px = (window.pageYOffset - $('#bigspace').position().top + $(window).height() / 2);
  var km = px * _1km;
  var distance = km * unitTable[unit];
  $('#counter').text(Math.max(0, distance.toFixed(1)).toString().replace(".", decimalmark).replace(/\B(?=(\d{3})+(?!\d))/g, delimeter) + ' ' + $('#' + unit).text());
}
// Elegant distance counter
//  function updateDistance(){
//     var px = (window.scrollY - $('#bigspace').position().left + $(window).width() / 2)
//     var km = px * _1km
//     var distance = km * unitTable[unit]
//     $('#counter').text(Math.max(0, distance.toFixed(1)).toString().replace(".", decimalmark).replace(/\B(?=(\d{3})+(?!\d))/g, delimeter) + ' ' + unitname)
	
// } 

// stops the current rAF cycle for autoscrolling
// called by startSpeedingAt, but could be elsewhere too, if desired
function stopSpeeding(){ 
    cancelAnimationFrame(currentRAFID);
}

//calculate the number of screens to show the whole map
$('#monitors').text(Math.floor($('#bigspace').width() / screen.availWidth / window.devicePixelRatio));

$(window).scroll(updateDistance);




 