ExceptioGooglePlusImageGallery
==============================

Simple jQuery Google Plus Image Gallery

```
<html>
	<head>
		<title>Google+ Image Gallery </title>
		<script type="text/javascript" src="jquery-1.11.0.min.js"></script>		
		<script type="text/javascript" src="exceptioPhotoGallery.js"></script>		
		<script type="text/javascript">		
		$(document).ready(function(){
			/*
			defaultOptions = {		
				type : 'picasa',	//youtube or picasa	
				galleryWidth : '100%', //element width
				wrapClass : null, //if you wish to add additional class in wrapper		
				galleryUserId : 'azc.pavel@gmail.com', //your google id or youtube channel id
				galleryUserApiKey : '', //google console api key
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
				loadLessText : 'Load Less..', //text for load more options
				loadMoreCSS : {'cursor':'pointer'}, //css for load more options
				onGalleryEnter : function(){}, //exec before Gallery Show
				onGalleryPhoto : function(){} //exec after Photo Show		
			}
			*/

			$('.test').exceptioGoogleGallery({
				'galleryUserId' : 'azc.pavel@gmail.com' // Your Google ID
			});
			
		});			
		</script>
	</head>	
	<body>
		<div class="test"></div>
	</body>
</html>

```
