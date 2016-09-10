
$(document).ready(function(){
	
	var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=vancouver";

	var apiKey = "ad1b1e8a90a419b8bff9b0759abf440a";

	var unitType = "imperial";

	var daysTotal = 8;

	$.get({
		url: weatherUrl + "&APPID=" + apiKey + "&units=" + unitType + "&cnt=" + daysTotal,
		success: function(result){
			document.write(result);
		},
		error: function(){
			console.log("error");
		}
	});

})
