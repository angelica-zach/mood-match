// function to provide data on whether an artist is playing near-by.
// takes a single argument 'artist' which is the name of the artist as a string.

function searchArtistData(artist) {
  // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
  var queryURL =
    "https://rest.bandsintown.com/artists/" + artist + "?app_id=1234";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Printing the entire object to console
      console.log(data);
      $("#tour-dates")
        .attr("href", data.url)
        .text(data.name + " : See Tour Dates");
    });
}

//function to provide list of upcoming events for a specific artist.
// takes a single argument 'artist' which is the name of the artist as a string.
function searchEvents(artist) {
  // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
  const queryURL =
    "https://rest.bandsintown.com/artists/" + artist + "/events/?app_id=1234";
  let upcomingEvents = [];
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Printing the entire object to console
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        upcomingEvents.push({
          dateTime: data[i].datetime,
          dateTimeFormat: data[i].datetime_display_rule,
          city: data[i].venue.city,
          country: data[i].venue.country,
          latitude: data[i].venue.latitude,
          longitude: data[i].venue.longitude,
        });
      }

      console.log(upcomingEvents);
      // Store in Local Storage;
      localStorage.setItem(artist, JSON.stringify(upcomingEvents));

      // Let them know there are no tour dates
      if (upcomingEvents.length == 0) {
        let myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();
      } else {
        // Show what cities there are
        $("#moodPlaylistsContainer").empty();
        $("#moodPlaylistsContainer").removeClass("row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5");
        $("#moodPlaylistsContainer").append(
          "<h3> Upcoming Events for " + artist
        );
        // Get data from Local Storage
        let stored = localStorage.getItem(artist);
        let data = JSON.parse(stored);
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = dayjs(data[i].dateTime).format("dddd, MMMM D, YYYY");
          let time = dayjs(data[i].dateTime).format("h A");

          $("#moodPlaylistsContainer").append(
            "<div class='card text-bg-light m-3 p-3 col-2'>"
          );
          $("#moodPlaylistsContainer")
            .children()
            .eq(i + 1)
            .append(
              "<h5 class=card-title>" + data[i].city + ", " + data[i].country
            );
          $("#moodPlaylistsContainer")
            .children()
            .eq(i + 1)
            .append("<p class=card-text>" + date);
          $("#moodPlaylistsContainer")
            .children()
            .eq(i + 1)
            .append("<p class=card-text>" + time);
        }
      }

      return upcomingEvents;
    });
}
