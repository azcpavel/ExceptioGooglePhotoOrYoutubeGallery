/*
 * ExceptioGooglePlusImageGallery v1.1.1 - Fully loaded, responsive content gallery
 * A Product of Exceotion Solutions
 * http://exceptionsolutions.com
 * 2014, Ahsan Zahid Chowdhury - http://itszahid.info
 * 
*/

;(function($){
	var defaultOptions = {		
		galleryWidth : '100%', //element width
		wrapClass : null, //if you wish to add additional class in wrapper		
		galleryUserId : 'azc.pavel@gmail.com', //your google id
		photoCommentsCSS : {'margin':'0 auto','width':'60%','text-align':'left'},
		photoViewMainDivNextText : 'Next',
		photoViewMainDivNextClass : '',
		photoViewMainDivPrevText : 'Prev',
		photoViewMainDivPrevClass : '',
		hideMoreThen : 0, //you can define number of album load in first place
		loadingImage : 'loader.gif', //you can define imagepath with name
		loadMoreText : 'Load More..', //text for load more options
		loadMoreCSS : {'cursor':'pointer'}, //css for load more options
		onGalleryEnter : function(){}, //exec before Gallery Show
		onGalleryPhoto : function(){} //exec after Photo Show		
	}

	$.fn.exceptioPhotoGallery = function(options){	

		if(this.length == 0) return this;

		// to support mutltiple elements
		if(this.length > 1){
			this.each(function(){$(this).exceptioPhotoGallery(options)});			
			return this;
		}		

		// create a namespace to be use in functions
		var gallery = {};
		// set a reference to our exceptioPhotoGallery element
		var ex = this;
		// create a namespace for slideFX
		var slideFX = {};		

		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		var chieldWidth;

		$(window).resize(function(){
			windowWidth = $(window).width();
			windowHeight = $(window).height();
			ex.reloadGallery(options);			
		});
		
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
			ex.wrapper = ex.viewport.parent().css({'float':'left','width':'100%'});
			ex.css({'float':'left','width':'100%'});
			if(gallery.settings.wrapClass != null)
				ex.wrapper.addClass(gallery.settings.wrapClass);			

			$.getJSON("https://picasaweb.google.com/data/feed/base/user/"+gallery.settings.galleryUserId+"?access=public&alt=json-in-script&callback=?",
				function(data){
						var parentList  = data.feed.entry;						
					ex.empty();
					
					if(gallery.settings.hideMoreThen != 0)
						var last = gallery.settings.hideMoreThen;
					else
						var last = parentList.length;

					for (var parentLoop = 0; parentLoop < last; parentLoop++) {					
						printAlbum(parentList,parentLoop);					
					};
				}
			);

			if(gallery.settings.hideMoreThen != 0){				
				this.$loadMore = $('<span id="exLoadMoreAlbum">'+gallery.settings.loadMoreText+'</span>').css(gallery.settings.loadMoreCSS).click(function(){
					gallery.settings.hideMoreThen = 0;
					initGallery(gallery.settings);					
				});
				ex.viewport.append(this.$loadMore);
			}
			else{
				$('#exLoadMoreAlbum').remove();	
			}			
				

		};

		//Initializes namespace album
		var printAlbum = function(parentList,parentLoop){
			
			$.getJSON(parentList[parentLoop].link[0].href+"&access=public&alt=json-in-script&callback=?",
				function(data){								
				var parentListChield  = data.feed;
				this.$galleryAlbum = $('<div class="galleryAlbum"></div>').css({'float':'left','cursor':'pointer',width:chieldWidth+'%',overflow:'hidden'});
				this.$galleryAlbum.html('<img src="'+parentListChield.icon.$t+'" style="width:100%;">');
				
				this.$galleryAlbum.hover(function(){					
					this.$galleryAlbumPop = $('<div class="galleryAlbumPop"></div>')
					.css({'opacity':'0',
					'overflow':'hidden',
					'height':$(this).height(),
					'width':$(this).width(),
					'color':'#FFF',
					'background':'rgba(0,0,0,0.5)',
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'absolute'});
					this.$galleryAlbumPop.html('<div style="padding-top:40%">'+parentList[parentLoop].title.$t+'</div><hr>');
					$(this).append(this.$galleryAlbumPop);
					this.$galleryAlbumPop.css('top',$(this).offset().top);
					this.$galleryAlbumPop.css('opacity','1');					
				},function(){
					$(this).children().eq(1).remove();					
				});

				this.$galleryAlbum.click(function(){
					this.$photoGallery = $('<div></div>')
					.css({
					'overflow-y':'auto',
					'height':$(window).height(),
					'width':$(window).width(),
					'color':'#FFF',
					'background':'rgba(0,0,0,1)',
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'fixed',
					'top': '0',
					'left': '0'
					});
					this.$photoGalleryClose = $('<div>Close&nbsp;&nbsp;&nbsp;</div>').attr('title','Click to close.').css({'margin':'20px 0','font-size':'20px','width':'100%','text-align':'right','cursor':'pointer'}).click(function(){
						$(this).parent().fadeOut('slow').remove();
					});
					this.$photoGallery.html(this.$photoGalleryClose);
					$('body').append(this.$photoGallery);
					this.$photoGallery.fadeIn('slow').append('<div id="exceptioPhotoView"></div>');
					$.each(parentListChield.entry,function(index, pic){						
						$('#exceptioPhotoView').append('<div data-index="'+index+'" style="cursor:pointer;width:'+chieldWidth+'%;float:left;height:213px;overflow:hidden;"><img src="'+pic.media$group.media$thumbnail[2].url+'" style="height:213px;margin:0 auto;transition:all 0.5s;-o-transition:all 0.5s;-moz-transition:all 0.5s;-webkit-transition:all 0.5s;"></div>');
					});

					$('#exceptioPhotoView > div').hover(function(){						
						$(this).find('img').css({'height':'203px','margin-top':'5px'});
					},function(){
						$(this).find('img').css({'height':'213px','margin-top':'0px'});
					});

					$(('#exceptioPhotoView > div')).click(function(){
						shotoPhoto(parentListChield, $(this).data('index'));
					})
					gallery.settings.onGalleryEnter();
				});
				ex.append(this.$galleryAlbum);	
			});
		};

		//Initializes namespace photo
		var shotoPhoto = function(parentListChield, index){
			this.$photoView = $('<div id="photoPreview"></div>')
			.css({
			'overflow-y':'auto',
			'height':$(window).height(),
			'width':$(window).width(),
			'color':'#FFF',
			'background':'rgba(0,0,0,0.9)',
			'text-align': 'center',
			'transition':'all 0.5s',
			'-o-transition':'all 0.5s',
			'-moz-transition':'all 0.5s',
			'-webkit-transition':'all 0.5s',
			'position':'fixed',
			'top': '0',
			'left': '0'						
			});
			this.$photoViewClose = $('<div>Close&nbsp;&nbsp;&nbsp;</div>').attr('title','Click to close.').css({'background-color':'#000','margin':'20px 0','font-size':'20px','width':'100%','text-align':'right','cursor':'pointer'}).click(function(){
				$(this).parent().fadeOut('slow').remove();
			});
			this.$photoView.html(this.$photoViewClose);
			$('#exceptioPhotoView').append(this.$photoView);
			var mainImage = parentListChield.entry[index];			
			console.log(mainImage);
			this.$photoViewMainDiv= $('<div style="width:100%;"></div>');
			this.$photoView.append(this.$photoViewMainDiv);
			this.$photoViewMainDiv.html('<img src="'+mainImage.content.src+'" style="width:60%;margin:0 auto;">');
			this.$photoViewMainDivComment = $('<div>'+mainImage.media$group.media$description.$t+'</div>').css(gallery.settings.photoCommentsCSS);
			this.$photoViewMainDiv.append(this.$photoViewMainDivComment);
			
			if(typeof parentListChield.entry[index+1] != 'undefined')
			{
				this.$photoViewMainDivNext = $('<span>'+gallery.settings.photoViewMainDivNextText+'</span>').css({'cursor':'pointer','top':'40%','position':'absolute','right':5}).click(function(){
					$('#photoPreview').remove();
					shotoPhoto(parentListChield,index+1);
				});
				if(gallery.settings.photoViewMainDivNextClass != '')
					this.$photoViewMainDivNext.addClass(gallery.settings.photoViewMainDivNextClass);
				this.$photoViewMainDiv.append(this.$photoViewMainDivNext);
			}
			if(typeof parentListChield.entry[index-1] != 'undefined')
			{
				this.$photoViewMainDivNext = $('<span>'+gallery.settings.photoViewMainDivPrevText+'</span>').css({'cursor':'pointer','top':'40%','position':'absolute','left':5}).click(function(){
					$('#photoPreview').remove();
					shotoPhoto(parentListChield,index-1);
				});
				if(gallery.settings.photoViewMainDivPrevClass != '')
					this.$photoViewMainDivPrev.addClass(gallery.settings.photoViewMainDivPrevClass);
				this.$photoViewMainDiv.append(this.$photoViewMainDivNext);
			}
			gallery.settings.onGalleryPhoto();
		}

		//Initializes namespace settings for Destroy Gallery
		ex.desrtoyGallery = function (){				
			$(this).unwrap().unwrap();
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