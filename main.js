function WeatherModel(data){
    var self = this;

    self.City = ko.observable(new CityModel(data.city));

    var mappedDays = [];
    for (var i = data.list.length - 1; i >= 0; i--) {
       mappedDays[i] = new DayModel(data.list[i])
    }

    self.Days = ko.observableArray(mappedDays);
    self.currentDay = ko.observable(mappedDays[0]);

    self.setCurrentDay = function(item, e){
        self.currentDay(item);
    };

    self.isCurrentDay = function(item){
        return self.currentDay().datetime === item.datetime;
    };

    self.map =  ko.observable({
        lat: ko.observable(self.City().lat()),
        lng: ko.observable(self.City().lng())
    });

    self.chart = ko.observable({
      days: self.Days()
    });

    self.inputChange = ko.observable();
}

function CityModel(data) {
    var self = this;

    self.name = ko.observable(data.name);

    self.country = ko.observable(data.country);

    self.formattedName = ko.computed(function() {
      return self.name() + ", " + self.country();
    });

    self.lat = ko.observable(data.coord.lat);
    self.lng = ko.observable(data.coord.lon);
}

function DayModel(data){
    var self = this;

    self.datetime = moment.unix(data.dt).format('dddd Do YYYY');
    self.temp = data.temp;

    self.weather = ko.observable(data.weather[0]);
}

function AppViewModel() {
    var self = this;

    self.Weather = ko.observable();
    
    self.getData = function(){
        $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=vancouver&APPID=ad1b1e8a90a419b8bff9b0759abf440a&units=imperial", function(data) {
            if(data.cod === '200'){
              var WeatherData = new WeatherModel(data)
              self.Weather(WeatherData);
            }else{

            }
        });    
    }

    self.getCityWeather = function(){
        $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q="+self.Weather().inputChange()+"&APPID=ad1b1e8a90a419b8bff9b0759abf440a&units=imperial", function(data) {
            if(data.cod === '200'){
              var WeatherData = new WeatherModel(data)
              self.Weather(WeatherData);
            }else{
              self.appError(true)
            }
        });    
    }

    self.appError = ko.observable(false);

    self.getData();
}

ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = ko.utils.unwrapObservable(valueAccessor());
        var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));

        var mapOptions = {
          center: latLng,
          zoom: 5, 
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        mapObj.googleMap = new google.maps.Map(element, mapOptions);
    }
};

ko.bindingHandlers.chart = {

    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

      var chartObj = ko.utils.unwrapObservable(valueAccessor());

      var dates =  chartObj.days.map(function(item){
        return item.datetime;
      });

      var Daytemperatures = chartObj.days.map(function(item){
        return item.temp.day;
      });

      var chart1 = new Highcharts.Chart({
          chart: {
              renderTo: element,
              type: 'line'
          },
          title: {
              text: 'Temperature for the Week'
          },
          xAxis: {
              categories: dates
          },
          yAxis: {
              title: {
                  text: 'Temperature'
              }
          },
          series: [{
              name: 'Day Temperature',
              data: Daytemperatures
          }
          ]
      });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.bindingHandlers.animateChange = {
   init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        debugger;
   },

   update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        $(element).find('#weatherInfoContainer').fadeOut().fadeIn('fast');
        //if (valueUnwrapped == true)
        //    $(element).fadeIn(); // Make the element visible
        //else
        //    $(element).fadeIn(); 
   }
}

ko.applyBindings(new AppViewModel(), document.getElementById('WeatherApp'));
