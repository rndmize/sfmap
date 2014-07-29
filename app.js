var width = 700,
    height = 600;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var draw = function(name) {
  d3.json('sfmaps/' + name + '.json', function(error, sf) {
    if (error) {
      return console.error(error);
    }

    var projection = d3.geo.albers()
        .scale([250000])
        .translate([87450, 8620]);

    var path = d3.geo.path()
        .projection(projection);

    svg.append("g").classed(name, true);

    d3.select('.' + name).selectAll("path")
        .data(sf.features)
        .enter()
        .append("path")
        .attr("d", path);
  });
};

(function() {
  dset = ['neighborhoods', 'arteries', 'streets'];
  for (var i = 0; i < dset.length; i++) {
    draw(dset[i]);
  }
})();

$.ajax('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni', {
  success: function(data) {
    $('#routes').append('<ul class="col-one"></ul><ul class="col-two"></ul>');
    for (var i = 0; i < data.documentElement.children.length; i++) {
      var str = '<li>' + data.documentElement.children[i].getAttribute('title') + '</li>';
      if (i % 2) {
        $('.col-two').append(str);
      } else {
        $('.col-one').append(str);
      }
    }
  }
});

$.ajax('http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni', {
  success: function(data) {
    var geoRouteFeatures = [];
    for (var r = 0; r < data.documentElement.children.length; r++) {
      var route = data.documentElement.children[r];
      console.log(route.children);
      for (var i = 0; i < route.children.length; i++) {
        var routePoints = [];
        if (route.children[i].nodeName === 'path') {
          for (var j = 0; j < route.children[i].children.length; j++) {
            routePoints.push([route.children[i].children[j].getAttribute('lon'), route.children[i].children[j].getAttribute('lat'), 0.0]);
          }
          geoRouteFeatures.push({
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": routePoints
            }
          });
        }
      }
    }

    var projection = d3.geo.albers()
        .scale([250000])
        .translate([87450, 8620]);

    var path = d3.geo.path()
        .projection(projection);

    svg.append("g").classed('n', true);

    d3.select('.n').selectAll("path")
        .data(geoRouteFeatures)
        .enter()
        .append("path")
        .attr("d", path);
  }
});

$('#routes').on('mouseenter', 'li', function() {
  console.log(this);
});





