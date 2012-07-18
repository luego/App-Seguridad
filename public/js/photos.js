
var currentPhoto 	= null;
var latitude 		= null;
var longitude 		= null;
var altitude 		= null;

function onPhotosLoad() {
	navigator.camera.getPicture(onPhotoLoadSuccess, onFail, {
		quality : 50,
		encodingType : Camera.EncodingType.JPEG,
		destinationType : navigator.camera.DestinationType.FILE_URI,
		sourceType: navigator.camera.PictureSourceType.CAMERA
	});
	loaded = true;
}

function onPhotoLoadSuccess(photoUri) {
	// store current photo for saving later
	currentPhoto = photoUri;
	//myImage.src = "data:image/jpeg;base64," + imageData;
	//document.getElementById('photoPreview').src = photoUri;
	var options = { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true };
	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

function onFail(message) {
	alert('Failed because: ' + message);
}

function savePhoto() {
	
	if (currentPhoto == null) {
		alert("Por favor elija una foto primero");
		return;
	}
	 $.mobile.showPageLoadingMsg();
	var uploadOptions = new FileUploadOptions();
	uploadOptions.fileKey = "file";
	uploadOptions.fileName = currentPhoto.substr(currentPhoto.lastIndexOf('/') + 1);
	//uploadOptions.mimeType = "image/png";
	uploadOptions.mimeType="image/jpeg";
	uploadOptions.chunkedMode = false;
	var params = {
			descripcion: $("#descripciontxt").val(),
			latitude:  latitude,
			longitude: longitude,
			altitude:	altitude
		  };
	uploadOptions.params = params;
	var fileTransfer = new FileTransfer();
	// Be sure to update the URL below to your site
	fileTransfer.upload(currentPhoto,
						"http://ideasmobiles.co/api/viaje/registrar", 
						uploadSuccess,	
						uploadFail, 
						uploadOptions);
}

function uploadSuccess(result) {
	$.mobile.hidePageLoadingMsg();
	//alert("Successfully transferred " + result.bytesSent + "bytes");
	alert("Registro de posicion exitoso");
	navigator.notification.vibrate(500);
	navigator.notification.beep(2);
	currentPhoto = null;
	loaded = false;
	$("#descripciontxt").val("");
}

function uploadFail(error) {
	$.mobile.hidePageLoadingMsg();
	console.log(error);
	alert("Error uploading file: " + error.code);
}

function onSuccess(position) {
   	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	altitude = position.coords.altitude;
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

