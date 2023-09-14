import $ from "jquery"

var $container = $('body');
var $drone = $('#fantasy-main');
var $section = $("#section-1")

var droneCenter = {
  x: $drone.width() / 2,
  y: $drone.height() / 2
};

// The Image moving
$container.on('mousemove', function(event) {
  var angleX = (event.offsetX - droneCenter.x) / $drone.width() * 15; // Adjust the angle to control the descent
  var angleY = (event.offsetY - droneCenter.y) / $drone.height() * 15; // Adjust the angle to control the descent

  $drone.css('transform', `rotate3d(1, 1, 1, ${angleX}deg) translateY(${angleY}px)`);
  $section.css("transform",`translate3d(${angleX}px, ${angleY}px, 0px)`)
});

$drone.on('mousemove', function(event) {
  var angleX = (event.offsetX - droneCenter.x) / $drone.width() * 15; // Adjust the angle to control the descent
  var angleY = (event.offsetY - droneCenter.y) / $drone.height() * 15; // Adjust the angle to control the descent

  $drone.css('transform', `rotate3d(1, 1, 1, ${angleX}deg) translateY(${angleY}px)`);
  $section.css("transform",`translate3d(${angleX}px, ${angleY}px, 0px)`)
});


