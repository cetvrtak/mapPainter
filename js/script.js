import { provinceDefinitions, getDefPixel, getProvince } from './modules/province_definitions.js';
import { getCountry } from './modules/country_definitions.js';
import { applyPanZoom, mapDef } from './modules/panzoom.js';

var provDef;

window.onload = function() {
	//applyPanZoom(canvas, context, mapInit, map);
}

var canvas = document.getElementById('province-map');
var context = canvas.getContext('2d');
canvas.width  = window.innerWidth - 1;
canvas.height = window.innerHeight * 0.75;
canvas.zoomRange = [0.99, 100];

var map = new Image();
map.crossOrigin = 'anonymous';
map.src = 'map/provinces.bmp';

map.onload = function() {
	initializeMap("1836.1.1");
}

var mapInit = new Image();
mapInit.crossOrigin = 'anonymous';
mapInit.src = 'map/map_initial.png';
function initializeMap(date) {
		context.imageSmoothingEnabled = false;

		context.drawImage(map, 0, 0, canvas.width, canvas.height);
		provDef = context.getImageData(0, 0, canvas.width, canvas.height).data;

		context.drawImage(mapInit, 0, 0, canvas.width, canvas.height);

		for (var province of provinceDefinitions)
		{
			if (province.id == 1)
			{
				break;
			}
			console.log(province);
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

	var province = getProvince(getDefPixel(x, y, provDef, canvas));

	return [owner, province];
}

canvas.addEventListener('mousemove', function(event) {
	var [owner, province] = pick(event);

	var hoveredColor = document.getElementById('debug-data');
	if (province != undefined)
	{
		hoveredColor.textContent = province.name;
		hoveredColor.textContent += "\nID: " + province.id;
		if (owner != undefined)
		{
			hoveredColor.textContent += "\nOwner: " + owner;
		}
	}
});
canvas.addEventListener('click', function(event) {
	var [owner, province] = pick(event);

	var provinceView = document.getElementById('province-window');
	provinceView.style.display = "block";
	if (province != undefined)
	{
		var provinceName = document.getElementById('province-name');
		provinceName.textContent = province.name;
		var provinceData = document.getElementById('province-data');
		provinceData.textContent = "ID: " + province.id;
		if (owner != undefined)
		{
			provinceData.textContent += "\nOwner: " + owner;
		}
		else
		{
			provinceView.style.display = "none";
		}
	}

	var provinceClose = document.getElementsByClassName('close')[0];
	provinceClose.onclick = function() {
		provinceView.style.display = "none";
	}
});

function cede(provId, tag) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	var province = getProvince(provId);
	if (province.sea)
	{
		return;
	}

	var [red, green, blue] = province.color;
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

var cons = document.getElementById("console");
var consLog = document.getElementById("console-log");
cons.addEventListener("change", function() {
	consLog.textContent += cons.value + "\n";
	let fn = cons.value.split(" ")[0];
	let args = cons.value.split(" ").slice(1);
	switch (fn) {
		case "cede":
			cede.apply(null, args);
			break;
		default:
			consLog.textContent += "Unknown command\n";
	}
});