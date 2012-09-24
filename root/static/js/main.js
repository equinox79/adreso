var latlonlist = undefined;
var map = undefined;

function initialize(addrString) {

  // 住所文字列から緯度経度
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    { address: addrString },
    function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        latlonlist = results;
        var myOptions = {
          zoom: 17,
          center: results[0].geometry.location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        // マーカー
        var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map
        });
      } else {
        alert("geocoder error:" + status);
      }
    }
  );
}

