function WeatherModel(data){
    var self = this;

    self.City = ko.observable(new CityModel(data.city));

    var mappedDays = [];
    for (var i = data.list.length - 1; i >= 0; i--) {
       mappedDays[i] = new DayModel(data.list[i])
    }

    self.Days = ko.observableArray(mappedDays);
}

function CityModel(data) {
    this.name = ko.observable(data.name);
}

function DayModel(data){
    var self = this;

    self.datetime = moment.unix(data.dt).format('dddd Do YYYY');
/*      "dt": 1473537600,
        "temp": {
          "day": 61.12,
          "min": 59.04,
          "max": 61.12,
          "night": 59.04,
          "eve": 61.12,
          "morn": 61.12
        },
        "pressure": 1011.89,
        "humidity": 100,
        "weather": [
          {
            "id": 801,
            "main": "Clouds",
            "description": "few clouds",
            "icon": "02n"
          }
        ],
        "speed": 4.07,
        "deg": 266,
        "clouds": 20*/
}

function AppViewModel() {
    var self = this;

    self.Weather = ko.observable();
    
    self.getData = function(){
        $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=vancouver&APPID=ad1b1e8a90a419b8bff9b0759abf440a&units=imperial", function(data) {
            var WeatherData = new WeatherModel(data)

            self.Weather(WeatherData);
        });    
    }
    self.getData();
}

ko.applyBindings(new AppViewModel(), document.getElementById('WeatherApp'));