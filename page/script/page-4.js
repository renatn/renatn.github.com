try
{
    var coordinate=new google.maps.LatLng(29.760193,-95.36939);

    var mapOptions= 
    {
        zoom:10,
        center:coordinate,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var googleMap=new google.maps.Map(document.getElementById('map'),mapOptions);
}
catch(e) {}