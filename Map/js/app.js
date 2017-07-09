err_page = function()
{
    //If there is an error while loading the page
    alert("Due to some error or connectivity issue the page failed to load");
};
var mv=function()
{
    var self=this;
    this.list_of_places=ko.observableArray([]);
    var location_markers=[];
    var loc_marker;
    var page;
    var placeMarkers=[];
    list_of_locations.forEach(function(loc){
              self.list_of_places.push(loc);
            });
    this.select=function(clicked_loc)
    {
        for(var i=0;i<self.list_of_places().length;i++)
        {
            var heading=self.list_of_places()[i].heading;
            if(clicked_loc.heading==heading)
            {
                this.current_loc=self.list_of_places()[i];
            }
        }
        if(!this.loc_marker) alert('Invalid search');
        else
        {
            this.loc_marker.setAnimation(google.maps.Animation.BOUNCE);
            //When a location is selected from its marker or from the
            //given list an infowindow is opened.
            google.maps.event.trigger(this.loc_marker, 'click');
        }
    };
    //For searching the particular location additonal filters are being added.
    this.find_location=ko.observable('');
    this.selector=function(v)
    {
        self.list_of_places.removeAll();
        list_of_locations.forEach(function(val)
        {
            var search=val.heading.toLowerCase();
            if(search.indexOf(v.toLowerCase())>=0)
            {
                self.list_of_places.push(val);
            }
        });
    };
    // Intialise array with current location.
    this.current_loc=ko.observable(this.list_of_places()[0]);
    mv.prototype.Map_initialise=function()
    {
      mouse_over_icon=function()
        {
            this.setIcon(light_icon);
        };
        var big_click_window=new google.maps.InfoWindow();
        var def_icon=marker_icon('ff6e00');
        var light_icon=marker_icon('32ff24');
            mouse_noton_icon=function()
            {
              this.setIcon(def_icon);
            };
        var boundary=new google.maps.LatLngBounds();
                function active_marker(loc_marker)
                {
                  loc_marker.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(function()
                  {
                    loc_marker.setAnimation(null);
                  },3000);
                }
                g=function()
                {
                  active_marker(this);
                  fill_info_window(this, big_click_window);
                };
                // This function will show the information of the location when its marker is clicked.
        function fill_info_window(loc_marker, click_window)
        {
            // Checking the status of window -opened or closed?
            if (click_window.loc_marker!=loc_marker)
            {
                //Clearing the content so that the streetview is loaded.
                click_window.setContent();
                click_window.loc_marker=loc_marker;
                //when click_window is closed all its property gets closed too.
                click_window.addListener('closeclick', function()
                {
                    if(click_window.loc_marker!==null)
                        click_window.loc_marker.setAnimation(null);
                    click_window.loc_marker=null;
                });
                var str_view=new google.maps.StreetViewService();
                var r=50;
                var t=true;
                var pointer=false;
                var info='';
                var pan_opt;
                var header;
                var near_str_loc;
                //If panorma mode is found then status is OK, then the
                //position of that view is calculated, collected and shown.
                get_view=function(data, status)
                {
                    if (status==google.maps.StreetViewStatus.OK)
                    {
                         near_str_loc=data.location.latLng;
                         header=google.maps.geometry.spherical.computeHeading(
                            near_str_loc, loc_marker.position
                            );
                        pan_opt={
                            position: near_str_loc,
                            pov :{
                                heading: header,
                                pitch: 30
                            }
                        };
                        var panorama=new google.maps.StreetViewPanorama(
                            document.getElementById('stv'), pan_opt
                            );
                    }
                    else
                    {
                        click_window.setContent
                        (
                            '<div><h6 id="header">' +
                            loc_marker.heading +
                            '</h6></div><div id="info_link" >'+
                            info +
                            '</div><div><span id="view_error" >Images of the location not present</span></div>'
                        );
                        t=false;
                    }
                };
                //streetview of within 50 meters of the given location
                //can be seen usingstr_view
                str_view.getPanoramaByLocation(loc_marker.position, r, get_view);
                //click_window is opened when loc_marker is clicked.
                click_window.open(page, loc_marker);
                var info_url='https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                        loc_marker.heading +
                        '&format=json&callback=wikiCallback';
                $.ajax({
                    url:info_url,
                    dataType:"jsonp",
                    //We don't need to mention callback again as by default jsonp as datatype will set
                    //callback function name the same.
                    success:function(answer)
                    {
                        pointer=true;
                        for(var j=1; j < answer.length; j++)
                        {
                            var item=answer[j];
                            for(var i=0; i < item.length; i++)
                            {
                                rss=item[i];
                                if(rss.length > info.length)
                                {
                                    info=rss;
                                }
                            }
                        }
                        if(t===false)
                        {
                            click_window.setContent
                            (
                               '<div><h6 id="header">' +
                                loc_marker.heading +
                               '</h6></div><div id="info_link" >'+
                                info +
                               '</div><div><span id = "view_error" >Images of the location not present</span></div>'
                            );
                        }
                        else
                        {
                            click_window.setContent
                            (
                                '<div><h6 id="header">' +
                                loc_marker.heading +
                                '</h6></div><div id="info_link">'+
                                info +
                                '</div><div id="stv"></div>'
                            );
                            var panorama = new google.maps.StreetViewPanorama(
                                document.getElementById('stv'), pan_opt
                            );
                        }
                    }
                }).fail(function(err_msg)
                {
                        alert('Error : \n' + err_msg);
                });
            }
        }
        function marker_icon(mc)
        {
          var mar_image=new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ mc +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),  new google.maps.Point(0, 0),
          new google.maps.Point(10, 34), new google.maps.Size(21,34));
          return mar_image;
        }
  //Styling used for map
  var styles=[
  {
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#212121"
      }
    ]
  },
  {
    "elementType":"labels.icon",
    "stylers":[
      {
        "visibility":"off"
      }
    ]
  },
  {
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#757575"
      }
    ]
  },
  {
    "elementType":"labels.text.stroke",
    "stylers":[
      {
        "color":"#212121"
      }
    ]
  },
  {
    "featureType":"administrative",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#757575"
      }
    ]
  },
  {
    "featureType":"administrative.country",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#9e9e9e"
      }
    ]
  },
  {
    "featureType":"administrative.land_parcel",
    "stylers":[
      {
        "visibility":"off"
      }
    ]
  },
  {
    "featureType":"administrative.locality",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#bdbdbd"
      }
    ]
  },
  {
    "featureType":"poi",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#757575"
      }
    ]
  },
  {
    "featureType":"poi.business",
    "stylers":[
      {
        "color":"#fff355"
      }
    ]
  },
  {
    "featureType":"poi.park",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#181818"
      }
    ]
  },
  {
    "featureType":"poi.park",
    "elementType":"labels.text",
    "stylers":[
      {
        "visibility":"off"
      }
    ]
  },
  {
    "featureType":"poi.park",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#616161"
      }
    ]
  },
  {
    "featureType":"poi.park",
    "elementType":"labels.text.stroke",
    "stylers":[
      {
        "color":"#1b1b1b"
      }
    ]
  },
  {
    "featureType":"road",
    "elementType":"geometry.fill",
    "stylers":[
      {
        "color":"#2c2c2c"
      }
    ]
  },
  {
    "featureType":"road",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#8a8a8a"
      }
    ]
  },
  {
    "featureType":"road.arterial",
    "stylers":[
      {
        "color":"#8a8a8a"
      }
    ]
  },
  {
    "featureType":"road.arterial",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#373737"
      }
    ]
  },
  {
    "featureType":"road.highway",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#e0e0e0"
      }
    ]
  },
  {
    "featureType":"road.highway",
    "elementType":"labels",
    "stylers":[
      {
         "color":"#e0e0e0"
      }
    ]
  },
  {
    "featureType":"road.highway.controlled_access",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#4e4e4e"
      }
    ]
  },
  {
    "featureType":"road.local",
    "stylers":[
      {
        "color":"#afafaf"
      }
    ]
  },
  {
    "featureType":"road.local",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#afafaf"
      }
    ]
  },
  {
    "featureType":"transit",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#757575"
      }
    ]
  },
  {
    "featureType":"water",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#0048ff"
      }
    ]
  },
  {
    "featureType":"water",
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "color":"#007fff"
      }
    ]
  }
];
         // Calling of constructor which creates a new page with centre and zoom.
        this.page=new google.maps.Map(document.getElementById('page'),
        {
            center:{lat: 25.578773, lng: 91.893254},
            zoom:15,
            styles:styles,
            mapTypeControl:false
        });
        page=this.page;
        //Data being transferred from list_of_locations array to the given variables.
        for(var r=0;r<list_of_locations.length;r++)
        {
            //Position obtained from list_of_locations list.
            var position=list_of_locations[r].co_ordinates;
            var heading=list_of_locations[r].heading;
            //Marker of location at its given position using "positon" and adding info of it.
            var loc_marker=new google.maps.Marker
            ({
                position:position,
                heading:heading,
                animation:google.maps.Animation.DROP,
                id:r
            });
            location_markers.push(loc_marker);
            //List of actions on clicking the marker
            loc_marker.addListener('mouseover', mouse_over_icon);
            loc_marker.addListener('mouseout', mouse_noton_icon);
            loc_marker.addListener('click',g);
        }
        //Only selected marker will be animated and that too one at a time.
        display_markers();
        for(var m=0;m<list_of_locations.length;m++)
        {
            this.list_of_places()[m].loc_marker=location_markers[m];
        }
        //This function hides the markers by running location_markers through a loop.
        function hideMarkers(location_markers)
        {
          for (var u=0;u<location_markers.length;u++)
          {
             location_markers[u].setMap(null);
          }
        }
        //This function displays all the markers by running location_markers through a loop.
        function display_markers()
        {
            for (var i=0;i<location_markers.length;i++) {
                location_markers[i].setMap(page);
                boundary.extend(location_markers[i].position);
            }
            page.fitBounds(boundary);
        }};
    this.find_location.subscribe(this.selector);
    this.find_location.subscribe(this.markerSelector);
    this.markerSelector=function(v)
    {
        list_of_locations.forEach(function(val)
        {
            var f=val.loc_marker;
            if (f.setMap(page)!==null)
            {
                f.setMap(null);
            }
            var search=f.heading.toLowerCase();
            if (search.indexOf(v.toLowerCase())>=0)
            {
                f.setMap(page);
            }
        });
    };
};
var list_of_locations=[
{heading:'Elephant Falls', co_ordinates:{lat: 25.537101, lng: 91.822457}},
{heading:'Mawlynnong', co_ordinates:{lat: 25.201764, lng: 91.916031}},
{heading:'Umiam Lake', co_ordinates:{lat: 25.650918, lng: 91.893421}},
{heading:'Don Bosco Museum', co_ordinates:{lat: 25.593116, lng: 91.882352}},
{heading:'Shillong Peak', co_ordinates:{lat: 25.547377, lng: 91.875056}},
{heading:'Lady Hydari Park', co_ordinates:{lat: 25.565421, lng: 91.881615}},
{heading:'Mawsynram', co_ordinates:{lat: 25.297536, lng: 91.582636}}
];
var data = new mv();
//Bindings are being applied viewmodel(mv).
ko.applyBindings(data);
