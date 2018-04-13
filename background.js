function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


chrome.runtime.setUninstallURL("https://1ce.org");

if (!localStorage.created) {
  chrome.tabs.create({ url: "https://1ce.org" });
  var manifest = chrome.runtime.getManifest();
  localStorage.ver = manifest.version;
  localStorage.created = 1;
}
//console.log(chrome.browserAction.onClicked);
chrome.browserAction.onClicked.addListener(function(tab){
  console.log('clicke',tab);
  chrome.tabs.captureVisibleTab(null,{format:'png'}, function(img){
    var i = new Image(); 

    i.onload = function(){
    // alert( i.width+", "+i.height );
      var blob = b64toBlob(img.split(',')[1]);
      url = URL.createObjectURL(blob);
      //console.log(localStorage.name +  i.width+"-"+i.height +'.png');
      var filename =  tab.title.replace(/[\W_]+/g,'-').toLowerCase();
      //if(localStorage.use)
      //console.log(filename);
      chrome.downloads.download({
        url: url,
        filename: (filename) + (localStorage.addSizes ? '-' + i.width + "-" + i.height : '') +'.png'
      });
    };

    i.src = img; 
  });
 });