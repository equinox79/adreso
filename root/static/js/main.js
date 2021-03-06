var latlonlist = undefined;
var map        = undefined;
var geocoder   = undefined;

var URL = {
    googlemaps : 'https://maps.google.com/?q=',
    adreso_hex : 'http://adre.so/h/',
    touch      : 'http://tou.ch/map/#!/target=all&lat=__lat__&lng=__lng__',
    yjmap_web  : 'http://map.yahoo.co.jp/maps?z=15&lat=__lat__&lon=__lng__',
    mapion_web : 'http://www.mapion.co.jp/m/%%lat%%_%%lng%%_8/',
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
  // UA判定
  navigator.userAgentObject = woothee.parse(navigator.userAgent);

  if( navigator.userAgentObject.os.match(/(iPhone|iOS|iPad|iPod|OSX)/).length > 0 ){
    $('#infoarea .ios').css('display', 'block');
  }
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
        var zone = GeoHex.getZoneByLocation( ll.lat(), ll.lng(), 11 );
        zone.drawHex(map, {linecolor:"#FF0000",fillcolor:"#FF8a00",popinfo:1});
        //$('#short_link').val(URL.adreso_hex + zone.code)

        // touchmapへのリンクを張り替え
	$('#touch_link').attr('href',
	    URL.touch.replace('__lat__', ll.lat()).replace('__lng__', ll.lng()));

        // Y!ロコへのリンクを張り替え
	$('#yjmap_web_link').attr('href',
	    URL.yjmap_web.replace('__lat__', ll.lat()).replace('__lng__', ll.lng()));

        // mapionへのリンクを張り替え
	//$('#mapion_web_link').attr('href',
	//    URL.mapion_web.replace('%%lat%%', ll.lat()).replace('%%lng%%', ll.lng()));

      } else {
        //alert("geocoder error:" + status);
        location.href = "/error";
      }
    }
  );
};
