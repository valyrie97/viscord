




document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  // alert(cordova.platformId + " " + cordova.version);

  var my_awesome_script = document.createElement('script');
  my_awesome_script.setAttribute('src', 'app.js');
  my_awesome_script.setAttribute('type', 'module');
  my_awesome_script.setAttribute('crossorigin', true);
  
  document.head.appendChild(my_awesome_script);

}
