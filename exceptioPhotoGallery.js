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
		albumTitleCSS: '',
		backgroundRgba: 'rgba(0,0,0,0.9)',
		backgroundRgb: 'rgb(0,0,0)',
		photoAlbumCloseText : 'Back&nbsp;&nbsp;&nbsp;',
		photoPreviewCloseText : 'Close&nbsp;&nbsp;&nbsp;',
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
			ex.css({'float':'left','width':'99%','padding': '0.5%', 'background' : gallery.settings.backgroundRgb});
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
				this.$galleryAlbum = $('<div class="galleryAlbum"></div>').css({
					'position':'relative',					
					'height':'210',
					'float':'left',
					'cursor':'pointer',
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
					'margin-left' : '-25%'
				});
				this.$galleryAlbum.html(this.$galleryAlbumImage);
				this.$galleryAlbumPop = $('<div class="galleryAlbumPop"></div>')
					.css({
					'overflow':'hidden',
					'height':'250px',
					'width':'100%',
					'color':'#FFF',
					'background':gallery.settings.backgroundRgba,					
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'absolute',
					'top' : '80%',
					'padding-top' : '2%'					
					});
				this.$galleryAlbumPopDiv = $('<div style="width:100%;text-align:center;">'+parentList[parentLoop].title.$t+'</div>');
				if(gallery.settings.albumTitleCSS != '')
					this.$galleryAlbumPopDiv.css(gallery.settings.albumTitleCSS);

				this.$galleryAlbumPop.html(this.$galleryAlbumPopDiv).append('<hr>');
				this.$galleryAlbum.append(this.$galleryAlbumPop);																				
				this.$galleryAlbum.hover(function(){
					$(this).find('img').css({
						'width': '160%',						
						'margin-left' : '-30%'						
					});
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
					$(this).find('[class="galleryAlbumPop"]').animate({'top':'-0.5%'},50);
					$(this).find('[class="galleryAlbumPop"]').css('padding-top','35%');
				},function(){
					$(this).find('img').css({
						'width': '150%',
						'min-height': '210px',
						'margin-left' : '-25%'
					});
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
				});
				$('body').click(function(){
					$(".galleryAlbumPop").css('padding-top','2%');
					$(".galleryAlbumPop").css('top','80%');
				});	
				
				this.$galleryAlbum.click(function(){
					this.$photoGallery = $('<div></div>')
					.css({
					'overflow-y':'auto',
					'overflow-x':'hidden',
					'height':'auto',
					'width':'99%',
					'color':'#FFF',
					'background':gallery.settings.backgroundRgb,
					'padding': '0.5%',					
					'text-align': 'center',
					'transition':'all 0.5s',
					'-o-transition':'all 0.5s',
					'-moz-transition':'all 0.5s',
					'-webkit-transition':'all 0.5s',
					'position':'relative',
					'padding-bottom': '40px',										
					});
					this.$photoGalleryClose = $('<div>'+gallery.settings.photoAlbumCloseText+'</div>').attr('title','Back to gallery.').css({'margin':'20px 0','font-size':'20px','width':'100%','text-align':'right','cursor':'pointer'}).click(function(){
						$(this).parent().fadeOut('slow').remove();
						ex.fadeIn('slow');
					});
					this.$photoGallery.html(this.$photoGalleryClose);
					ex.viewport.append(this.$photoGallery);
					ex.hide();
					this.$photoGallery.fadeIn('slow').append('<div id="exceptioPhotoView"></div>');
					$.each(parentListChield.entry,function(index, pic){						
						$('#exceptioPhotoView').append('<div data-index="'+index+'" style="margin:0.5%;cursor:pointer;width:'+(chieldWidth-1)+'%;float:left;height:213px;overflow:hidden;"><img src="'+pic.content.src+'" style="height:260px;margin:0 auto;transition:all 0.5s;-o-transition:all 0.5s;-moz-transition:all 0.5s;-webkit-transition:all 0.5s;"></div>');
					});

					$('#exceptioPhotoView > div').hover(function(){						
						$(this).find('img').css({'height':'270px'});
					},function(){
						$(this).find('img').css({'height':'260px'});
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
			'background':gallery.settings.backgroundRgba,
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
				this.$photoViewMainDivNext = $('<span>'+gallery.settings.photoViewMainDivNextText+'</span>').css({'cursor':'pointer','top':'40%','position':'absolute','right':'10%'}).click(function(){
					$('#photoPreview').remove();
					shotoPhoto(parentListChield,index+1);
				});
				if(gallery.settings.photoViewMainDivNextClass != '')
					this.$photoViewMainDivNext.addClass(gallery.settings.photoViewMainDivNextClass);
				this.$photoViewMainDiv.append(this.$photoViewMainDivNext);
			}
			if(typeof parentListChield.entry[index-1] != 'undefined')
			{
				this.$photoViewMainDivNext = $('<span>'+gallery.settings.photoViewMainDivPrevText+'</span>').css({'cursor':'pointer','top':'40%','position':'absolute','left':'10%'}).click(function(){
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
