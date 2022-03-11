var canvas = document.getElementById('provinceMap');
var context = canvas.getContext('2d');

var map = new Image();
map.crossOrigin = 'anonymous';
map.src = 'map/provinces.bmp';
map.onload = function() {
	context.drawImage(map, 0, 0);
}

var mapData = context.createImageData(5616, 2160);

var hoveredColor = document.getElementById('hovered-color');
var selectedColor = document.getElementById('selected-color');


function pick(event, destination) {
	var x = event.layerX;
	var y = event.layerY;
	var pixel = context.getImageData(x, y, 1, 1);
	var data = pixel.data;

	const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
	destination.textContent = rgb;

	return rgb;
}

canvas.addEventListener('mousemove', function(event) {
	pick(event, hoveredColor);
});
canvas.addEventListener('click', function(event) {
	pick(event, selectedColor);
});