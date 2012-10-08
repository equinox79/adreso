var latlonlist = undefined;
var map        = undefined;
var geocoder   = undefined;

var URL = {
    googlemaps : 'https://maps.google.com/?q=',
    adreso_hex : 'http://adre.so/h/',
    touch      : 'http://tou.ch/map/#!/target=all&lat=__lat__&lng=__lng__',
    address_normalize : 'https://api.loctouch.com/v1/geo/address_normalize',
};

function initialize(addrString) {
  // ジオコーダオブジェクト生成
  geocoder = new google.maps.Geocoder();
  // 住所文字列の正規化-->ジオコーディングとページ生成へ
  addr_normalize({
    address  : addrString,
    callback : geocoding_and_rendering
  });
}

function addr_normalize(params) {
  $.ajax({
    type : 'GET',
    url  : URL.address_normalize,
    data : {
      address  : params.address,
    },
    dataType : 'jsonp',
    success  : params.callback,
    error    : function(result){
      alert(result);
    }
  });
}

function geocoding_and_rendering(result_json) {

  var addr_str = result_json.result.address;
  $('#addr').text(addr_str);

  geocoder.geocode(
    { address: addr_str },
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
        //alert("geocoder error:" + status);
        location.href = "/error";
      }
    }
  );
};
