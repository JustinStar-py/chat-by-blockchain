if (window.innerWidth > 600) {
    var $container = $('html');
    var $drone = $('.fantasy-img');
    var $sectionOne = $("#section-1")
    var $sectionTwo = $("#section-2")
    var $sectionThree = $("#section-3")

    var droneCenter = {
      x: $drone.width() / 2,
      y: $drone.height() / 2
    };

    // The Image moving
    $drone.css('transition', 'transform 0.07s ease-in-out');
    $sectionOne.css('transition', 'transform 0.3s ease');
    $sectionTwo.css('transition', 'transform 0.3s ease');
    $sectionThree.css('transition', 'transform 0.3s ease');

    $container.on('mousemove', function(event) {
      var angleX = (event.offsetX - droneCenter.x) / $drone.width() * 16; // Adjust the angle to control the descent
      var angleY = (event.offsetY - droneCenter.y) / $drone.height() * 16; // Adjust the angle to control the descent
    
      $drone.css('transform', `rotate3d(1, 1, 1, ${angleX}deg) translateY(${angleY}px)`);
    });

    $sectionOne.on('mousemove', function(event) {
      var angleX = (event.offsetX - droneCenter.x) / $drone.width() * 20; // Adjust the angle to control the descent
      var angleY = (event.offsetY - droneCenter.y) / $drone.height() * 10; // Adjust the angle to control the descent
      
      $sectionOne.css("transform",`translate3d(${angleX}px, ${angleY}px, 0px)`)
    });

    $sectionTwo.on('mousemove', function(event) {
      var angleX = (event.offsetX - droneCenter.x) / $drone.width() * 20; // Adjust the angle to control the descent
      var angleY = (event.offsetY - droneCenter.y) / $drone.height() * 10; // Adjust the angle to control the descent

      $sectionTwo.css("transform",`translate3d(${angleX}px, ${angleY}px, 0px)`)
    });

    $sectionThree.on('mousemove', function(event) {
        var angleX = (event.offsetX - droneCenter.x) / $drone.width() * 20; // Adjust the angle to control the descent
        var angleY = (event.offsetY - droneCenter.y) / $drone.height() * 10; // Adjust the angle to control the descent
      
        $sectionThree.css("transform",`translate3d(${angleX}px, ${angleY}px, 0px)`)
      });

}