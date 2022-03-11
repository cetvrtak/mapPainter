function drawMap() {
	var context = document.getElementById('provinceMap').getContext('2d');

	var map = new Image();
	map.src = 'map/provinces.bmp';
	map.onload = function() {
		context.drawImage(map, 0, 0);
	}
}

drawMap();