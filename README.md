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
				galleryWidth : '100%', //element width
				wrapClass : null, //if you wish to add additional class in wrapper		
				galleryUserId : '113851267474432398425', //your google id
				photoCommentsCSS : {'margin':'0 auto','width':'60%','text-align':'left'},
				photoViewMainDivNextText : 'Next',
				photoViewMainDivNextClass : '',
				photoViewMainDivPrevText : 'Prev',
				photoViewMainDivPrevClass : '',
				hideMoreThen : 0, //you can define number of album load in first place
				loadingImage : 'loader.gif' //you can define imagepath with name
				loadMoreText : 'Load More..', //text for load more options
				loadMoreCSS : {'cursor':'pointer'}, //css for load more options
				onGalleryEnter : function(){}, //exec before Gallery Show
				onGalleryPhoto : function(){} //exec after Photo Show		
			}
			*/

			$('.test').exceptioPhotoGallery({
				'galleryUserId' : '113851267474432398425' // Your Google ID
			});
			
		});			
		</script>
	</head>	
	<body>
		<div class="test"></div>
	</body>
</html>

```
