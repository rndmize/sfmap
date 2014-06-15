var width = 600,
    height = 600;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json('sfmaps/neighborhoods.json', function(error, sf) {
  if (error) {
    return console.error(error);
  }

  var projection = d3.geo.albers()
      .scale([200000])
      .translate([width/2 + 69700,height/2 + 6650]);

  var path = d3.geo.path()
      .projection(projection);

  svg.selectAll("path")
      .data(sf.features)
      .enter()
      .append("path")
      .attr("d", path);
});

$.ajax('http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&r=N&t=1144953500233', {
  success: function(data) {
    console.log(data);
    // console.log(data.documentElement.children);
  }
});

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