$(document).ready(function () {

    let calm = $("#calm");
    let chill = $("#chill");
    let concentrate = $("#concentrate");
    let energised = $("#energised");
    let euphoric = $("#euphoric");
    let groovy = $("#groovy");
    let nostalgic = $("#nostalgic");
    let random = $("#random");

    let moodPlaylistsContainer = $("#moodPlaylistsContainer");

    // Function to search for moods
    function search(searchValue) {
        authenticateSpotify()
            .then((accessToken) => {
                const searchEndpoint = `https://api.spotify.com/v1/search?q=${searchValue}&type=playlist`;

                return $.ajax({
                    url: searchEndpoint,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            })
            .then((response) => {
                const playlists = response.playlists.items;

                // Only Render the first playlist
                if (playlists.length > 0) {
                    renderMoodPlaylist(playlists[0]);
                }
            })
            .catch((error) => {
                console.error("Error searching for playlists:", error);
            });
    }

    function authenticateSpotify() {
        // REPLACE CLIENT ID
        const clientId = "32d73e004d394cde9908ed44bb84ecf0";
        const clientSecret = "dc306bcd04bb4d3c9d538a086c448a04";

        const base64Credentials = btoa(`${clientId}:${clientSecret}`);

        return $.ajax({
            type: "POST",
            url: "https://accounts.spotify.com/api/token",
            data: "grant_type=client_credentials",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${base64Credentials}`,
            },
        })
            .then((response) => response.access_token)
            .catch((error) => {
                console.error("Error authenticating with Spotify:", error);
                throw error;
            });

    }

     // Get Tracks to show on search
    function renderMoodPlaylist(playlist) {
        getPlaylistTracks(playlist.id);
    }

    
    //API Calls for each Track, Make HTML Elements
    function getPlaylistTracks(playlistId) {

        authenticateSpotify()
            .then((accessToken) => {
                const playlistTracksEndpoint =
                    "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

                return $.ajax({
                    url: playlistTracksEndpoint,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            })
            .then((response) => {
              const tracks = response.items;
              moodPlaylistsContainer.empty(); // Clear previous content

              tracks.forEach((track) => {

                // Display image for each track
                let albCov = $("<img>").attr(
                  "src",
                  track.track.album.images[0].url
                );
                albCov.addClass("col-sm-6 col-md-4 col-lg-3") ;
                moodPlaylistsContainer.append(albCov);

                // If they like the song, show events
                albCov.on("click", function() {
                    searchEvents(track.track.artists[0].name);
                });

              });
            })
            .catch((error) => {
                console.error("Error retrieving playlist tracks:", error);
            });
    };

    calm.on("click", search("calm"));
    chill.on("click", search("chill"));
    concentrate.on("click", search("concentrate"));
    energised.on("click", search("energised"));
    euphoric.on("click", search("euphoric"));
    groovy.on("click", search("groovy"));
    nostalgic.on("click", search("nostalgic"));
    random.on("click", search("random"));
    console.log(moodPlaylistsContainer);

});
