var apikey = "cacdf46eb92ee7bf1ff1db4b11b2e729"
var archive = JSON.parse(window.localStorage.getItem('archive')) || [];

$(document).ready(function() {
  $("#search-btn").on('click', function() {
      var citySearch = $('#city-input').val();
      $('#city-input').val('');
      SearchWeather(citySearch)
  }) 
  

  function SearchWeather(citySearch) {
      // added forecast 
      $("#forecast").empty()
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
                    // Empty Todays Weather Div to load new information without stacking
                    $("#todaysWeather").empty();
                    // Using momentJS to format the time value in minutes and change the format to MM-DD-YY format
                    var date = moment(data.current.dt, 'X').format("MM-DD-YY")
                    var card = $('<div>').addClass("card");
                    var cardBody = $("<div>").addClass('card-body');
                    var title = $('<h2>').text("City: " + citySearch + " (" + date + ")")
                    var img = $('<img>').attr("src", "https://openweathermap.org/img/w/"+ data.current.weather[0].icon+'.png')
                    var temp = $("<h6>").addClass("card-text").css('paddingTop', '20px').text('Temperature: ' + data.current.temp + " F")
                    var humid = $("<h6>").addClass("card-text").css('paddingTop', '20px').text('Humidity: ' + data.current.humidity + " %")
                    var wind = $("<h6>").addClass("card-text").css('paddingTop', '20px').text('Wind Speed: ' + data.current.wind_speed + " MPH")
                    var uviBtn = $("<button>").addClass('btn').attr('type', 'submit').text(data.current.uvi)
                    var uvIndex = $("<h6>").addClass('card-text').css('paddingTop', '20px').text("UV Index: ")
                    var forecastDate = moment(data.daily[1].dt, "X").format('L');
                    // console.log(data.daily.length -2);
                    // data check
                    if(data.current.uvi < 4) {
                        uviBtn.addClass("btn-success")
                    } else if(data.current.uvi < 7) {
                        uviBtn.addClass('btn-warning')
                    } else {
                        uviBtn.addClass('btn-danger')
                    }

                    title.append(img);
                    uvIndex.append(uviBtn);
                    cardBody.append(title, temp, humid, wind, uvIndex)
                    card.append(cardBody)

                    $("#todaysWeather").append(card)

                    //Forecast
                    // empty the forecast like we did for the todays weather div on line 32
                    // Do a for loop 5 times
                    for(i=1; i<data.daily.length - 2; i++){
                        var card = $("<div>").addClass("card col-md-2 m-2")
                        var humid = $("<div>").addClass("card-text").css('paddingTop', '20px').text('Humidity: ' + data.daily[i].humidity + " %")
                        var wind = $("<h6>").addClass("card-text").css('paddingTop', '20px').text('Wind Speed: ' + data.daily[i].wind_speed + " MPH")
                        let temp = $("<h6>").addClass("card-text").css('paddingTop', '20px').text('Temperature: ' + data.daily[i].temp.max + " F")
                        card.append(humid, wind, temp);


                        // console.log(data.daily[i].humidity)
                        $("#forecast").append(card)
                        
                        //data.daily[i].temp.max, data.daily[i].wind_speed, data.daily[i].humidity
                    }

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