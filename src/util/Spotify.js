let accessToken;
const clientID = 'GET YOUR OWN API KEY'
const redirectURL = 'http://jumboindex-jammming.surge.sh'//'http://localhost:3000'

const Spotify = {
    
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } 
        // check for access token match and expiry time.

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
             // clears the parameters so we can grab a new access token when it expires.
             window.setTimeout(()=> accessToken = '', expiresIn * 1000);
             window.history.pushState('Access Token', null, '/')
             return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`
            window.location = accessURL;
        }
    },

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        const apiEndpoint = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`
        
        return fetch(apiEndpoint, {headers:{
                                            Authorization: `Bearer ${accessToken}`
                                            }
                                    }).then( response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('request failed')
            }
        }, networkError => console.log(networkError.message)).then(jsonResponse  =>  {
            if (!jsonResponse.tracks) {
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        const apiEndpoint = 'https://api.spotify.com/v1/me'

        let userId;

        return fetch(apiEndpoint, {headers: headers}).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('request failed');
            }
        }, networkError => console.log(networkError.message)).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})

            }).then(response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('request failed');
                }
            }, networkError => console.log(networkError.message)).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, 
                {headers: headers,
                method: 'POST',
                body: JSON.stringify({uris: trackUris})})
            })
        })
    }

}

export default Spotify;