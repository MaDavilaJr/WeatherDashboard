var apikey = "cacdf46eb92ee7bf1ff1db4b11b2e729"
var archive = JSON.parse(window.localStorage.getItem('archive')) || [];
$(document).ready(function() {
  $("#search-btn").on('click', function() {
      var citySearch = $('#city-input').val();
      $('#city-input').val('');
      SearchWeather(citySearch)
  }) 
  
  function SearchWeather(citySearch) {
      $.ajax({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apikey}&units=imperial`,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            // Conditional statement to check if the last search appears in our archive array
            if(archive.indexOf(citySearch) === -1) {
                archive.push(citySearch);
                window.localStorage.setItem("archive", JSON.stringify(archive))
            }
            $.ajax({
                method: 'GET',
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`,
                dataType: 'json',
                success: function(data) {
                    console.log(data)
                    // Using momentJS to format the time value in minutes and change the format to MM-DD-YY format
                    var date = moment(data.current.dt, 'mm').format("MM-DD-YY")
                    console.log(date)
                }
            })
        }
      })
  }

})

// create element (temp/humi??)
// 

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}