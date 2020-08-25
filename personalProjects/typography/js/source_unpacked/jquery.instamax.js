//Instamax 4.0 - http://www.codehandling.com/2015/04/instamax-20-embed-complete-instagram.html

var instamaxLoggedInUser = {};
var instamaxRefreshTimer;
var instamaxReloadCount = 1;

(function ($) {

	//get photos of any user using instagram API
	var getUserPhotos = function ($instamaxContainer,nextPageUrl) {
		//console.log('inside getUserPhotos');
		var loadMoreFlag = false;
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');

		if(null!=nextPageUrl && nextPageUrl!="") {
			apiUserPhotosURL = nextPageUrl;
			loadMoreFlag = true;		
		} else {
			apiUserPhotosURL = "https://api.instagram.com/v1/users/"+instamax_global_options.userId+"/media/recent?count="+instamax_global_options.maxResults+"&access_token="+instamax_global_options.accessToken;
		}
		
		//console.log('getUserPhotos apiUserPhotosURL-'+apiUserPhotosURL);
		
		$.ajax({
			url: apiUserPhotosURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertUserPhotos(response,loadMoreFlag,$instamaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	

	//get photos of any user using instagram API
	getUserPhotosBasedOnTags = function (tabId,$instamaxContainer,nextPageUrl) {
		//console.log('inside getUserPhotos');
		var loadMoreFlag = false;
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		
		if(null!=nextPageUrl && nextPageUrl!="") {
			apiUserPhotosURL = nextPageUrl;
			loadMoreFlag = true;		
		} else {
			apiUserPhotosURL = "https://api.instagram.com/v1/users/"+instamax_global_options.userId+"/media/recent?count=100&access_token="+instamax_global_options.accessToken;
		}
		
		var hashTag = tabId.substring(tabId.indexOf('_')+1);
		hashTag = hashTag.replace(/\s*/g,'');		
		
		//console.log('getUserPhotos apiUserPhotosURL-'+apiUserPhotosURL);
		
		$.ajax({
			url: apiUserPhotosURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertUserPhotos(response,loadMoreFlag,$instamaxContainer,hashTag);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},	

	//get comments of any photo using instagram API
	getPhotoComments = function ($instamaxContainer,mediaId,loadMoreFlag) {
		//console.log('inside getPhotoComments');
		//var loadMoreFlag = false;
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		
		//$instamaxContainer.find("."+mediaId)
		mediaElementComments = $instamaxContainer.find("#"+mediaId).data("comments");
		if(null!=mediaElementComments && mediaElementComments!="") {
			//console.log("found saved comments");
			insertPhotoComments(mediaElementComments,mediaId,loadMoreFlag,$instamaxContainer);
			return;
		}

		/*if(null!=nextPageUrl && nextPageUrl!="") {
			apiPhotoCommentsURL = nextPageUrl;
			loadMoreFlag = true;		
		} else {
		}*/
		
		apiPhotoCommentsURL = "https://api.instagram.com/v1/media/"+mediaId+"/comments?count="+instamax_global_options.maxResults+"&access_token="+instamax_global_options.accessToken;

		//console.log("getting new comments");
		//console.log('getPhotoComments apiPhotoCommentsURL-'+apiPhotoCommentsURL);
		
		$.ajax({
			url: apiPhotoCommentsURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertPhotoComments(response,mediaId,loadMoreFlag,$instamaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},

	insertPhotoComments = function(response,mediaId,loadMoreFlag,$instamaxContainer) {
		//console.log("insertPhotoComments");
		//console.log(response);		
		
		//save comments in media element
		$instamaxContainer.find("#"+mediaId).data("comments",response);
		
		var commentArray = response.data;
		var $instamaxCommentHolder = $instamaxContainer.find('#instamax-encloser-comments');
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		
		var $instamaxMoreCommentsButton = $instamaxContainer.find("#instamax-load-more-comments");
		var start_index = $instamaxMoreCommentsButton.data("startindex");
		if(loadMoreFlag && null!=start_index && start_index!="") {
			start_index = parseInt(start_index,10);
			if(start_index >= commentArray.length) {
				//console.log("all done");
				$instamaxMoreCommentsButton.text("All Done");
				return;
			}
		} else {
			start_index = 0;
			//clear comment area
			$instamaxCommentHolder.empty();
		}
		var end_index = start_index + instamax_global_options.maxComments;
		
		if(end_index > commentArray.length) {
			end_index=commentArray.length;
		}
		
		$instamaxMoreCommentsButton.data("startindex",end_index);
		//console.log(start_index+":"+end_index+":"+commentArray.length);
		
		for(var i=start_index; i<end_index; i++) {
			comment = commentArray[i].text;
			commentPublished = commentArray[i].created_time;
			authorFullname = commentArray[i].from.full_name;
			authorUsername = commentArray[i].from.username;
			authorLink = "https://instagram.com/"+authorUsername;
			authorImage = commentArray[i].from.profile_picture;
			
			//console.log("commentPublished-"+commentPublished);

			$instamaxCommentHolder.append('<div  class="instamax-video-comment"><div class="instamax-from"><a target="_blank" href="'+authorLink+'"><div class="instamax-from-img" style="background-image:url(\''+authorImage+'\');"></div></a><div class="instamax-from-name">'+authorFullname+'</div><div class="instamax-published">'+getDateDiff(commentPublished)+' </div></div><div class="instamax-comment"><span class="instamax-comment-content">'+comment+'</span><div></div>');

		}
		
		
		resetLoadMoreComments($instamaxContainer);
		
	
	},
	
	loadMoreComments = function($instamaxContainer) {
	
		var $instamaxMoreButton = $instamaxContainer.find("#instamax-load-more-comments");
		$instamaxMoreButton.addClass('instamax-load-more-comments-clicked');
		$instamaxMoreButton.text('loading...');

		mediaId = $instamaxContainer.find("#instamax-load-more-comments").data("mediaid");
		getPhotoComments($instamaxContainer,mediaId,true);		
		
	},	
	
	resetLoadMoreComments = function($instamaxContainer) {
		var $instamaxMoreButton = $instamaxContainer.find("#instamax-load-more-comments");
		$instamaxMoreButton.removeClass('youmax-load-more-comments-clicked');
		$instamaxMoreButton.text('Load More');
	},
	
	//get photos of any hashtag using instagram API
	getTagPhotos = function (tabId,$instamaxContainer,nextPageUrl) {
		//console.log('inside getTagPhotos');
		var loadMoreFlag = false;
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');

		var hashTag = tabId.substring(tabId.indexOf('_')+1);
		hashTag = hashTag.replace(/\s*/g,'');
		
		if(null!=nextPageUrl && nextPageUrl!="") {
			apiUserPhotosURL = nextPageUrl;
			loadMoreFlag = true;		
		} else {
			apiUserPhotosURL = "https://api.instagram.com/v1/tags/"+hashTag+"/media/recent?count="+instamax_global_options.maxResults+"&access_token="+instamax_global_options.accessToken;
		}
		
		//console.log('getTagPhotos apiUserPhotosURL-'+apiUserPhotosURL);
		
		$.ajax({
			url: apiUserPhotosURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertUserPhotos(response,loadMoreFlag,$instamaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	

	
	//display Instagram Follow button
	renderSubscribeButton = function() {
	
		$.ajaxSetup({
		  cache: true
		});
		
		$.getScript("")
		.done(function( script, textStatus ) {
			//alert( textStatus );
		})
		.fail(function( jqxhr, settings, exception ) {
			//alert( "Triggered ajaxError handler." );
		});
		

		
	},
	
	//initialize youamx - add necessary HTML code
	initInstamax = function($instamaxContainer) {
	
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		
		//Empty the container - ajax compatibility
		$instamaxContainer.empty();
		
		//header
		$instamaxContainer.append('<div id="instamax-header"><div id="instamax-header-wrapper"></div></div>');
		
		//tabs
		$instamaxContainer.append('<div id="instamax-tabs"></div>');
				
		//select
		$instamaxContainer.append('<div id="instamax-select-box"><select id="instamax-select"></select></div>');		
		
		//showing search xxxx
		$instamaxContainer.append('<div id="instamax-showing-title"></div>');
		
		//list
		$instamaxContainer.append('<div id="instamax-photo-list-div"><ul id="tiles"></ul></div>');
		
		//load more
		$instamaxContainer.append('<button id="instamax-load-more-div">Load More</button>');
		$instamaxLoadMoreDiv = $instamaxContainer.find('#instamax-load-more-div');
		
		$instamaxLoadMoreDiv.data('nextpagetoken','');
		
		$instamaxLoadMoreDiv.on('click',function(){
			loadMorePhotos($instamaxContainer);
			return false;
		});
		
		$instamaxContainer.find('#instamax-tabs').on('click','.instamax-tab',function() {
			$instamaxContainer.find('#instamax-load-more-div').removeAttr('disabled');
			displayPhotos(this.id,$instamaxContainer);
		});
		
		$instamaxContainer.find('#instamax-select').change(function() {
			var tabId = $(this).find(":selected").val();
			displayPhotos(tabId,$instamaxContainer);
		});
		
		if(instamax_global_options.alwaysUseDropdown) {
			//console.log('options.alwaysUseDropdown-'+options.alwaysUseDropdown);	
			$instamaxContainer.find('#instamax-select-box').css('display','block');
			//$instamaxContainer.find('#instamax-select-box').show();
			$instamaxContainer.find('#instamax-tabs').hide();
		}
		
		//added in 3.0 
		$instamaxContainer.on('keyup','#instamax-search-box', function (e) {
			if (e.keyCode == 13) {
				searchText = "query_" + $(this).val();
				displayPhotos(searchText,$instamaxContainer);
			}
		});

		//added in 4.0
		$instamaxContainer.on('click','#instamax-load-more-comments',function(){
			loadMoreComments($instamaxContainer);
		});
		
		if(instamax_global_options.skin=="clean") {
			$instamaxContainer.on('mouseenter','#tiles li',function(){
				$(this).find(".instamax-duration").show();
				$(this).find(".instamax-definition").show();
			});

			$instamaxContainer.on('mouseleave','#tiles li',function(){
				$(this).find(".instamax-duration").hide();
				$(this).find(".instamax-definition").hide();
			});
		}

		
	},
	
	//load more button functionality
	loadMorePhotos = function($instamaxContainer) {
		var $instamaxLoadMoreDiv = $instamaxContainer.find('#instamax-load-more-div');
		$instamaxLoadMoreDiv.text('Loading...');
		$instamaxLoadMoreDiv.addClass('instamax-load-more-div-click');
		var tabId = $instamaxContainer.find('.instamax-tab.instamax-tab-hover').attr('id');
		var nextPageUrl = $instamaxLoadMoreDiv.data('nextpageurl');
		//console.log('load more clicked : nextStartIndex-'+nextStartIndex);		
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		if(null!=nextPageUrl && nextPageUrl!="") {
			if(tabId.indexOf("photos")!=-1) {
				getUserPhotos($instamaxContainer,nextPageUrl);
			} else if(tabId.indexOf("hashtag_")!=-1) {
				if(instamax_global_options.tagScope=="user") {
					getUserPhotosBasedOnTags(tabId,$instamaxContainer,nextPageUrl);
				} else {
					getTagPhotos(tabId,$instamaxContainer,nextPageUrl);
				}
			} else if(tabId.indexOf("query_")!=-1) {
				if(instamax_global_options.searchScope=="user") {
					getUserPhotosBasedOnTags(tabId,$instamaxContainer,nextPageUrl);
				} else {
					getTagPhotos(tabId,$instamaxContainer,nextPageUrl);
				}
			}
		} else {
			$instamaxLoadMoreDiv.text('ALL DONE');
		}
	},
	
	//gets user Id using Instagram API
	getUserId = function ($instamaxContainer) {
		//console.log('inside getUserDetails');
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		//console.log(instamax_global_options);
		apiUrl = "https://api.instagram.com/v1/users/search?q="+instamax_global_options.userName+"&access_token="+instamax_global_options.accessToken+"&count=1";
		//console.log('getUserId apiUrl-'+apiUrl);
		//showLoader();
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { saveUserId(response,$instamaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},

	saveUserId = function (response,$instamaxContainer) {
		//console.log(response);
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		instamax_global_options.userName = response.data[0].username;
		instamax_global_options.userId = response.data[0].id;
		getUserDetailsForHeader($instamaxContainer);
		
		//get hashtag details
		var hashTagArray = [];

		if($.isArray(instamax_global_options.hashtag)) {
			for(var i=0; i<instamax_global_options.hashtag.length; i++) {
				hashTag = instamax_global_options.hashtag[i].replace(/#/g,'');
				//console.log('hashTag-'+hashTag);
				hashTagArray.push(hashTag);
			}
		}
		
		displayTabs(hashTagArray,$instamaxContainer);
		
	},

	//gets user details using Instagram API
	getUserDetailsForHeader = function ($instamaxContainer) {
		//console.log('inside getUserDetails');
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		//console.log(instamax_global_options);
		apiUrl = "https://api.instagram.com/v1/users/"+instamax_global_options.userId+"?access_token="+instamax_global_options.accessToken+"&count=1";
		//console.log('apiUrl-'+apiUrl);
		//showLoader();
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { displayUserHeader(response,$instamaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	
	setHeader = function (xhr) {
		if(xhr && xhr.overrideMimeType) {
			xhr.overrideMimeType("application/j-son;charset=UTF-8");
		}
	},
	
	//utility function to displaye view counts
	convertViewCount = function(photoViewCount) {
		photoViewCount = parseInt(photoViewCount,10);
		if(photoViewCount<1000) {
			
		} else if (photoViewCount<1000000) {
			photoViewCount = Math.round(photoViewCount/1000) + "K";
			
		} else if (photoViewCount<1000000000) {
			photoViewCount = (photoViewCount/1000000).toFixed(1) + "M";
		} else {
			photoViewCount = (photoViewCount/1000000000).toFixed(1) + "B";
		}
		
		return photoViewCount;
		
	},
	
	//display user header
	displayUserHeader = function(response,$instamaxContainer) {
		//console.log("displayUserHeader");
		//console.log(response);
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		var userData = response;
		
		//alert(photoArray.length);
		userId = instamax_global_options.userId;
		userTitle = instamax_global_options.userName;
		userImage = userData.data.profile_picture;
		
		//added in 4.0
		userBio = userData.data.bio;
		userWebsite = userData.data.website;
		userFullname = userData.data.full_name;
		userFollowing = convertViewCount(userData.data.counts.follows);
		/*if(userImage.indexOf("?")!=-1) {
			userImage = userImage.substring(0,userImage.indexOf("?"));
		}*/
		
		userFollowers = convertViewCount(userData.data.counts.followed_by);
		userPosts = convertViewCount(userData.data.counts.media);
		//not present via the API
		//userViews = userData.statistics.viewCount;
		
		userBackgroundImage = instamax_global_options.coverImage;
		//console.log('userBackgroundImage-',userBackgroundImage);
		
		
		$instamaxContainer.find('#instamax-header').css('background-image',"url("+userBackgroundImage+")");
		
		$instamaxContainer.find('#instamax-header-wrapper').append('<a href="https://instagram.com/'+userTitle+'" target="_blank"><div class="instamax-user-icon"><img src="'+userImage+'"/></div><div class="instamax-user-title">'+userTitle+'</div></a><div class="instamax-subscribe"><a href="https://instagram.com/'+userTitle+'" target="_blank"><i class="fa fa-instagram fa-lg"></i>&nbsp;&nbsp;FOLLOW&nbsp;&nbsp;<span class="instamax-subscriber-count">'+userFollowers+'</span></a></div><div id="instamax-stat-holder"></div>');
		
		$instamaxContainer.find('#instamax-header-wrapper').append('<div id="instamax-header-info"><div id="instamax-header-title">'+userTitle+'</div><div id="instamax-header-bio">'+userBio+'</div><div id="instamax-header-website"><a href="'+userWebsite+'" target="_blank">'+userWebsite+'</a></div><div id="instamax-header-counts"><span class="instamax-header-posts"><span class="instamax-count">'+userPosts+'</span> posts</span><span class="instamax-header-followers"><span class="instamax-count">'+userFollowers+'</span> followers</span><span class="instamax-header-following"><span class="instamax-count">'+userFollowing+'</span> following</span></div></div>');
		
		$instmaxStatHolder = $instamaxContainer.find('#instamax-stat-holder');
		if(instamax_global_options.showSearchBox) {
			$instmaxStatHolder.append('<div id="instamax-search-holder"><input id="instamax-search-box" type="text" placeholder=""/><i class="fa fa-search instamax-search-icon"></i></div>');
		} else {
			if(null!=userFollowers && userFollowers>0) {
				$instmaxStatHolder.append('<div class="instamax-stat"><span class="instamax-stat-count">'+convertViewCount(userFollowers)+'</span><br/>FOLLOWERS</div>');
			}
			
			if(null!=userPosts && userPosts>0) {
				$instmaxStatHolder.append('<div class="instamax-stat"><span class="instamax-stat-count">'+convertViewCount(userPosts)+'</span><br/>POSTS</div>');
			}		
		}
		
		//$instamaxContainer.find('#instamax-header-wrapper').append('');
		
		$instamaxContainer.find('#instamax-tabs').prepend('<span id="photos" class="instamax-tab" >Photos</span>');
		
		$instamaxContainer.find('#instamax-select').prepend('<option value="photos" class="instamax-option-highlight" >Your Beautiful Feed</option>');

		//selected Tab
		if(instamax_global_options.selectedTab.charAt(0)=='p') {
			$instamaxContainer.find('#photos').click();
		}
		
		
		//renderSubscribeButton();
	},
	
	//insert HTML for photo thumbnails into instamax grid
	insertUserPhotos = function(response,loadMoreFlag,$instamaxContainer,hashTag) {
		//console.log('into insertUserPhotos');
		//console.log(response);
		var photoIdArray = [];
		var $instamaxContainerList = $instamaxContainer.find('ul');
		//console.log('insertAlbumPhotos loadMoreFlag-'+loadMoreFlag);
		
		if(!loadMoreFlag) {
			//$instamaxContainerList.empty();
			if($instamaxContainer.find('.instamax-tab-hover').length==0) {
				query = $instamaxContainer.find('#instamax-search-box').val();
				$instamaxContainer.find('#instamax-showing-title').append('<div id="query_'+query+'" class="instamax-tab instamax-tab-hover">Showing Search for "'+query+'"</div>').show();
			}
		}
		
		/*if(!loadMoreFlag) {
			$instamaxContainerList.empty();
		}*/
		
		var photoArray = response.data;
		
		var $instamaxLoadMoreDiv = $instamaxContainer.find('#instamax-load-more-div');
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');	
		var nextPageUrl = response.pagination;
		
		if(null!=nextPageUrl && null!=nextPageUrl.next_url) {
			nextPageUrl = nextPageUrl.next_url;
			$instamaxLoadMoreDiv.data('nextpageurl',nextPageUrl);
		} else {
			$instamaxLoadMoreDiv.data('nextpageurl','');
		}
		//console.log('nextStartIndex-'+nextStartIndex);

		if(null!=hashTag && hashTag!="") {
		
			if(instamaxReloadCount>=instamax_global_options.maxAutoReloads) {
				instamaxReloadCount = 1;
			} else {
				$instamaxLoadMoreDiv.click();
				instamaxReloadCount++;
			}
			
		}
	
		if(null==photoArray || photoArray.length==0) {
			$instamaxContainerList.empty().append('<div class="instamax-not-found"><span style="opacity:0;">.</span><br><br><br><br><br><br>No Photos Found..<br><br><br><br><br><br><span style="opacity:0;">.</span></div>');
			return;
		}
		
		//Display first image as Cover Image if not explicitly specified
		if(null==instamax_global_options.coverImage || instamax_global_options.coverImage=="") {
			$instamaxContainer.find('#instamax-header').css('background-image','url('+photoArray[0].images.standard_resolution.url+')');
		}
		
		
		//alert(photoArray.length);
		for(var i=0; i<photoArray.length; i++) {
			photoId = photoArray[i].id;
			//albumId = photoArray[i].gphoto$albumid.$t;
			if($instamaxContainerList.find('#'+photoId).length>0) {
				continue;
			}
			
			photoTitle = photoArray[i].caption;
			if(null!=photoTitle) {
				photoTitle = photoTitle.text;
			} else {
				photoTitle="";
			}
			
			if(null!=hashTag && hashTag!="" && photoTitle.indexOf(hashTag)==-1) {
				continue;
			}
			
			//console.log('Photo title-'+photoTitle);
			photoThumbnail = photoArray[i].images.thumbnail.url;
			photoThumbnail = photoArray[i].images.thumbnail.url;
			photoHD = photoArray[i].images.standard_resolution.url;
			photoLD = photoArray[i].images.low_resolution.url;

			photoUploaded = photoArray[i].created_time;			
			photoComments = photoArray[i].comments.count;
			photoLikes = photoArray[i].likes.count;
			
			photoLink = photoArray[i].link;
			type = photoArray[i].type;
			
			videoLink = "";
			videoIcon = "";
			if(type=="video") {
				videoLink = photoArray[i].videos.standard_resolution.url;
				videoIcon = '<div class="instamax-play-icon"><i class="fa fa-play fa-5x"></i></div>';
			}
			//photoIdArray.push(albumId+"_"+photoId);
			
			if(instamax_global_options.displayMode=="link") {
				linkHtmlStart = '<a class="instamax-photo-link" href="'+photoLink+'" target="_blank">';
				linkHtmlEnd = '</a>';
			} else {
				linkHtmlStart = "";
				linkHtmlEnd = "";
			}
			
			//console.log('photoUploaded-'+photoUploaded);
			
			$instamaxContainerList.append('<li id="'+photoId+'" href="'+photoHD+'" class="instamax-gallery-item">'+linkHtmlStart+videoIcon+'<img class="instamax-thumbnail" src="'+photoThumbnail+'" data-photold="'+photoLD+'" data-photolink="'+photoLink+'" data-videolink="'+videoLink+'"><p><span class="instamax-photo-list-title">'+photoTitle+'</span><span class="instamax-photo-list-views">'+getDateDiff(photoUploaded)+'</span></p><div class="instamax-duration">'+'<i class="fa fa-comment"></i>&nbsp;'+convertViewCount(photoComments)+'</div><div class="instamax-definition">'+'<i class="fa fa-heart"></i>&nbsp;'+convertViewCount(photoLikes)+'</div>'+linkHtmlEnd+'</li>');
		}
		
		createGrid($instamaxContainer);
		
		//getPhotoStats(photoIdArray,response.feed.gphoto$user.$t,$instamaxContainer);
		
	},
	
	//utility function for date time
	getDateDiff = function (photoUploadDate,stampType) {
		dateDiffMS = Math.abs(new Date() - new Date(photoUploadDate * 1000));
		//console.log("dateDiffMS-"+dateDiffMS);

		if(null==stampType || stampType=="long") {
			yearsAgo = " years ago";
			monthsAgo = " months ago";
			daysAgo = " days ago";
			hoursAgo = " hours ago";
		} else if(stampType="short") {
			yearsAgo = " Y";
			monthsAgo = " M";
			daysAgo = " D";
			hoursAgo = " H";
		}
		
		dateDiffHR = dateDiffMS/1000/60/60;
		if(dateDiffHR>24) {
			dateDiffDY = dateDiffHR/24;
			if(dateDiffDY>30) {
				dateDiffMH = dateDiffDY/12;
				if(dateDiffMH>12) {
					dateDiffYR = dateDiffMH/12;
					dateDiffYR = Math.round(dateDiffYR);
					if(dateDiffYR<=1) {
						return dateDiffYR+yearsAgo;
					} else {
						return dateDiffYR+yearsAgo;
					}						
				} else {
					dateDiffMH = Math.round(dateDiffMH);
					if(dateDiffMH<=1) {
						return dateDiffMH+monthsAgo;
					} else {
						return dateDiffMH+monthsAgo;
					}						
				}
			} else {
				dateDiffDY = Math.round(dateDiffDY);
				if(dateDiffDY<=1) {
					return dateDiffDY+daysAgo;
				} else {
					return dateDiffDY+daysAgo;
				}
			}
		} else {
			dateDiffHR = Math.round(dateDiffHR);
			if(dateDiffHR<1) {
				return "just now";
			} else if(dateDiffHR==1) {
				return dateDiffHR+hoursAgo;
			} else {
				return dateDiffHR+hoursAgo;
			}
		}
	},
	
	//create grid layout using Wookmark plugin
	createGrid = function($instamaxContainer) {
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');	
		var $instamaxContainerList = $instamaxContainer.find('ul');
		$instamaxContainerList.imagesLoaded(function() {

			$instamaxContainerList.find('.instamax-loading-div').remove();			
		
			var options = {
			  autoResize: true, // This will auto-update the layout when the browser window is resized.
			  container: $instamaxContainer.find('#instamax-photo-list-div'), // Optional, used for some extra CSS styling
			  offset: instamax_global_options.innerOffset, // Optional, the distance between grid items
			  itemWidth: instamax_global_options.minItemWidth, // Optional, the width of a grid item
			  flexibleWidth : instamax_global_options.maxItemWidth,
			  outerOffset: instamax_global_options.outerOffset
			};

			
			var handler = $instamaxContainerList.find('li');
			
			// Call the layout function.
			handler.wookmark(options);
			
			if(instamax_global_options.displayMode=="popup") {
				registerPopup($instamaxContainer);
			}
			
			resetLoadMoreButton($instamaxContainer);
			
			window.clearTimeout(instamaxRefreshTimer);
			instamaxRefreshTimer = setTimeout(function(){updateThumbnails($instamaxContainer);}, instamax_global_options.refreshTimeout);

			//updateThumbnails($instamaxContainer);
		});
	},
	
	updateThumbnails = function($instamaxContainer) {
		//var $instamaxContainerImg = $instamaxContainer.find('ul>li>img');
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');	
		var albumThumbnail,updatedAlbumThumbnail;
		//console.log("in updateThumbnails");

		var items = document.getElementsByClassName("instamax-thumbnail");
		for (var i = items.length; i--;) {
			albumThumbnail = items[i].src;
			updatedAlbumThumbnail=albumThumbnail.replace("s150x150","s306x306");
			items[i].src = updatedAlbumThumbnail;
		}
		instamaxRefreshGrid($instamaxContainer);
		
		/*
		window.clearTimeout(instamaxRefreshTimer);
		instamaxRefreshTimer = setTimeout(function(){instamaxRefreshGrid($instamaxContainer)}, instamax_global_options.refreshTimeout);
		*/
	},
	
	instamaxRefreshGrid = function($instamaxContainer) {
		//console.log("in instamaxRefreshGrid");
		var $instamaxContainerList = $instamaxContainer.find('ul');
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');	
		
		$instamaxContainerList.imagesLoaded(function() {

			$instamaxContainerList.find('.instamax-loading-div').remove();
		
			var options = {
			  autoResize: true, // This will auto-update the layout when the browser window is resized.
			  container: $instamaxContainer.find('#instamax-photo-list-div'), // Optional, used for some extra CSS styling
			  offset: instamax_global_options.innerOffset, // Optional, the distance between grid items
			  itemWidth: instamax_global_options.minItemWidth, // Optional, the width of a grid item
			  flexibleWidth : instamax_global_options.maxItemWidth,
			  outerOffset: instamax_global_options.outerOffset
			};
			
			var handler = $instamaxContainerList.find('li');			
			$instamaxContainerList.find('li').wookmark(options);
			//console.log('triggered refresh');
		});	
	
	},	
	
	//display tabs for hashtags
	displayTabs = function(hashTagArray,$instamaxContainer) {
		//console.log(response);
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		//var playlistArray = response.items;
		
		//alert(videoArray.length);
		$instamaxTabs = $instamaxContainer.find('#instamax-tabs');
		$instamaxSelect = $instamaxContainer.find('#instamax-select');
		for(var i=0; i<hashTagArray.length; i++) {
			if(hashTagArray[i].length>instamax_global_options.maxTabNameLength) {
				tabTitleShort = hashTagArray[i].substring(0,instamax_global_options.maxTabNameLength) + "..";
			} else {
				tabTitleShort = hashTagArray[i];
			}
			
			$instamaxTabs.append('<span id="hashtag_'+hashTagArray[i]+'" class="instamax-tab" >#'+tabTitleShort+'</span>');
			$instamaxSelect.append('<option value="hashtag_'+hashTagArray[i]+'" >#'+hashTagArray[i]+'</option>');
		}
		
		//click the selectedTab
		if(instamax_global_options.selectedTab.charAt(0)=='h') {
			tabSelect = (instamax_global_options.selectedTab.charAt(1)) - 1;
			if(null!=hashTagArray[tabSelect]) {
				$('#hashtag_'+hashTagArray[tabSelect]).click();
			}
		}
	},
	
	
	resetLoadMoreButton = function($instamaxContainer) {
		var $instamaxLoadMoreDiv = $instamaxContainer.find('#instamax-load-more-div');
		$instamaxLoadMoreDiv.removeClass('instamax-load-more-div-click');
		$instamaxLoadMoreDiv.text('Load More');
	},
	
	//register photo popup on photo thumbnails
	registerPopup = function($instamaxContainer) {
	
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');

		
			$instamaxContainer.find('#instamax-photo-list-div li').magnificPopup({
				type:'image',
				gallery: {
					enabled:true
				},
				preloader:true,
				showCloseBtn: true, 
				closeBtnInside: false, 
				closeOnContentClick: false, 
				closeOnBgClick: true, 
				enableEscapeKey: true, 
				modal: false, 
				alignTop: false, 
				removalDelay: 100, 
				mainClass: ' ',
				prependTo: $instamaxContainer.get(),
				callbacks: {
					change: function() {
						
						//console.log(this);
						var $baseElement = $(this.currItem.el.context);
						mediaId = $baseElement.attr("id");
						mediaLikes = $baseElement.find(".instamax-definition").text().trim();
						mediaComments = $baseElement.find(".instamax-duration").text().trim();
						mediaUploaded = $baseElement.find(".instamax-photo-list-views").text().trim();
						mediaUploadedSplit = mediaUploaded.split(" ");
						mediaUploaded = mediaUploadedSplit[0] + " " + mediaUploadedSplit[1].charAt(0).toUpperCase();
						mediaLink = $baseElement.find(".instamax-thumbnail").data("photolink");
						videoLink = $baseElement.find(".instamax-thumbnail").data("videolink");
						
						userLink = "https://instagram.com/" + instamax_global_options.userName;
						//console.log("mediaLikes-"+mediaLikes);
						photoTitle = $baseElement.find(".instamax-photo-list-title").text();
						
						//console.log($(".mfp-bottom-bar"));
						setTimeout(function(){
							if(null!=videoLink && videoLink!="") {
								//console.log("videoLink-"+videoLink);
								$(".mfp-content figure>img").hide();
								maximumHeight = $(".mfp-content figure>img").css("max-height").replace("px","");
								maximumHeight = parseInt(maximumHeight,10);
								$(".mfp-content figure").find('video').remove();
								$(".mfp-content figure").prepend('<video controls style="max-height:'+maximumHeight+'px"><source src="'+videoLink+'" type="video/mp4">Your browser does not support the video tag.</video>');
							} else {
								$(".mfp-content figure>video").remove();
							}
							$(".mfp-bottom-bar").empty().append('<div id="photo-detail-holder"><div class="photo-popup-title">'+photoTitle+'</div><div class="photo-popup-stats"><span class="media-likes">'+mediaLikes+' <i class="fa fa-heart-o"></i> </span><span class="media-comments">'+mediaComments+' <i class="fa fa-comment-o"></i></span>'+'<span class="media-uploaded">'+mediaUploaded+'</span></div>  <div id="instamax-encloser-comments"></div> <div class="instamax-load-more-wrapper"><div id="instamax-load-more-comments">Load More</div></div> </div>');
							getPhotoComments ($instamaxContainer,mediaId,null);
							$instamaxContainer.find("#instamax-load-more-comments").data("mediaid",mediaId);
						}, 100);

						
					}
				}
	  
	  
			});
	
	},
	
	
	//display loading.. text
	showLoader = function($instamaxContainer) {
		$instamaxContainer.find('#instamax-photo-list-div>ul').empty();
		//$instamaxContainer.find('#instamax-photo').hide();
		//$instamaxContainer.find('#instamax-photo').attr('src','');
		$instamaxContainer.find('#instamax-photo-list-div>ul').append('<div class="instamax-loading-div" style="text-align:center; font-size:2vw; font-family: lato;"><br><br><br><br><br><br>Sorting your beautiful Patterns<br><br><br><br><br><br></div>');
		$instamaxContainer.find('#instamax-showing-title').empty().hide();
	},
	
	displayPhotos = function(tabId,$instamaxContainer) {
	
		showLoader($instamaxContainer);
		var instamax_global_options = $instamaxContainer.data('instamax_global_options');
		
		if(tabId.indexOf("photos")!=-1) {
			getUserPhotos($instamaxContainer,null);
		} else if(tabId.indexOf("hashtag_")!=-1) {
			if(instamax_global_options.tagScope=="user") {
				getUserPhotosBasedOnTags(tabId,$instamaxContainer,null);
			} else {
				getTagPhotos(tabId,$instamaxContainer,null);
			}
		} else if(tabId.indexOf("query_")!=-1) {
			if(instamax_global_options.searchScope=="user") {
				getUserPhotosBasedOnTags(tabId,$instamaxContainer,null);
			} else {
				getTagPhotos(tabId,$instamaxContainer,null);
			}
		}
		
		$instamaxContainer.find('.instamax-tab').removeClass('instamax-tab-hover');	
		$('#'+tabId).addClass('instamax-tab-hover');
		$instamaxContainer.find('#instamax-select').val(tabId);

	};	

	//instamax plugin definition
    $.fn.instamax = function(options) {
		
		var instamax_global_options = {};
		var $instamaxContainer = this;
		//console.log($instamaxContainer.attr('id'));
		
		//add fontawesome icons
		if (document.createStyleSheet){
			document.createStyleSheet("http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css");
		} else {
			$("head").append("<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css' type='text/css' />");
		}
		
		//Get CSS for Skins
		//console.log(options.skin);
		if(options.widgetMode) {
			$("head").append("<style>#instamax-header-info,.instamax-duration,#instamax-select-box {display:none !important;}.instamax-definition {width: 100% !important;text-align: center !important;}#instamax-header-wrapper>a {width: 100% !important;  margin: 0px !important;}.instamax-user-icon img {margin: 0px !important;}button#instamax-load-more-div {width: 100px;height: 100px;word-break: break-word;font-size: 13px;}.instamax-definition{padding-top: 44% !important;}</style>");
			options.skin="clean";
		}

		/*
		if(options.skin=="white" || options.skin=="grey" || options.skin=="clean") {
			if (document.createStyleSheet){
                document.createStyleSheet("./css/instamax_"+options.skin+".min.css");
            } else {
                $("head").append("<link rel='stylesheet' href='./css/instamax_"+options.skin+".min.css' type='text/css' />");
            }
		} else {
			//don't load any styles
			//user will load them manually
		}*/
		
		//set local options
		instamax_global_options.accessToken = options.accessToken;
		instamax_global_options.maxResults = options.maxResults||21;
		instamax_global_options.innerOffset = options.innerOffset||30;
		instamax_global_options.outerOffset = options.outerOffset||35;
		instamax_global_options.minItemWidth = options.minItemWidth||250;
		instamax_global_options.maxItemWidth = options.maxItemWidth||400;

		instamax_global_options.refreshTimeout = options.refreshTimeout||1000;
		instamax_global_options.coverImage = options.coverImage||"";
		
		//3.0 options
		instamax_global_options.selectedTab = options.selectedTab||"p"; //can be p|h1|h2|...
		instamax_global_options.alwaysUseDropdown = options.alwaysUseDropdown;
		instamax_global_options.maxTabNameLength = 22;
		instamax_global_options.showSearchBox = options.showSearchBox;
		

		//4.0 options
		instamax_global_options.maxComments = options.maxComments||20;
		instamax_global_options.tagScope = options.tagScope||"user"; //can be user or global
		instamax_global_options.searchScope = options.searchScope||"user"; //can be user or global
		instamax_global_options.widgetMode = options.widgetMode; 
		instamax_global_options.maxAutoReloads = options.maxAutoReloads||6;
		instamax_global_options.displayMode = options.displayMode||"popup"; //can be popup or link
		instamax_global_options.skin=options.skin;
		
		//4.1
		instamax_global_options.hashtag = options.hashtag;

		
		options.maxContainerWidth = options.maxContainerWidth||1000;
		$instamaxContainer.css('max-width',(options.maxContainerWidth)+'px');
		
		//adding media queries manually if maxContainerWidth is very low (widget mode)
		if(options.maxContainerWidth<800) {
			$("body").append("<style>#instamax-stat-holder {display:none;}.instamax-subscribe {left:initial;}#instamax-select-box{display:block;}#instamax-tabs {display:none;}</style>");
		}

		if(options.maxContainerWidth<500) {
			$("body").append("<style>#instamax-stat-holder {display:none;}.instamax-subscribe {display:none;}.instamax-tab {width: 42%;text-align: center;}</style>");
		}

		if(options.maxContainerWidth<300) {
			$("body").append("<style>.instamax-tab {width: 90%;text-align: center;}</style>");
		}
		
		
		//console.log(options);
		
		
		var s,albumId,apiUrl;
		
		//Get User header and details 
		if(options.user!=null) {
			s=options.user.lastIndexOf("/");
			//console.log('s-'+s);
			if(s!=-1) {
				instamax_global_options.userName = options.user.substring(s+1);
			} else {
				instamax_global_options.userName="";
				alert("Could Not Find User..");
				return;
			}
		}
		
		//set the options into Instamax
		$instamaxContainer.data('instamax_global_options',instamax_global_options);
		
		//init Instamax
		initInstamax($instamaxContainer);
		getUserId($instamaxContainer);
		
		
		
		//return this for chaining
		return this;
 
    };
	
 
}( jQuery ));