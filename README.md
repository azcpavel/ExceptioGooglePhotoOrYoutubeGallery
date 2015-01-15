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
			var defaultOptions = {
				type : 'picasa', //youtube or picasa	
				galleryWidth : '100%', //element width
				wrapClass : null, //if you wish to add additional class in wrapper		
				galleryUserId : 'azc.pavel@gmail.com', //your google id or youtube channel id
				galleryUserApiKey : '', //google console api key
				photoCommentsCSS : {'margin':'0 auto','width':'60%','text-align':'left'},
				photoViewMainDivNextText : 'Next', //next selector text
				photoViewMainDivNextClass : '', //next selector class
				photoViewMainDivPrevText : 'Prev', //prev selector text
				photoViewMainDivPrevClass : '', //next selector class
				albumRootText: 'Exceptio Google Gallery', //root gallery text
				albumBreadcrumbCSS: {},
				albumBreadcrumbSpanCSS: {'color':'#000','cursor':'pointer'},
				albumTitleCSS: '', //album title css		
				backgroundAlbum: 'rgb(0,0,0)', //album background color
				backgroundAlbumHover: 'rgba(0,0,0,0.9)', //album hover background color
				backgroundGalery: 'rgb(0,0,0)', //gallery background color
				backgroundPopup: 'rgba(0,0,0,0.6)', //item popup background color				
				photoPreviewCloseText : 'Close&nbsp;&nbsp;&nbsp;', //photo preview close text
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
