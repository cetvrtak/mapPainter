import { loadProvDef, provDef, getProvince } from './modules/province_definitions.js';
import { getCountry } from './modules/country_definitions.js';
import { applyPanZoom } from './modules/panzoom.js';

window.onload = function() {
	applyPanZoom(canvas, context, mapInit);
}

var canvas = document.getElementById('provinceMap');
var context = canvas.getContext('2d');
context.canvas.width  = window.innerWidth - 1;
context.canvas.height = window.innerHeight * 0.75;

var map = new Image();
map.crossOrigin = 'anonymous';
map.src = 'map/provinces.bmp';

map.onload = function() {
	loadProvDef(map, canvas, context);
	initializeMap("1836.1.1");
}

var mapInit = new Image();
mapInit.crossOrigin = 'anonymous';
mapInit.src = 'map/map_initial.png';
function initializeMap(date) {
	mapInit.onload = function() {
		context.drawImage(mapInit, 0, 0, canvas.width, canvas.height);

		for (var province of provinceDefinitions)
		{
			console.log(province);
			if (province.id == 1)
			{
				break;
			}
			if (province.sea)
			{
				continue;
			}
			if (province[date] == "")
			{
				cede(province.id, "---");
				continue;
			}
			cede(province.id, province[date]);
		}
	}
}

function pick(event) {
	var x = event.layerX;
	var y = event.layerY;
	var pixel = context.getImageData(x, y, 1, 1);
	var data = pixel.data;

	const rgb = [data[0], data[1], data[2]];
	if (getCountry(rgb) != undefined)
	{
		var owner = getCountry(rgb).tag;
	}

	return [rgb, owner];
}

canvas.addEventListener('mousemove', function(event) {
	var [rgb, owner] = pick(event);

	var hoveredColor = document.getElementById('hovered-color');
	hoveredColor.textContent = "rgb(" + rgb + ")";
	if (owner != undefined)
	{
		hoveredColor.textContent += "\nOwner: " + owner;
	}
});
canvas.addEventListener('click', function(event) {
	var [rgb, owner] = pick(event);

	var provinceView = document.getElementById('province-window');
	provinceView.style.display = "block";
	var provinceData = document.getElementById('province-data');
	provinceData.textContent = "Color: rgb(" + rgb + ")";
	if (owner != undefined)
	{
		provinceData.textContent += "\nOwner: " + owner;
	}
	else
	{
		provinceView.style.display = "none";
	}

	var provinceClose = document.getElementsByClassName('close')[0];
	provinceClose.onclick = function() {
		provinceView.style.display = "none";
	}
});

function cede(provId, tag) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	[red, green, blue] = getProvince(provId).color;
	var countryColor = getCountry(tag).color;

	for (var i = 0; i < provDef.length; i += 4) {
		if (provDef[i] == red && provDef[i + 1] == green && provDef[i + 2] == blue)
		{
			data[i] = countryColor[0];
			data[i + 1] = countryColor[1];
			data[i + 2] = countryColor[2];
		}
	}
	context.putImageData(imageData, 0, 0);
}

function getProvinceOwner(provId) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	var colorCode = getProvince(provId).color;
	var ownerColor;
	for (var i = 0; i < provDef.length; i += 4) {
		if (provDef[i] == colorCode[0] && provDef[i + 1] == colorCode[1] && provDef[i + 2] == colorCode[2])
		{
			ownerColor = [data[i], data[i + 1], data[i + 2]];
			break;
		}
	}
	return getCountry(ownerColor).tag;
}

function paintTheMap() {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	for (var i = 0; i < provDef.length; i += 4) {
		var province = getProvince([provDef[i], provDef[i + 1], provDef[i + 2]]);
		if (province.sea)
		{
			data[i] = 0;
			data[i + 1] = 0;
			data[i + 2] = 255;
			continue;
		}
		if (province["1836.1.1"] == "")
		{
			data[i] = 255;
			data[i + 1] = 255;
			data[i + 2] = 255;
			continue;
		}
		var ownerColor = getCountry(province["1836.1.1"]).color;
		data[i] = ownerColor[0];
		data[i + 1] = ownerColor[1];
		data[i + 2] = ownerColor[2];
	}
	context.putImageData(imageData, 0, 0);
}