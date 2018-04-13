function rgbaToHex (rgba) {
    var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r = parseInt((parts[0].substring(1).trim()), 10),
        g = parseInt((parts[1]).trim(), 10),
        b = parseInt((parts[2]).trim(), 10),
        a = parseFloat((parts[3].substring(0, parts[3].length - 1)).trim()).toFixed(2);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0,2));
}
var divCover  = document.createElement('div');
	divCover.className = "one-click-cover";
	divCover.style.height = window.innerHeight + 'px';
	divCover.innerHTML = '<div class="one-click-cover-color">' + 
							'<span class="one-click-cover-child one-click-cover-input ">RGBA: <input type="test" class="one-click-cover-rgba"/></span>' +
							'<span class="one-click-cover-child one-click-cover-input ">HEX: <input type="test" class="one-click-cover-input one-click-cover-hash"/></span>' +
							'<span class="one-click-cover-child one-click-cover-example"></span>' +
							'<span class="one-click-cover-child one-click-cover-before-select">' + chrome.i18n.getMessage("choose_color_from_page")  + '</span>' +
							'<button type="button" class="one-click-cover-child one-click-cover-close">X</button>' +
							'</div>';
	document.body.append(divCover);
	divCover.querySelector('button').onclick = function(){
		document.getElementsByTagName('html')[0].classList.remove('click1-picker-mode');
	}
	divCover.querySelector('.one-click-cover-color').onclick = function(e){
		e.stopPropagation();
	}
	divCover.onclick = function(e){
		//console.log(e);
		let data = {
			x : e.clientX,
			y : e.clientY,
			width  : window.innerWidth,
			height  : window.innerHeight,
			innerOuterRatioWidth: window.outerWidth/window.innerWidth,
			innerOuterRatioHeight: window.outerHeight/window.innerHeight
		}
		chrome.runtime.sendMessage({action: "colorPicked",data:data});
	}
chrome.runtime.onMessage.addListener(function(message){
	//console.log(message)
	switch(message.action){
		case 'ctx':
			let canvas = document.createElement("canvas"),
	              ctx = canvas.getContext("2d");
	          // let xConverted = request.data.x * request.data.innerOuterRatioWidth,
	          //     yConverted = request.data.y * request.data.innerOuterRatioHeight;
          
          var image = new Image();
          //image.width = window.innerWidth;
	      //image.style.height = 'inherit';
          image.onload = function() {
          	var bWidth = window.innerWidth;//document.body.getBoundingClientRect().width;
        	//console.log(image.width,image.height);
        	canvas.width = bWidth;
        	canvas.height = image.height * (bWidth/window.outerWidth);
      		//canvas.style.width = image.height + 'px';
           	ctx.drawImage(image,0,0,canvas.width,canvas.height);
           	//document.body.appendChild(canvas);
           // console.log(canvas);
           // console.log(request.data.x, request.data.y);
           
           // console.log(yConverted,xConverted);
           	let pixelData = canvas.getContext('2d').getImageData(message.data.x, message.data.y, 1, 1).data;
           	//console.log(pixelData);
           	let show = document.getElementsByClassName('one-click-cover-color')[0],
           		example = document.getElementsByClassName('one-click-cover-example')[0],
           		rgba = 	document.getElementsByClassName('one-click-cover-rgba')[0],
           		hash = 	document.getElementsByClassName('one-click-cover-hash')[0],
           		rgbData = [pixelData[0],pixelData[1],pixelData[2],pixelData[3]].join(', ');

           	rgba.value = 'rgba(' + rgbData + ')';
           	hash.value = rgbaToHex('(' + rgbData + ')');
           	//console.log(example,rgba.innerText);
           	example.style['background-color'] = rgba.value;
           	//console.log(example.style['background-color'],example.style);
           	show.classList.add('one-click-cover-color-selected');
           	document.body.removeChild(canvas);
         }
         //document.body.appendChild(image);
         image.src = message.image;
         //console.log(image);
			break;
		case 'showCover':
			document.getElementsByTagName('html')[0].classList.add('click1-picker-mode');
			//divCover.style.display = 'block';
			break;
		case 'hideCover':
			document.getElementsByTagName('html')[0].classList.remove('click1-picker-mode');
			//divCover.style.display = 'block';
			break;
	}
	return true;
})
// chrome.runtime.onMessage.addListener(function(message){
// 	//var svgimg = document.createElementNS("http://www.w3.org/2000/svg", "image");
// 	var divWrap  = document.createElement('div');
// 	divWrap.className = "one-click-img-wrap";
// 	divWrap.style.height = window.innerHeight + 'px';
// 	divWrap.innerHTML = '';
// 	//divWrap.innerHTML = '<canvas id="one-click-img-canvas"></canvas>';
// 	//divWrap.innerHTML = '<svg id="mySvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>';
// 	document.body.append(divWrap);
// 	//var svgObj = document.body.querySelector('#mySvg');
// 	console.log(divWrap)
// 	var body = document.body,
//     	html = document.documentElement,
// 		docHeight = Math.max( body.scrollHeight, body.offsetHeight, 
//                        html.clientHeight, html.scrollHeight, html.offsetHeight );
// 	// var canvas = document.getElementById("one-click-img-canvas");
// 	// var ctx = canvas.getContext("2d");
// 	// canvas.style.height = docHeight + 'px';
// 	// canvas.style.width = '100%';
// 	var image = new Image();
// 	image.onload = function() {
// 	 // ctx.drawImage(image, 0, 0);
// 	};
// 	image.src = message;
// 	divWrap.appendChild(image);
// 	//divWrap.appendChild(canvas);
// 	// svgimg.setAttribute( 'width', window.innerWidth );
// 	// svgimg.setAttribute( 'height', docHeight );

// 	// svgimg.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', message);
// 	// svgimg.className = 'copy-from-me-svg';
// 	//svgObj.appendChild(svgimg);
// 	//svgObj.setAttribute( 'width', window.innerWidth );
// 	//svgObj.setAttribute( 'height', docHeight );
// });