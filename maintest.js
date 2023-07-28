//kl coordinates=16.3530921,81.0421491
var map = L.map("map").setView([15.221039,79.897149],9);
L.tileLayer('https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=KlYmGsrhwo5JVGHwz1sL', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);
document.getElementById('lat').value = '';
document.getElementById('lon').value = '';
var myMarker=L.marker([15.221039,79.897149], {title: "Coordinates", alt: "Coordinates", draggable: true}).addTo(map).on('dragend', function() {
    //var lat = myMarker.getLatLng().lat.toFixed(8);
    //var lon = myMarker.getLatLng().lng.toFixed(8);
    //var czoom = map.getZoom();
    //if(czoom < 18) { nzoom = czoom + 2; }
    //if(nzoom > 18) { nzoom = 18; }
    //if(czoom != 18) { map.setView([lat,lon], nzoom); } else { map.setView([lat,lon]); }
    //document.getElementById('lat').value = lat;
    //  document.getElementById('lon').value = lon;
    myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon);
});
const ic=L.icon({
    iconUrl :'thunder.png',
    iconSize : [50,50]    
});
var markers=[];
var markedLocations=[[16.1809,81.1303],[16.5062,80.6480],[13.6288,79.4192],[18.2949,83.8938],[17.0005,81.8040],[17.6868,83.2185],[14.4426,79.9865],
    [17.2473,80.1514],[16.7488,78.0035],[16.5449,81.5212],[15.8107,79.9724],[16.7850,80.8488],[16.4344,80.9931],[16.6356,80.9716],[16.4760,79.4394],
    [16.9563,81.2560],[17.2789,82.4012]
];
var copy=[[16.1809,81.1303],[16.5062,80.6480],[13.6288,79.4192],[18.2949,83.8938],[17.0005,81.8040],[17.6868,83.2185],[14.4426,79.9865],
    [17.2473,80.1514],[16.7488,78.0035],[16.5449,81.5212],[15.8107,79.9724],[16.7850,80.8488],[16.4344,80.9931],[16.6356,80.9716],[16.4760,79.4394],
    [16.9563,81.2560],[17.2789,82.4012]
];
for(var i=0;i<markedLocations.length;i++) {
    markers[i]=L.marker(markedLocations[i],{icon:ic}).addTo(map);
}
function chooseAddr(lat1, lng1)
{
    myMarker.closePopup();
    map.setView([lat1, lng1],18);
    myMarker.setLatLng([lat1, lng1]);
    lat = lat1.toFixed(8);
    lon = lng1.toFixed(8);
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
    myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();
}

function myFunction(arr)
{
    var out = "<br />";
    var i;

    if(arr.length > 0)
    {
        for(i = 0; i < arr.length; i++)
        {
            out += "<div class='address' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " + arr[i].lon + ");showRoute();return false;'>" + arr[i].display_name + "</div>";
        }
        document.getElementById('results').innerHTML = out;
    }
    else
    {
        document.getElementById('results').innerHTML = "Sorry, no results...";
    }

}

function addr_search()
{
    var inp = document.getElementById("addr");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
    xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var myArr = JSON.parse(this.responseText);
            myFunction(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

        var deltaLat = lat2 - lat1;
        var deltaLon = lon2 - lon1;

        var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var EARTH_RADIUS = 6371;
        return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}
function dynamicRoute(src,dest) {
    if(src==dest) {
        alert("src==dest");
        return;
    
    } else if(copy==[])  {
        alert("empty copy");
        L.Routing.control({
            waypoints: [
                L.latLng(...src),
                L.latLng(...dest),
            ]
        }).addTo(map);
        return;
    }else {
        if(dest[0]>src[0]) {
            var latDiff=dest[0]-src[0];
            if(dest[1]>src[1]) {
                var lonDiff=dest[1]-src[0];
            } else {
                var lonDiff=src[1]-dest[1];
            }
        } else {
            var latDiff=src[0]-dest[0];
            if(dest[1]>src[1]) {
                var lonDiff=dest[1]-src[0];
            } else {
                var lonDiff=src[1]-dest[1];
            }
        }
        if(latDiff>lonDiff) {
            if(dest[0]>src[0]) {
                copy=copy.filter(function check(s) {
                    return s[0]>src[0];
                });
            } else {
                copy=copy.filter(function check(s) {
                    return s[0]<src[0];
                });
            }
        } else {
            if(dest[1]>src[1]) {
                copy=copy.filter(function chekc(s) {
                    return s[1]>src[1];
                });
            } else {
                copy=copy.filter(function check(s) {
                    return s[1]<src[1];
                });
            }
        }
        
        /*if(dest[0]>src[0]) {
            if(dest[1]>src[1]) {
                copy=copy.filter(function check(s) {
                    return s[1]>src[1]
                });
            } else {
                copy=copy.filter(function check(s) {
                    return s[1]>src[1]
                });
            }
            copy=copy.filter(function check(s) {
                return s[0]>src[0]
            });
        } else {
            if(dest[1]>src[1]) {
                copy=copy.filter(function check(s) {
                    return s[1]>src[1]
                });
            } else {
                copy=copy.filter(function check(s) {
                    return s[1]>src[1]
                });
            }
            copy=copy.filter(function check(s) {
                return s[0]<src[0]
            });
        } */
        
        var min = getDistance(src,dest);
        var comp= getDistance(src,copy[0]);
        var minIndex=0;
        for(var i=1;i<copy.length;i++) {
            if(comp>getDistance(src,copy[i])) {
                comp=getDistance(src,copy[i]);
                minIndex=i;
            }
        }
        //alert("min is"+min);
        //alert("comp is"+comp);
        if(min<comp) {
            alert("working less than");
            L.Routing.control({
                waypoints: [
                    L.latLng(...src),
                    L.latLng(...dest),
                ]
            }).addTo(map);
            //return;
        } else {
            
            L.Routing.control({
                waypoints: [
                    L.latLng(...src),
                    L.latLng(...copy[minIndex]),
                ]
            }).addTo(map);
            src=copy[minIndex];
            //copy.splice(minIndex,1);
            dynamicRoute(src,dest);
            
        }
    }
}
            /*var points=[[16.1809,81.1303],[16.5062,80.6480],[16.7724,80.2859],[16.2359,80.0496],[17.0005,81.8040],[16.236719,80.647476],[16.5449,81.5212],[15.8107,79.9724],[16.7850,80.8488]];
            var distances=[];
            var copyDistances=[];
            for(let i=0;i<points.length;i++) {
               distances.push(getDistance([16.4961434,80.5006358],points[i]));
               copyDistances.push(distances[i]); 
            }*/
            //var marker2=L.marker([16.3530921,81.0421419]).addTo(map);
            //var marker2=L.marker([16.3530921,81.0421419]).addTo(map);
            function showRoute() {
                var dlat=document.getElementById('lat').value;
                var dlon=document.getElementById('lon').value;
                dlat=parseFloat(dlat);
                dlon=parseFloat(dlon);
                alert("funciton is going to be called");
                dynamicRoute([15.221039,79.897149],[dlat,dlon]);
                alert("function has been called");
                //alert(dlat);
                /*if(dlat>18.2949) { //north of srikakulam
                    alert("1st");
                    /*L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.9563,81.2560),
                            L.latLng(17.0005,81.8040),
                            L.latLng(17.2789,82.4012),
                            L.lataLng(17.6868,83.2185),
                            L.latLng(18.2949,83.8938),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);*/
                    /*if(dlon>81.2560) {
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.9563,81.2560),
                            L.latLng(17.0005,81.8040),
                            L.latLng(17.2789,82.4012),
                            L.latLng(17.6868,83.2185),
                            L.latLng(18.2949,83.8938),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                    } else {
                        L.Routing.control({
                        waypoints: [
                        L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.7850,80.8488),
                            L.latLng(17.2473,80.1514),
                            L.latLng(17.9689,79.5941),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                    }
                } else if(dlat>17.6868 && dlon>81.2560) {
                    alert("2nd");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.9563,81.2560),
                            L.latLng(17.0005,81.8040),
                            L.latLng(17.2789,82.4012),
                            L.latLng(17.6868,83.2185),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                } else if(dlat>17.2789 && dlon>81.2560) {
                    alert("3rd");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.9563,81.2560),
                            L.latLng(17.0005,81.8040),
                            L.latLng(17.2789,82.4012),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);  
                } else if(dlat>17.0005 && dlon>81.2560 ) {
                    alert("4th");
                    if(dlon>=81.8040) {
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.9563,81.2560),
                            L.latLng(17.0005,81.8040),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                    } else {
                        L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.9563,81.2560),
                            //L.latLng(17.0005,81.8040),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                    }
                } else if(dlat>16.5449 && dlon>81.0421491) {
                    alert("5th");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.5449,81.5212),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                } else if(dlat<13.6288) {
                    alert("6th");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.5062,80.6480),
                            L.latLng(15.8107,79.9724),
                            L.latLng(13.6288,79.4192),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);   
                } else if(dlat<14.4426) {
                    alert("7th");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.5062,80.6480),
                            L.latLng(15.8107,79.9724),
                            L.latLng(14.4426,79.9865),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map); 
                } else if(dlat<15.8107) {
                    alert("8th");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.5062,80.6480),
                            L.latLng(15.8107,79.9724),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                } else if(dlon<78.0035 && dlat<17.9689) {
                    alert("9th");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.5062,80.6480),
                            L.latLng(16.4760,79.4394),
                            L.latLng(16.7488,78.0035),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
    
                } else if(dlat>17.9689) {
                    alert("10th");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.6356,80.9716),
                            L.latLng(16.7850,80.8488),
                            L.latLng(17.2473,80.1514),
                            L.latLng(17.9689,79.5941),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                }
                 /*L.Routing.control({
                    waypoints: [
                      L.latLng(15.221039,79.897149),
                      L.latLng(16.4344,80.9931),
                      L.latLng(16.6356,80.9716),
                      /*L.latLng(16.8108,81.2637),
                      L.latLng(16.9563,81.2560),
                      L.latLng(17.0005,81.8040),
                      L.latLng(17.2789,82.4012),
                      L.latLng(17.6986,83.0024),
                      L.latLng(dlat,dlon),
                    ]
                  }).addTo(map);*/
                 /*else if(dlat==15.50755450) {//for ongole
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(16.4344,80.9931),
                            L.latLng(16.5062,80.6480),
                            L.latLng(16.236719,80.647476),
                            L.latLng(15.8107,79.9724),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                } else if(dlat==16.50875860) {//for bza
                    L.Routing.control({
                        waypoints: [
                        L.latLng(15.221039,79.897149),
                        L.latLng(),
                        L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);*/
                /*else {
                    if(dlon<80.9931) {
                        alert("11th");
                        if(dlon<80.1514) {
                            if(dlat>16.5062) {
                                alert("11th a");
                                L.Routing.control({
                                    waypoints: [
                                        L.latLng(15.221039,79.897149),
                                        L.latLng(16.4344,80.9931),
                                        L.latLng(16.5062,80.6480),
                                        L.latLng(17.2473,80.1514),
                                        L.latLng(dlat,dlon),
                                    ]
                                }).addTo(map); 
                            } else if(dlon<79.4394) {
                                alert("11thb");
                                L.Routing.control({
                                    waypoints: [
                                    L.latLng(15.221039,79.897149),
                                        L.latLng(16.4344,80.9931),
                                        L.latLng(16.5062,80.6480),
                                        L.latLng(16.4760,79.4394),
                                        L.latLng(dlat,dlon),
                                    ]
                                }).addTo(map);
                            } else {
                                alert("11thc");
                                L.Routing.control({
                                    waypoints: [
                                    L.latLng(15.221039,79.897149),
                                        L.latLng(16.4344,80.9931),
                                        L.latLng(16.5062,80.6480),
                                        L.latLng(dlat,dlon),
                                    ]
                                }).addTo(map);
                            }
                        }
                    } else {
                    alert("NOt working");
                    L.Routing.control({
                        waypoints: [
                            L.latLng(15.221039,79.897149),
                            L.latLng(dlat,dlon),
                        ]
                    }).addTo(map);
                    }
                }*/
                //var lat3
                //var lon3
                /*if(dlat==16.50875860) { //for vijayawada via gudivada
                var lat3=document.getElementById("lat1").value;
                  var lon3=document.getElementById("lon1").value;
                  L.Routing.control({
                    waypoints: [
                      L.latLng(15.221039,79.897149),
                      L.latLng(lat3,lon3),
                      L.latLng(dlat,dlon),
                    ]
                  }).addTo(map);
                } else if(dlat==16.76120390) {//for mylavaram via junction
                  var lat3=document.getElementById("lat2").value;
                   var lon3=document.getElementById("lon2").value;
                  L.Routing.control({
                  waypoints: [
                  L.latLng(15.221039,79.897149),
                  L.latLng(lat3,lon3),
                  L.latLng(dlat,dlon),
                  //L.latLng(16.4344,80.9931),
                  //L.latLng(17.6868,83.2185),
                  //L.latLng(16.3530921,81.0421419),
                  ]}).addTo(map);
                } else if(dlat==16.09495020) {//for chpeta via tenali
                  var lat3=document.getElementById("lat3").value;
                  var lon3=document.getElementById("lon3").value;
                  L.Routing.control({
                  waypoints: [
                  L.latLng(15.221039,79.897149),
                  L.latLng(16.4344,80.9931),
                  L.latLng(lat3,lon3),
                  L.latLng(dlat,dlon),
                  //L.latLng(16.4344,80.9931),
                  //L.latLng(17.6868,83.2185),
                  //L.latLng(16.3530921,81.0421419),
                  ]}).addTo(map);
                } else if(dlat==15.71498775) {//for markapur via ongole
                  var lat3=document.getElementById("lat4").value;
                  var lon3=document.getElementById("lon4").value;
                  L.Routing.control({
                  waypoints: [
                  L.latLng(15.221039,79.897149),
                  //L.latLng(16.4344,80.9931),
                  L.latLng(lat3,lon3),
                  L.latLng(dlat,dlon),
                  //L.latLng(16.4344,80.9931),
                  //L.latLng(17.6868,83.2185),
                  //L.latLng(16.3530921,81.0421419),
                  ]}).addTo(map);
                }
                 else {
                  L.Routing.control({
                  waypoints: [
                  L.latLng(15.221039,79.897149),
                  //L.latLng(lat3,lon3),
                  L.latLng(dlat,dlon),
                  //L.latLng(16.4344,80.9931),
                  //L.latLng(17.6868,83.2185),
                  //L.latLng(16.3530921,81.0421419),
                  ]}).addTo(map);
                }*/
    
                }