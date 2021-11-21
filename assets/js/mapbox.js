

mapboxgl.accessToken = 'pk.eyJ1IjoibWZpbm41MjUiLCJhIjoiY2t3OW1qZzY5M3ZkZDJ2cGF2bWFhZjRhYSJ9.aLJaiEiSi1K3DLoJEnmA0Q';

// creates the map
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [38.5382,-90], // starting position [lng, lat]
zoom: 9 // starting zoom
});

var mapDiv = document.body.appendChild(document.createElement('div'));
mapDiv.style = 'position:absolute;top:0;right:0;left:0;bottom:0;';

var MapboxDirections = function (){
    constructor(options);
      this.actions = bindActionCreators(actions, store.dispatch);
      this.actions.setOptions(options || {});
      this.options = options || {};
   
    this.onDragDown = this._onDragDown.bind(this);
    this.onDragMove = this._onDragMove.bind(this);
    this.onDragUp = this._onDragUp.bind(this);
    this.move = this._move.bind(this);
    this.onClick = this._clickHandler().bind(this);
  };


  onAdd(map) {
    this._map = map;

    const { controls } = store.getState();

    var el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-directions mapboxgl-ctrl';

    // Add controls to the page
    const inputEl = document.createElement('div');
    inputEl.className = 'directions-control directions-control-inputs';
    new Inputs(inputEl, store, this.actions, this._map);

    const directionsEl = document.createElement('div');
    directionsEl.className = 'directions-control directions-control-instructions';

    new Instructions(directionsEl, store, {
      hoverMarker: this.actions.hoverMarker,
      setRouteIndex: this.actions.setRouteIndex
    }, this._map);

//     if (controls.inputs) el.appendChild(inputEl);
//     if (controls.instructions) el.appendChild(directionsEl);

//     this.subscribedActions();
//     if (this._map.loaded()) this.mapState()
//     else this._map.on('load', () => this.mapState());

//     return el;
//   };
  
  onRemove(map => {
    this.container.parentNode.removeChild(this.container);
    this.removeRoutes();
    map.off('mousedown', this.onDragDown);
    map.off('mousemove', this.move);
    map.off('touchstart', this.onDragDown);
    map.off('touchstart', this.move);
    map.off('click', this.onClick);
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
      delete this.storeUnsubscribe;
    }
    directionsStyle.forEach((layer) => {
      if (map.getLayer(layer.id)) map.removeLayer(layer.id);
    });

    if (map.getSource('directions')) map.removeSource('directions');

    this._map = null;
    return this;
  });

  mapState() {
    const { profile, alternatives, congestion, styles, interactive, compile } = store.getState();

    // Emit any default or option set config
    this.actions.eventEmit('profile', { profile });

    const geojson = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    };
       // Add and set data theme layer/style
    this._map.addSource('directions', geojson);

    // Add direction specific styles to the map
    if (styles && styles.length) styles.forEach((style) => this._map.addLayer(style));
    directionsStyle.forEach((style) => {
      // only add the default style layer if a custom layer wasn't provided
      if (!this._map.getLayer(style.id)) this._map.addLayer(style);
    });


    if (interactive) {
      this._map.on('mousedown', this.onDragDown);
      this._map.on('mousemove', this.move);
      this._map.on('click', this.onClick);

      this._map.on('touchstart', this.move);
      this._map.on('touchstart', this.onDragDown);
    }
  };


  subscribedActions() {
    this.storeUnsubscribe = store.subscribe(() => {
      const {
        origin,
        destination,
        hoverMarker,
        directions,
        routeIndex
      } = store.getState();

      const geojson = {
        type: 'FeatureCollection',
        features: [
          origin,
          destination,
          hoverMarker
        ].filter((d) => {
          return d.geometry;
        })
      };

      if (directions.length) {
        directions.forEach((feature, index) => {

          const features = [];

          const decoded = decode(feature.geometry, 5).map(function(c) {
            return c.reverse();
          });

          decoded.forEach(function(c, i) {
            var previous = features[features.length - 1];
            var congestion = feature.legs[0].annotation && feature.legs[0].annotation.congestion && feature.legs[0].annotation.congestion[i - 1];

            if (previous && (!congestion || previous.properties.congestion === congestion)) {
              previous.geometry.coordinates.push(c);
            } else {
              var segment = {
                geometry: {
                  type: 'LineString',
                  coordinates: []
                },
                properties: {
                  'route-index': index,
                  route: (index === routeIndex) ? 'selected' : 'alternate',
                }
              };
             // New segment starts with previous segment's last coordinate.
             if (previous) segment.geometry.coordinates.push(previous.geometry.coordinates[previous.geometry.coordinates.length - 1]);

             segment.geometry.coordinates.push(c);

             if (congestion) {
               segment.properties.congestion = feature.legs[0].annotation.congestion[i - 1];
             }

             features.push(segment);
           }
         });

         geojson.features = geojson.features.concat(features);

         if (index === routeIndex) {
           // Collect any possible waypoints from steps
           feature.legs[0].steps.forEach((d) => {
             if (d.maneuver.type === 'waypoint') {
               geojson.features.push({
                 type: 'Feature',
                 geometry: d.maneuver.location,
                 properties: {
                   id: 'waypoint'
                 }
               });
             }
           });
         }

       });
     }

     if (this._map.style && this._map.getSource('directions')) {
       this._map.getSource('directions').setData(geojson);

    }
});
}

_clickHandler=function() {
var timer = null;
var delay = 250;
return function(event) {
  if (!timer) {
    var singleClickHandler = this._onSingleClick.bind(this);

    timer = setTimeout(function() {
      singleClickHandler(event);
      timer = null;
    }, delay);

  } else {
    clearTimeout(timer);
    timer = null;
    this._map.zoomIn();
  }
};
}

_onSingleClick(e)=function() {
const { origin } = store.getState();
const coords = [e.lngLat.lng, e.lngLat.lat];

if (!origin.geometry) {
  this.actions.setOriginFromCoordinates(coords);
} else {

  const features = this._map.queryRenderedFeatures(e.point, {
    layers: [
      'directions-origin-point',
      'directions-destination-point',
      'directions-waypoint-point',
      'directions-route-line-alt'
    ]
  });

  if (features.length) {
// Remove any waypoints
features.forEach((f) => {
    if (f.layer.id === 'directions-waypoint-point') {
      this.actions.removeWaypoint(f);
    }
  });

  if (features[0].properties.route === 'alternate') {
    const index = features[0].properties['route-index'];
    this.actions.setRouteIndex(index);
  }
} else {
  this.actions.setDestinationFromCoordinates(coords);
  this._map.flyTo({ center: coords });
}
}
}

_move(e) {
const { hoverMarker } = store.getState();

const features = this._map.queryRenderedFeatures(e.point, {
layers: [
  'directions-route-line-alt',
  'directions-route-line',
  'directions-origin-point',
  'directions-destination-point',
  'directions-hover-point'
]
});

this._map.getCanvas().style.cursor = features.length ? 'pointer' : '';
if (features.length) {
    this.isCursorOverPoint = features[0];
    this._map.dragPan.disable();

    // Add a possible waypoint marker when hovering over the active route line
    features.forEach((feature) => {
      if (feature.layer.id === 'directions-route-line') {
        this.actions.hoverMarker([e.lngLat.lng, e.lngLat.lat]);
      } else if (hoverMarker.geometry) {
        this.actions.hoverMarker(null);
      }
    });

  } else if (this.isCursorOverPoint) {
    this.isCursorOverPoint = false;
    this._map.dragPan.enable();
  }
}

_onDragDown() {
  if (!this.isCursorOverPoint) return;
  this.isDragging = this.isCursorOverPoint;
  this._map.getCanvas().style.cursor = 'grab';

  this._map.on('mousemove', this.onDragMove);
  this._map.on('mouseup', this.onDragUp);

  this._map.on('touchmove', this.onDragMove);
  this._map.on('touchend', this.onDragUp);
}

_onDragMove(e) {
  if (!this.isDragging) return;

  const coords = [e.lngLat.lng, e.lngLat.lat];
  switch (this.isDragging.layer.id) {
    case 'directions-origin-point':
      this.actions.createOrigin(coords);
    break;
    case 'directions-destination-point':
      this.actions.createDestination(coords);
    break;
    case 'directions-hover-point':
      this.actions.hoverMarker(coords);
    break;
  }
}
_onDragUp() {
    if (!this.isDragging) return;

    const { hoverMarker, origin, destination } = store.getState();

    switch (this.isDragging.layer.id) {
      case 'directions-origin-point':
        this.actions.setOriginFromCoordinates(origin.geometry.coordinates);
      break;
      case 'directions-destination-point':
        this.actions.setDestinationFromCoordinates(destination.geometry.coordinates);
      break;
      case 'directions-hover-point':
        // Add waypoint if a sufficent amount of dragging has occurred.
        if (hoverMarker.geometry && !utils.coordinateMatch(this.isDragging, hoverMarker)) {
          this.actions.addWaypoint(0, hoverMarker);
        }
      break;
    }

    this.isDragging = false;
    this._map.getCanvas().style.cursor = '';

    this._map.off('touchmove', this.onDragMove);
    this._map.off('touchend', this.onDragUp);

    this._map.off('mousemove', this.onDragMove);
    this._map.off('mouseup', this.onDragUp);
  }



// remove control
var button = document.body.appendChild(document.createElement('button'));
button.style = 'z-index:10;position:absolute;top:10px;right:10px;';
button.textContent = 'Remove directions control';

// remove all waypoints
var removeWaypointsButton = document.body.appendChild(document.createElement('button'));
removeWaypointsButton.style = 'z-index:10;position:absolute;top:30px;right:10px;';
removeWaypointsButton.textContent = 'Remove all waypoints';

// directions
var directions = new MapboxDirections({
  accessToken: window.localStorage.getItem('MapboxAccessToken'),
  unit: 'metric',
  profile: 'mapbox/cycling'
});
window.directions = directions;

map.addControl(directions, 'top-left');

map.on('load', () => {
  button.addEventListener('click', function() {
    map.removeControl(directions);
  });

  removeWaypointsButton.addEventListener('click', function() {
    directions.removeRoutes();
  });
});



// map.addControl(new mapboxgl.NavigationControl());

// //locate yourself button
// map.addControl(new mapboxgl.GeolocateControl({
//     positionOptions: {
//         enableHighAccuracy: true
//     },
//     trackUserLocation: true
// }));


// //adds directions box under map
// var directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken
// });
// console.log(directions);
// document.getElementById('directions').appendChild(directions.onAdd(map));


// //this will get us the api calls from the tools
// directions.on('route', function (ev) {
//     //gives route api object
//     console.log(ev.route);
//     //logs the origin point
//     console.log(directions.getOrigin());
//     //logs destination point.
//     console.log(directions.getDestination());

//     var destination = directions.getDestination();
//         destLoc = destination.geometry.coordinates;
//         locationCoordinates = destLoc[1] + "," + destLoc[0];
//         //destLoc is an array with long at destLoc[0] and lat at destLoc[1]
//         console.log(locationCoordinates);
//     });