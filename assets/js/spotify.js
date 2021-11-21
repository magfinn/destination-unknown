const APIController = (function() {
    $("#back").css('display','none');
    
    const clientId = '51e024a2658f4e14871696389e01d29d';
    const clientSecret = '182cbc420d1c4785b239492ab1dede74';
    
    // Private Methods
    const getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    const getGenre = async (token) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.categories.items;
    }   

    const getPlayslistxgenre = async (token, genreId) => {
            const limit = 10;
            const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.playlists.items;
    }

    const getSongs = async (token, tracksEndPoint) => {
        const limit = 10;
        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.items;
    }

    const getSong = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return getToken();
        },
        getGenres(token) {
            return getGenre(token);
        },
        getPlaylistByGenre(token, genreId) {
            return getPlayslistxgenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return getSongs(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return getSong(token, trackEndPoint);
        }
    }
})();

const UIController = (function() {

    //Object to hold id to html
    const elementID = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {
        //Get input fields
        inputField() {
            return {
                genre: document.querySelector(elementID.selectGenre),
                playlist: document.querySelector(elementID.selectPlaylist),
                tracks: document.querySelector(elementID.divSonglist),
                submit: document.querySelector(elementID.buttonSubmit),
                songDetail: document.querySelector(elementID.divSongDetail)
            }
        },
        // Create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(elementID.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(elementID.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // Create a track list group item 
        createTrack(id, name) {
            const html = `<a href="#" class="listitem" id="${id}">${name}</a>`;
            document.querySelector(elementID.divSonglist).insertAdjacentHTML('beforeend', html);
        },
        // Create the song description
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(elementID.divSongDetail);
            const html = 
            `
            <div id="image">
                <img src="${img}" alt="">        
            </div>
            <div class="text">
            <div class="song-detail-text">
                <label for="Genre">${title}:</label>
            </div>
            <div class="song-detail-text">
                <label for="artist">By ${artist}:</label>
            </div> 
            </div>
            `;
            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(elementID.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(elementID.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // Go back button to show form again
    $("#back").on('click',function(){
        $("#form").css('display','block');
        $("#back").css('display','none');
        $("#song-detail").css('display','none');
    });
    

    // Elements id

    const DOMInputs = UICtrl.inputField();
    // Get genres 
    const loadGenres = async () => {
        //Get token
        const token = await APICtrl.getToken();           
        //Store token
        UICtrl.storeToken(token);
        //Get genres
        const genres = await APICtrl.getGenres(token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    // create genre change event listener
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        //Get token
        const token = UICtrl.getStoredToken().token;        
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;       
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
     

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // Prevent page reset
        $("#form").css('display','none');
        $("#title").text("Pick a song...");
        $("#song-list-hide").css('display','flex');

        e.preventDefault();
        // Clear tracks
        UICtrl.resetTracks();
        //Get token
        const token = UICtrl.getStoredToken().token;        
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {        
        $("#song-list-hide").css('display','none');
        $("#back").css('display','block');
        $("#title").text("Go back to discover more...");
        $("#song-detail").css('display','block');

        // Prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        //Get token
        const token = UICtrl.getStoredToken().token;
        const trackEndpoint = e.target.id;
        const track = await APICtrl.getTrack(token, trackEndpoint);
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    

    return {
        init() {
            loadGenres();
        }
    }

})(UIController, APIController);

// Method to load the genres on page load
APPController.init();

