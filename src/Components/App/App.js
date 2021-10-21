import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  searchResults: [
                    { name:'zungguzungguguzungguzeng ',
                      artist: 'Yellow Man',
                      album: 'Zungguzungguguzungguzeng!',
                      id: '1'
                    }, 
                    { name:'zungguzungguguzungguzeng ',
                    artist: 'Yellow Man',
                    album: 'Zungguzungguguzungguzeng!',
                    id: '2'}
                  ],
                  playlistName: "Jim's playlist",
                  playlistTracks: [ 
                    { name:'Morning Ride',
                      artist: 'Yellow Man',
                      album: 'Zungguzungguguzungguzeng!',
                      id: '5'
                    }, 
                    { name:'Morning Ride',
                      artist: 'Yellow Man',
                      album: 'Zungguzungguguzungguzeng!',
                      id: '6'}
                    ]
                  }
    this.addTrack = this.addTrack.bind(this);              
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  updatePlaylistName(name) {
    return this.setState({playlistName: name});
  }

  removeTrack(track) {
    let playlist = this.state.playlistTracks;
    playlist = playlist.filter(savedTrack => track.id !== savedTrack.id);
    return this.setState({playlistTracks: playlist});
    
  }


  addTrack(track) {
    let playlist = this.state.playlistTracks;
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      playlist.push(track);
      return this.setState({playlistTracks: playlist});
    }
  }

render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
            playlistname={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} 
            onNameChange={this.updatePlaylistName}  
            />
          </div>
        </div>
      </div>
    );
  } 
}

export default App;
