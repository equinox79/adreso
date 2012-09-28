var latlonlist = undefined;
var map = undefined;

var URL = {
    googlemaps : 'https://maps.google.com/?q=',
    adreso_hex : 'http://adre.so/h/',
    touch      : 'http://tou.ch/map/#!/target=all&lat=__lat__&lng=__lng__'
};

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
	var ll = results[0].geometry.location;
        var marker = new google.maps.Marker({
            position: ll,
            map: map
        });

        // hex
        var zone = GeoHex.getZoneByLocation( ll.Xa, ll.Ya, 11 );
        zone.drawHex(map, {linecolor:"#FF0000",fillcolor:"#FF8a00",popinfo:1});
        $('#short_link').val(URL.adreso_hex + zone.code)

        // google mapへのリンクを張り替え
	$('#google_link').attr('href', URL.googlemaps + ll.Xa + ',' + ll.Ya);

        // touchmapへのリンクを張り替え
	$('#touch_link').attr('href',
	    URL.touch.replace('__lat__', ll.Xa).replace('__lng__', ll.Ya));

      } else {
        alert("geocoder error:" + status);
      }
    }
  );
}

