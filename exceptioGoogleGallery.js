/*
 * ExceptioGooglePlusImageGallery v1.1.1 - Fully loaded, responsive content gallery
 * A Product of Exceotion Solutions
 * http://exceptionsolutions.com
 * 2014, Ahsan Zahid Chowdhury - http://itszahid.info
 * https://github.com/azcpavel/ExceptioGooglePlusImageGallery
*/

;(function($){
	var defaultOptions = {
		type : 'photo', //youtube or photo	
		galleryWidth : '100%', //element width
		wrapClass : null, //if you wish to add additional class in wrapper		
		galleryUserId : 'azc.pavel@gmail.com', //your google id or youtube playlist id
		emptyMessage : 'No Content Found', //Show message if no content found
		hideContent : [], // album/youtube title to hide eg. ["x","y","z"]
		galleryUserApiKey : '', //google console api key
		photoCommentsCSS : {'margin':'0 auto','width':'60%','text-align':'left'},
		photoViewMainDivNextText : 'Next', //next selector text
		photoViewMainDivNextClass : '', //next selector class
		photoViewMainDivPrevText : 'Prev', //prev selector text
		photoViewMainDivPrevClass : '', //next selector class
		albumRootText: 'Exceptio Google Gallery', //root gallery text
		albumBreadcrumbCSS: {}, //album breadcrumb css
		albumBreadcrumbArrow: '<span> &lt;= </span>', //album breadcrumb arrow
		albumBreadcrumbSpanCSS: {'color':'#000','cursor':'pointer'}, //album breadcrumb span css
		albumTitleCSS: '', //album title css		
		backgroundAlbum: 'rgb(0,0,0)', //album background color
		backgroundAlbumHover: 'rgba(0,0,0,0.9)', //album hover background color
		backgroundGallery: 'rgb(0,0,0)', //gallery background color
		backgroundPopup: 'rgba(0,0,0,0.6)', //item popup background color		
		photoPreviewCloseText : 'Close&nbsp;&nbsp;&nbsp;', //photo preview close text
		hideMoreThen : 0, //you can define number of album load in first place
		hideMoreThenBack : 0, //backup navigation defaults value
		loadingImage : 'loader.gif', //you can define imagepath with name
		loadMoreText : 'Load More..', //text for load more options
		loadLessText : 'Load Less..', //text for load more options
		loadMoreCSS : {'cursor':'pointer'}, //css for load more options
		onGalleryEnter : function(){}, //exec before Gallery Show
		onGalleryPhoto : function(){} //exec after Photo Show		
	}

	$.fn.exceptioGoogleGallery = function(options){	

		if(this.length == 0) return this;

		// to support mutltiple elements
		if(this.length > 1){
			this.each(function(){$(this).exceptioGoogleGallery(options)});			
			return this;
		}		

		// create a namespace to be use in functions
		var gallery = {};
		// set a reference to our exceptioGoogleGallery element
		var ex = this;
		// create a namespace for slideFX
		var slideFX = {};		

		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		var channelDetails;

		var chieldWidth;		

		/**
		*	@contributor Fannii https://github.com/Fannii
		*	@abstract To prevent duplicating album 
		*/

		var reSizeTime;

		$(window).resize(function(){
			ex.fadeIn();
			$('.photoGallery').remove();
			clearTimeout(reSizeTime);
						
			windowWidth = $(window).width();
			windowHeight = $(window).height();

			reSizeTime = setTimeout(doneResizing, 500);						
		});

		function doneResizing(){			
			ex.reloadGallery(options);
		}

		/****************************************/

		
		//Initializes namespace settings		
		var initGallery = function(options){	
			gallery.settings = $.extend({}, defaultOptions, options);

			if (windowWidth > 768)
				chieldWidth = '25';
			else if(windowWidth > 480)
				chieldWidth = '50';
			else{
				chieldWidth = '100';
			};
			ex.html('<div style="width:100%;text-align:center;"><img src="'+gallery.settings.loadingImage+'"/></div>');
			$('#exLoadMoreAlbum').remove();
			ex.wrap('<div class="exGallery" data-exGalleryIndex="'+$( "div" ).index(ex)+'"><div class="ex-viewport"></div></div>');
			ex.viewport = ex.parent().css({'float':'left','width':'100%'});
			ex.more = $('<div class="exMore" style="width:100%;float:left"></div>');
			ex.breadcrumb = $('<div style="width:100%;float:left"></div>').css(gallery.settings.albumBreadcrumbCSS);
			ex.root = $('<span style="cursor:pointer" title="Back to Album Root">'+gallery.settings.albumRootText+'</span>').css(gallery.settings.albumBreadcrumbSpanCSS).click(function(){
				$(this).parent().find('span:gt(0)').remove();
				$(this).html(gallery.settings.albumRootText);				
				ex.viewport.find('div[class="photoGallery"]').fadeOut('slow').remove();
				ex.fadeIn('slow');
				ex.more.fadeIn('slow');
			});			
			ex.viewport.prepend(ex.breadcrumb);
			ex.breadcrumb.html(ex.root);
			ex.viewport.append(ex.more);
			ex.wrapper = ex.viewport.parent().css({'float':'left','width':'100%'});			
			ex.css({'float':'left','width':'99%','padding':'0.5%'});
			if(gallery.settings.wrapClass != null)
				ex.wrapper.addClass(gallery.settings.wrapClass);			

			if(gallery.settings.type == 'youtube')
			$.getJSON('https://www.googleapis.com/youtube/v3/playlistItems?playlistId='+gallery.settings.galleryUserId+'&key='+gallery.settings.galleryUserApiKey+'&maxResults=50&type=video&part=id,snippet',
				function (data){
					if(data.items.length < 1)
					{
						ex.viewport.html(gallery.settings.emptyMessage);
						return;
					}				
					$.getJSON('https://www.googleapis.com/youtube/v3/channels?id='+data.items[0].snippet.channelId+'&key='+gallery.settings.galleryUserApiKey+'&part=contentDetails,snippet,statistics',
						function (argument) {							
							channelDetails = argument.items[0];							
						}
					);					
					
					var parentList  = data.items;					
					var loopNextPage = function (dataList){						
						
						$.getJSON('https://www.googleapis.com/youtube/v3/playlistItems?pageToken='+dataList.nextPageToken+'&playlistId='+gallery.settings.galleryUserId+'&key='+gallery.settings.galleryUserApiKey+'&maxResults=50&type=video&part=id,snippet',
							function (dataListNext){
								if(dataListNext.nextPageToken){
									$.each(dataListNext.items, function (index, value){
										parentList.push(value);										
									});
									loopNextPage(dataListNext);									
								}
								else{
									$.each(dataListNext.items, function (index, value){
										parentList.push(value);										
									});

									ex.empty();
					
									if(gallery.settings.hideMoreThen != 0)
										var last = (parentList.length >= gallery.settings.hideMoreThen ) ? gallery.settings.hideMoreThen : parentList.length;
									else
										var last = parentList.length;
									
									for (var parentLoop = 0; parentLoop < last; parentLoop++) {					
										if(gallery.settings.hideAlbums.indexOf(parentList[parentLoop].snippet.title) != -1)
											continue;
										printAlbumYoutube(parentList,parentLoop);					
									};
								}
							}
						);
						
					};

					if(data.nextPageToken)
						loopNextPage(data);
					else{					

						ex.empty();
						
						if(gallery.settings.hideMoreThen != 0)
							var last = (parentList.length >= gallery.settings.hideMoreThen ) ? gallery.settings.hideMoreThen : parentList.length;
						else
							var last = parentList.length;
						
						for (var parentLoop = 0; parentLoop < last; parentLoop++) {					
							if(gallery.settings.hideAlbums.indexOf(parentList[parentLoop].snippet.title) != -1)
								continue;
							printAlbumYoutube(parentList,parentLoop);					
						};
					}
				});

			if(gallery.settings.type == 'photo')
			$.getJSON("http://photos.googleapis.com/data/feed/api/user/"+gallery.settings.galleryUserId+"?access=public&alt=json-in-script&callback=?",
				function(data){
					if(data.feed.entry.length < 1)
						{
							ex.viewport.html(gallery.settings.emptyMessage);
							return;
						}

					var parentList  = data.feed.entry;						
					ex.empty();				
					
					if(gallery.settings.hideMoreThen != 0)
						var last = (parentList.length >= gallery.settings.hideMoreThen ) ? gallery.settings.hideMoreThen : parentList.length;
					else
						var last = parentList.length;

					for (var parentLoop = 0; parentLoop < last; parentLoop++) {					
						if(gallery.settings.hideAlbums.indexOf(parentList[parentLoop].title.$t) != -1)
							continue;
						printAlbum(parentList,parentLoop);					
					};
				}
			);
			
			if(gallery.settings.hideMoreThen != 0 || gallery.settings.hideMoreThenBack != 0){

				if(gallery.settings.hideMoreThen != 0)
					this.$loadMore = $('<span class="exLoadMoreAlbum">'+gallery.settings.loadMoreText+'</span>').css(gallery.settings.loadMoreCSS).click(function(){
						gallery.settings.hideMoreThenBack = gallery.settings.hideMoreThen;
						gallery.settings.hideMoreThen = 0;
						ex.reloadGallery(gallery.settings);					
					});
				else
					this.$loadMore = $('<span class="exLoadMoreAlbum">'+gallery.settings.loadLessText+'</span>').css(gallery.settings.loadMoreCSS).click(function(){					
						gallery.settings.hideMoreThen = gallery.settings.hideMoreThenBack;					
						ex.reloadGallery(gallery.settings);
						$('html,body').animate({scrollTop:ex.offset().top},500);					
					});

				ex.more.html(this.$loadMore);				
			}				

		};

		//Initializes namespace tube album
		var printAlbumYoutube = function(parentList,parentLoop){
			
			$.getJSON('https://www.googleapis.com/youtube/v3/videos?id='+parentList[parentLoop].snippet.resourceId.videoId+'&key='+gallery.settings.galleryUserApiKey+'&part=snippet,statistics,status',
				function(data){								
				var parentListChield  = data.items[0];							
				this.$galleryAlbum = $('<div class="galleryAlbum"></div>').css({
					'position':'relative',					
					'height':'210',
					'float':'left',
					'cursor':'pointer',
					'background' : gallery.settings.backgroundAlbum,					
					'margin' : '0.5%',
					'width':(chieldWidth - 1)+'%',
					'overflow':'hidden',					
				});
				this.$galleryAlbumImage = $('<img src="'+parentListChield.snippet.thumbnails.high.url+'">').css({
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'width': '150%',
					'min-height': '210px',
					'margin-left' : '-25%',
					'display':'inline-block',
					'vertical-align': 'middle'
				});
				this.$galleryAlbum.html(this.$galleryAlbumImage);
				this.$galleryAlbumPop = $('<div class="galleryAlbumPop"></div>')
					.css({
					'overflow':'hidden',
					'height':'250px',
					'width':'100%',
					'color':'#FFF',
					'background':gallery.settings.backgroundAlbumHover,					
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'absolute',
					'top' : '80%',
					'padding-top' : '2%',
					'z-index' : '39237'					
					});
				this.$galleryAlbumPopDiv = $('<div style="width:100%;text-align:center;">'+parentListChield.snippet.title+'</div>');
				if(gallery.settings.albumTitleCSS != '')
					this.$galleryAlbumPopDiv.css(gallery.settings.albumTitleCSS);

				this.$galleryAlbumPop.html(this.$galleryAlbumPopDiv).append('<hr>');
				this.$galleryAlbum.append(this.$galleryAlbumPop);																				
				this.$galleryAlbum.hover(function(){

					$(this).find('img').css({
						'width': '100%',
						'height': 'auto',
						'min-height': '0',						
						'margin-left' : '0%',
						'margin-top' : Math.ceil(($(this).find('img').parent().height()-($(this).find('img').height()*100/150)) / 2)
					});
					
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');					
					$(this).find('[class="galleryAlbumPop"]').css({'padding-top':'35%','top':'-0.5%'});
				},function(){
					$(this).find('img').css({
						'width': '150%',
						'min-height': '210px',
						'margin-left' : '-25%',
						'margin-top' : '0px'
					});
					//$(this).removeClass('divHover');
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
				});
				$('body').click(function(){
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
				});	
				
				this.$galleryAlbum.click(function(){
					ex.more.fadeOut('slow');
					showTube(parentList, parentLoop);
					gallery.settings.onGalleryEnter();
				});
				ex.append(this.$galleryAlbum);	
			});
		};

		//Initializes namespace tube
		var showTube = function(parentList, index){
			
			this.$tubeView = $('<div id="photoPreview"></div>')
			.css({
			'overflow-y':'auto',
			'height':$(window).height(),
			'width':$(window).width(),
			'color':'#FFF',
			'background':gallery.settings.backgroundPopup,
			'text-align': 'center',
			'transition':'all 0.5s',
			'-o-transition':'all 0.5s',
			'-moz-transition':'all 0.5s',
			'-webkit-transition':'all 0.5s',
			'position':'fixed',
			'top': '0',
			'left': '0',
			'z-index': '39237846'						
			});
			this.$tubeViewClose = $('<div>'+gallery.settings.photoPreviewCloseText+'</div>').attr('title','Click to close.').css({'position':'relative','margin':'5% auto 0 auto','font-size':'20px','width':'80%','text-align':'right','cursor':'pointer'}).click(function(){
				$(this).parent().fadeOut('slow').remove();
				ex.more.fadeIn('slow');
			});
			this.$tubeView.html(this.$tubeViewClose);
			ex.append(this.$tubeView);			
			this.$tubeViewMainDiv= $('<div style="width:100%;"></div>');
			this.$tubeView.append(this.$tubeViewMainDiv);
			var tubeHeight;
			if(windowHeight > windowWidth){
				tubeHeight = (windowHeight*40)/100;
			}
			else
				tubeHeight = (windowHeight*80)/100;
			this.$tubeViewMainDiv.html(
						'<object style="width:60%;height:'+tubeHeight+'px;margin:0 auto;">'+
							'<param name="movie" value="https://www.youtube.com/v/'+parentList[index].snippet.resourceId.videoId+'?version=3&autoplay=0&list='+channelDetails.contentDetails.relatedPlaylists.uploads+'"></param>'+
							'<param name="allowScriptAccess" value="always"></param>'+
							'<embed src="https://www.youtube.com/v/'+parentList[index].snippet.resourceId.videoId+'?version=3&autoplay=0&list='+channelDetails.contentDetails.relatedPlaylists.uploads+'" type="application/x-shockwave-flash" allowscriptaccess="always" style="width:60%;height:'+tubeHeight+'px;"></embed>'+
						'</object>'
				);
			this.$tubeViewMainDivComment = $('<div>'+parentList[index].snippet.description+'</div>').css(gallery.settings.photoCommentsCSS);
			this.$tubeViewMainDiv.append(this.$tubeViewMainDivComment);
			
			if(typeof parentList[index+1] != 'undefined')
			{
				this.$tubeViewMainDivNext = $('<span>'+gallery.settings.photoViewMainDivNextText+'</span>').css({'cursor':'pointer','top':'50%','position':'absolute','right':'10%'}).click(function(){
					$('#photoPreview').remove();
					showTube(parentList,index+1);
				});
				if(gallery.settings.photoViewMainDivNextClass != '')
					this.$tubeViewMainDivNext.addClass(gallery.settings.photoViewMainDivNextClass);
				this.$tubeViewMainDiv.append(this.$tubeViewMainDivNext);
			}
			if(typeof parentList[index-1] != 'undefined')
			{
				this.$tubeViewMainDivPrev = $('<span>'+gallery.settings.photoViewMainDivPrevText+'</span>').css({'cursor':'pointer','top':'50%','position':'absolute','left':'10%'}).click(function(){
					$('#photoPreview').remove();
					showTube(parentList,index-1);
				});
				if(gallery.settings.photoViewMainDivPrevClass != '')
					this.$tubeViewMainDivPrev.addClass(gallery.settings.photoViewMainDivPrevClass);
				this.$tubeViewMainDiv.append(this.$tubeViewMainDivPrev);
			}
			gallery.settings.onGalleryPhoto();
		};


		//Initializes namespace photo album
		var printAlbum = function(parentList,parentLoop){
			
			$.getJSON(parentList[parentLoop].link[0].href+"&imgmax=1600&access=public&alt=json-in-script&callback=?",
				function(data){								
				var parentListChield  = data.feed;				
				this.$galleryAlbum = $('<div class="galleryAlbum"></div>').css({
					'position':'relative',					
					'height':'210',
					'float':'left',
					'cursor':'pointer',
					'background' : gallery.settings.backgroundAlbum,					
					'margin' : '0.5%',
					'width':(chieldWidth - 1)+'%',
					'overflow':'hidden',					
				});
				this.$galleryAlbumImage = $('<img src="'+parentListChield.entry[0].content.src+'">').css({
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'width': '150%',
					'min-height': '210px',
					'margin-left' : '-25%',
					'display':'inline-block',
					'vertical-align': 'middle'
				});
				this.$galleryAlbum.html(this.$galleryAlbumImage);
				this.$galleryAlbumPop = $('<div class="galleryAlbumPop"></div>')
					.css({
					'overflow':'hidden',
					'height':'250px',
					'width':'100%',
					'color':'#FFF',
					'background':gallery.settings.backgroundAlbumHover,					
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'absolute',
					'top' : '80%',
					'padding-top' : '2%',
					'z-index' : '39237'					
					});
				this.$galleryAlbumPopDiv = $('<div style="width:100%;text-align:center;">'+parentList[parentLoop].title.$t+'</div>');
				if(gallery.settings.albumTitleCSS != '')
					this.$galleryAlbumPopDiv.css(gallery.settings.albumTitleCSS);

				this.$galleryAlbumPop.html(this.$galleryAlbumPopDiv).append('<hr>');
				this.$galleryAlbum.append(this.$galleryAlbumPop);																				
				this.$galleryAlbum.hover(function(){
					$(this).find('img').css({
						'width': '100%',
						'height': 'auto',
						'min-height': '0',						
						'margin-left' : '0%',
						'margin-top' : Math.ceil(($(this).find('img').parent().height()-($(this).find('img').height()*100/150)) / 2)
					});					
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');					
					$(this).find('[class="galleryAlbumPop"]').css({'padding-top':'35%','top':'-0.5%'});
				},function(){
					$(this).find('img').css({
						'width': '150%',
						'min-height': '210px',
						'margin-left' : '-25%',
						'margin-top' : '0px'
					});					
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
				});
				$('body').click(function(){
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
				});	
				
				this.$galleryAlbum.click(function(){
					ex.more.hide();
					this.$albumChield = $(gallery.settings.albumBreadcrumbArrow+' <span>'+parentList[parentLoop].title.$t+'</span>').css(gallery.settings.albumBreadcrumbSpanCSS);
					ex.breadcrumb.append(this.$albumChield);
					this.$photoGallery = $('<div class="photoGallery"></div>')
					.css({
					'overflow-y':'auto',
					'overflow-x':'hidden',
					'height':'auto',
					'width':'99%',
					'color':'#FFF',
					'background':gallery.settings.backgroundGallery,										
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'relative',
					'padding': '0.5%',										
					});					
					ex.viewport.append(this.$photoGallery);
					ex.hide();
					this.$photoGallery.fadeIn('slow').append('<div id="exceptioPhotoView"></div>');
					$.each(parentListChield.entry,function(index, pic){						
						$('#exceptioPhotoView').append('<div data-index="'+index+'" style="margin:0.5%;cursor:pointer;width:'+(chieldWidth-1)+'%;float:left;height:213px;overflow:hidden;"><img src="'+pic.content.src+'" style="width:150%;min-height:210px;margin-left:-25%;transition:all 0.5s;-o-transition:all 0.5s;-moz-transition:all 0.5s;-webkit-transition:all 0.5s;"></div>');
					});

					$('#exceptioPhotoView > div').hover(function(){						
						$(this).find('img').css({
							'margin-left':'0%',
							'min-height':'0',
							'height':'auto',
							'width':'100%',
							'margin-top': Math.ceil(($(this).find('img').parent().height()-($(this).find('img').height()*100/150)) / 2)
						});
					},function(){						
						$(this).find('img').css({
							'margin-left':'-25%',
							'min-height':'210px',
							'width':'150%',
							'margin-top' : '0px'
						});
					});

					$(('#exceptioPhotoView > div')).click(function(){
						showPhoto(parentListChield, $(this).data('index'));
					});
					gallery.settings.onGalleryEnter();
				});
				ex.append(this.$galleryAlbum);	
			});
		};

		//Initializes namespace photo
		var showPhoto = function(parentListChield, index){
			this.$photoView = $('<div id="photoPreview"></div>')
			.css({
			'overflow-y':'auto',
			'height':$(window).height(),
			'width':$(window).width(),
			'color':'#FFF',
			'background':gallery.settings.backgroundPopup,
			'text-align': 'center',
			'transition':'all 0.5s',
			'-o-transition':'all 0.5s',
			'-moz-transition':'all 0.5s',
			'-webkit-transition':'all 0.5s',
			'position':'fixed',
			'top': '0',
			'left': '0',
			'z-index': '39237846'						
			});
			this.$photoViewClose = $('<div>'+gallery.settings.photoPreviewCloseText+'</div>').attr('title','Click to close.').css({'position':'absolute','margin-top':'5%','font-size':'20px','width':'80%','text-align':'right','cursor':'pointer'}).click(function(){
				$(this).parent().fadeOut('slow').remove();
			});
			this.$photoView.html(this.$photoViewClose);
			$('#exceptioPhotoView').append(this.$photoView);
			var mainImage = parentListChield.entry[index];						
			this.$photoViewMainDiv= $('<div style="width:100%;margin-top:5%;"></div>');
			this.$photoView.append(this.$photoViewMainDiv);
			this.$photoViewMainDiv.html('<img src="'+mainImage.content.src+'" style="width:60%;margin:0 auto;">');
			this.$photoViewMainDivComment = $('<div>'+mainImage.media$group.media$description.$t+'</div>').css(gallery.settings.photoCommentsCSS);
			this.$photoViewMainDiv.append(this.$photoViewMainDivComment);
			
			if(typeof parentListChield.entry[index+1] != 'undefined')
			{
				this.$photoViewMainDivNext = $('<span>'+gallery.settings.photoViewMainDivNextText+'</span>').css({'cursor':'pointer','top':'50%','position':'absolute','right':'10%'}).click(function(){
					$('#photoPreview').remove();
					showPhoto(parentListChield,index+1);
				});
				if(gallery.settings.photoViewMainDivNextClass != '')
					this.$photoViewMainDivNext.addClass(gallery.settings.photoViewMainDivNextClass);
				this.$photoViewMainDiv.append(this.$photoViewMainDivNext);
			}
			if(typeof parentListChield.entry[index-1] != 'undefined')
			{
				this.$photoViewMainDivPrev = $('<span>'+gallery.settings.photoViewMainDivPrevText+'</span>').css({'cursor':'pointer','top':'50%','position':'absolute','left':'10%'}).click(function(){
					$('#photoPreview').remove();
					showPhoto(parentListChield,index-1);
				});
				if(gallery.settings.photoViewMainDivPrevClass != '')
					this.$photoViewMainDivPrev.addClass(gallery.settings.photoViewMainDivPrevClass);
				this.$photoViewMainDiv.append(this.$photoViewMainDivPrev);
			}
			gallery.settings.onGalleryPhoto();
		};		

		//Initializes namespace settings for Destroy Gallery
		ex.desrtoyGallery = function (){				
			ex.more.remove();
			ex.breadcrumb.remove();			
			$(this).unwrap().unwrap().unwrap();			
			$(this).children().css({'list-style':'initial','float':'none'})			
		};

		//Initializes namespace settings for Reload Gallery
		ex.reloadGallery = function (options){
			ex.desrtoyGallery();
			initGallery(options);
		};

		var printError = function(msg)
		{
			console.log('An Error has occurred\n'+msg);
		}

		initGallery(options);
	};
})(jQuery);
