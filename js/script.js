var canvas = document.getElementById('provinceMap');
var context = canvas.getContext('2d');

var map = new Image();
map.crossOrigin = 'anonymous';
map.src = 'map/provinces.bmp';
var mapDef;

map.onload = function() {
	context.drawImage(map, 0, 0);
	mapDef = context.getImageData(0, 0, canvas.width, canvas.height).data;

	cede(1, country.color);
}

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

var country = {
	color: [0,0,0]
}

function cede(provId, tag) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	[red, green, blue] = getProvince(provId).color;

	for (var i = 0; i < mapDef.length; i += 4) {
		if (mapDef[i] == red && mapDef[i + 1] == green && mapDef[i + 2] == blue)
		{
			data[i] = tag[0];
			data[i + 1] = tag[1];
			data[i + 2] = tag[2];
		}
	}
	context.putImageData(imageData, 0, 0);
}