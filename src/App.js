import React, { Component } from 'react';
import geolib from 'geolib';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isLoading: true,
      sortByDist: null,
      sortByRooms: null,
      sortByStreet: null,
      closestHouse: null,
    }
    
  }

  componentWillMount() {
    fetch('https://demo.interfacema.de/programming-assessment-1.0/buildings')
      .then(response => response.json())
      .then(data => {
        var hss = data.houses;
        var newHs = {};
        for (var h in hss) {
          var lat = hss[h].coords.lat;
          var lon = hss[h].coords.lon;
          var dis = geolib.getDistance(
            {latitude: 52.542086, longitude: 13.407959},
            {latitude: lat, longitude: lon},
        );
        newHs = { ...newHs, [h]: {...hss[h], dis}};
      };
      this.setState({ data: { ...newHs }},
        () => this.createLists());
      } );
  };

createLists() {
  var arr = [];
for (var key in this.state.data) {
  arr.push(this.state.data[key]);
};
this.sortByDis(arr);
this.sortByRooms(arr);
this.sortByStreet(arr);
}

sortByDis(arr) {
  arr.sort(function(obj1, obj2) {
    return obj1.dis - obj2.dis;
  });
  this.setState({ sortByDist: arr},
    () => this.closestHouse())
}

sortByRooms(arr) {
  var sorted = [];
  arr.forEach(e => {
    if (e.params && e.params.rooms > 5) {
      sorted.push(e);
    }
  });
  sorted.sort(function(obj1, obj2) {
    return obj1.params.rooms - obj2.params.rooms;
  });
  this.setState({ sortByRooms: sorted})
}

sortByStreet(arr){
  var sorted = [];
  arr.forEach(e => {
    if (!e.params || !e.params.rooms || !e.params.value) {
      sorted.push(e);
    }
  });
  sorted.sort(function(obj1, obj2) {
    return obj1.street > obj2.street;
  });
  this.setState({ sortByStreet: sorted})
}

closestHouse() {
  var houses = this.state.sortByDist;
  
  houses.forEach(e => {
    if (e.params && e.params.value <= 5000000 && e.params.rooms >= 10){
      this.setState({ closestHouse: e, isLoading: false})
    }
  });
}

  render() {
    console.log(this.state.closestHouse);

    return (
      <div className="container-fluid" style = {{ paddingTop: '50px' }}>
      <div className={'row'}>
      <div className={'col-md-4 d-inline'}>
      <h5 className={'text-center'}>Sorted by distance to sister's home</h5>
      <table className={'table table-bordered table-striped'}>
        <thead>
          <tr>
          <th>Address</th>
          <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          { !this.state.isLoading && this.state.sortByDist.map((item, i) => {
            return (
            <tr key={i}>
            <td>
              {item.street}
            </td>
            <td>
              {item.dis} metres
            </td>
            </tr>
            )
            
          })}
          
        </tbody>

      </table>
      </div>
      <div className={'col-md-4 d-inline'}>
      <h5 className={'text-center'}>Houses with more than 5 rooms</h5>
      <table className={'table table-bordered table-striped'}>
        <thead>
          <tr>
          <th>Address</th>
          <th>Rooms</th>
          </tr>
        </thead>
        <tbody>
          { !this.state.isLoading && this.state.sortByRooms.map((item, i) => {
            return (
            <tr key={i}>
            <td>
              {item.street}
            </td>
            <td>
              {item.params.rooms}
            </td>
            </tr>
            )
            
          })}
          
        </tbody>

      </table>
      </div>
      <div className={'col-md-4 d-inline'}>
      <h5 className={'text-center'}>Houses without all data</h5>
      <table className={'table table-bordered table-striped'}>
        <thead>
          <tr>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          { !this.state.isLoading && this.state.sortByStreet.map((item, i) => {
            return (
            <tr key={i}>
            <td>
              {item.street}
            </td>
            </tr>
            )
            
          })}
          
        </tbody>

      </table>
      </div>
      </div>
      <div className={'text-center'}>
        <h4>Closest House</h4>
        { !this.state.isLoading &&
          <p>Closest house is located at <b>{this.state.closestHouse.street}</b>,
          it has <b>{this.state.closestHouse.params.rooms} rooms</b> and costs
          <b> {this.state.closestHouse.params.value} Euro</b>.</p>
        }
        
      </div>
      </div>
    );
  }
}

export default App;
