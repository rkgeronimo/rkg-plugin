"use strict";!function(u){var e="Class";"0"!==u.version.charAt(0)&&(e="Layer"),u.EdgeMarker=u[e].extend({options:{distanceOpacity:!1,distanceOpacityFactor:4,layerGroup:null,rotateIcons:!0,findEdge:function(e){return u.bounds([0,0],e.getSize())},icon:u.icon({iconUrl:u.Icon.Default.imagePath+"/edge-arrow-marker.png",clickable:!0,iconSize:[48,48],iconAnchor:[24,24]})},initialize:function(e){u.setOptions(this,e)},addTo:function(e){return"function"!=typeof(this._map=e)._getFeatures&&u.extend(e,{_getFeatures:function(){var e,t=[];for(e in this._layers)void 0!==this._layers[e].getLatLng&&t.push(this._layers[e]);return t}}),e.on("move",this._addEdgeMarkers,this),e.on("viewreset",this._addEdgeMarkers,this),this._addEdgeMarkers(),e.addLayer(this),this},destroy:function(){this._map&&this._borderMarkerLayer&&(this._map.off("move",this._addEdgeMarkers,this),this._map.off("viewreset",this._addEdgeMarkers,this),this._borderMarkerLayer.clearLayers(),this._map.removeLayer(this._borderMarkerLayer),delete this._map._getFeatures,this._borderMarkerLayer=void 0)},onClick:function(e){this._map.setView(e.target.options.latlng,this._map.getZoom())},onAdd:function(){},_borderMarkerLayer:void 0,_addEdgeMarkers:function(){void 0===this._borderMarkerLayer&&(this._borderMarkerLayer=new u.LayerGroup),this._borderMarkerLayer.clearLayers();for(var e=[],e=null!=this.options.layerGroup?this.options.layerGroup.getLayers():this._map._getFeatures(),t=this.options.findEdge(this._map),o=this.options.icon.options.iconSize[0],n=this.options.icon.options.iconSize[1],a=0;a<e.length;a++){var r,i,c,s,l,d=this._map.latLngToContainerPoint(e[a].getLatLng());(d.y<t.min.y||d.y>t.max.y||d.x>t.max.x||d.x<t.min.x)&&(r=d.x,i=d.y,s=t.getCenter(),l=Math.atan2(s.y-i,s.x-r),c=Math.atan2(s.y-t.min.y,s.x-t.min.x),c=Math.abs(l)>c&&Math.abs(l)<Math.PI-c?i<s.y?(i=t.min.y+n/2,r=s.x-(s.y-i)/Math.tan(Math.abs(l)),d.y-t.y):(i=t.max.y-n/2,r=s.x-(i-s.y)/Math.tan(Math.abs(l)),-d.y):r<s.x?(r=t.min.x+o/2,i=s.y-(s.x-r)*Math.tan(l),-d.x):(r=t.max.x-o/2,i=s.y+(r-s.x)*Math.tan(l),d.x-t.x),i<t.min.y+n/2?i=t.min.y+n/2:i>t.max.y-n/2&&(i=t.max.y-n/2),r>t.max.x-o/2?r=t.max.x-o/2:r<o/2&&(r=t.min.x+o/2),s=this.options,this.options.distanceOpacity&&(s.fillOpacity=(100-c/this.options.distanceOpacityFactor)/100),this.options.rotateIcons&&(d=l/Math.PI*180,s.angle=d),c={latlng:e[a].getLatLng()},s=u.extend({},s,c),(l=u.rotatedMarker(this._map.containerPointToLatLng([r,i]),s).addTo(this._borderMarkerLayer)).on("click",this.onClick,l))}this._map.hasLayer(this._borderMarkerLayer)||this._borderMarkerLayer.addTo(this._map)}}),u.RotatedMarker=u.Marker.extend({options:{angle:0},statics:{TRANSFORM_ORIGIN:u.DomUtil.testProp(["transformOrigin","WebkitTransformOrigin","OTransformOrigin","MozTransformOrigin","msTransformOrigin"])},_initIcon:function(){u.Marker.prototype._initIcon.call(this),this._icon.style[u.RotatedMarker.TRANSFORM_ORIGIN]="50% 50%"},_setPos:function(e){var t;u.Marker.prototype._setPos.call(this,e),u.DomUtil.TRANSFORM?this._icon.style[u.DomUtil.TRANSFORM]+=" rotate("+this.options.angle+"deg)":u.Browser.ie&&(e=this.options.angle*(Math.PI/180),t=Math.cos(e),e=Math.sin(e),this._icon.style.filter+=" progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+t+", M12="+-e+", M21="+e+", M22="+t+")")},setAngle:function(e){this.options.angle=e}}),u.rotatedMarker=function(e,t){return new u.RotatedMarker(e,t)},u.edgeMarker=function(e){return new u.EdgeMarker(e)}}(L),L.TileLayer.Grayscale=L.TileLayer.extend({options:{quotaRed:21,quotaGreen:71,quotaBlue:8,quotaDividerTune:0,quotaDivider:function(){return this.quotaRed+this.quotaGreen+this.quotaBlue+this.quotaDividerTune}},initialize:function(e,t){(t=t||{}).crossOrigin=!0,L.TileLayer.prototype.initialize.call(this,e,t),this.on("tileload",function(e){this._makeGrayscale(e.tile)})},_createTile:function(){var e=L.TileLayer.prototype._createTile.call(this);return e.crossOrigin="Anonymous",e},_makeGrayscale:function(e){if(!e.getAttribute("data-grayscaled")){e.crossOrigin="";for(var t=document.createElement("canvas"),o=(t.width=e.width,t.height=e.height,t.getContext("2d")),n=(o.drawImage(e,0,0),o.getImageData(0,0,t.width,t.height)),a=n.data,r=0,i=a.length;r<i;r+=4)a[r]=a[r+1]=a[r+2]=(this.options.quotaRed*a[r]+this.options.quotaGreen*a[r+1]+this.options.quotaBlue*a[r+2])/this.options.quotaDivider();o.putImageData(n,0,0),e.setAttribute("data-grayscaled",!0),e.src=t.toDataURL()}}}),L.tileLayer.grayscale=function(e,t){return new L.TileLayer.Grayscale(e,t)},jQuery(document).ready(function(l){function o(e){return e=e.split("-"),"".concat(e[2],".").concat(e[1],".").concat(e[0],".")}var t,n,a,e,r=L.tileLayer.grayscale("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",{maxZoom:18,attribution:'<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>  &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}),i=null,c=7.5;if("undefined"!=typeof rkgScript){var s=document.body.classList.contains("logged-in");if(console.log(s),i=!0===s?[44.3,16.5]:[44.3,15],l(window).width()<=1080&&(i=[44.4,16.3],c=6.5),l("#rkg-map").length){for(var d=L.map("rkg-map",{attributionControl:!1,zoomSnap:.25,gestureHandling:!0,gestureHandlingOptions:{text:{touch:"Koristi dva prsta za mapu",scroll:"ctrl + scroll",scrollMac:"⌘ + scroll"}}}).setView(i,c),u=(L.control.attribution({position:"bottomleft"}).addTo(d),d.addLayer(r),l("#excursions").data("new")),g=l("#excursions").data("now"),p=l("#excursions").data("old"),m=L.divIcon({className:"now-div-icon",iconSize:[14,14]}),h=L.divIcon({className:"new-div-icon",iconSize:[14,14]}),k=L.divIcon({className:"old-div-icon",iconSize:[14,14]}),y=L.divIcon({className:"new-div-icon-active",iconSize:[20,20]}),f=L.divIcon({className:"now-div-icon-active",iconSize:[20,20]}),v=L.divIcon({className:"old-div-icon-active",iconSize:[20,20]}),x=L.layerGroup(),b=L.layerGroup(),w=L.layerGroup(),T={},_=L.layerGroup(),M=L.edgeMarker({icon:k,rotateIcons:!0,layerGroup:_,findEdge:function(){return L.bounds([0,0],z)}}),C=0;C<g.length;C++)!function(e){""!==g[e].longitude&&"0"!==g[e].longitude&&(T[g[e].id]=L.marker([g[e].latitude,g[e].longitude],{icon:m,id:g[e].id,old:!1,now:!0}),T[g[e].id].bindPopup('<b class="leaflet-popup-bold-now">'.concat(g[e].post_title,"</b><br>\n                ").concat(o(g[e].starttime)," - ").concat(o(g[e].endtime),"<br>\n                Organizator: ").concat(g[e].display_name,"<br>\n                Planirano osoba: ").concat(g[e].limitation)).on("mouseover",function(){T[g[e].id].setIcon(f)}).on("mouseout",function(){T[g[e].id].setIcon(m)}),x.addLayer(T[g[e].id]))}(C);x.addTo(d);for(var I=0;I<u.length;I++)!function(e){""!==u[e].longitude&&"0"!==u[e].longitude&&(T[u[e].id]=L.marker([u[e].latitude,u[e].longitude],{icon:h,id:u[e].id,old:!1,now:!1}),T[u[e].id].bindPopup('<b class="leaflet-popup-bold-new">'.concat(u[e].post_title,"</b><br>\n                ").concat(o(u[e].starttime)," - ").concat(o(u[e].endtime),"<br>\n                Organizator: ").concat(u[e].display_name,"<br>\n                Planirano osoba: ").concat(u[e].limitation)).on("mouseover",function(){T[u[e].id].setIcon(y)}).on("mouseout",function(){T[u[e].id].setIcon(h)}),b.addLayer(T[u[e].id]))}(I);b.addTo(d);for(var S=0;S<p.length;S++)!function(e){""!==p[e].longitude&&"0"!==p[e].longitude&&(T[p[e].id]=L.marker([p[e].latitude,p[e].longitude],{icon:k,id:p[e].id,old:!0,now:!1}),T[p[e].id].bindPopup('<b class="leaflet-popup-bold-old">'.concat(p[e].post_title,"</b><br>\n                ").concat(o(p[e].starttime)," - ").concat(o(p[e].endtime),"<br>\n                Organizator: ").concat(p[e].display_name,"<br>\n                Planirano osoba: ").concat(p[e].limitation)).on("mouseover",function(){T[p[e].id].setIcon(v)}).on("mouseout",function(){T[p[e].id].setIcon(k)}),w.addLayer(T[p[e].id]))}(S);w.addTo(d);var O,i=l("#excursions").offset(),z=d.getSize(),D=(1080<l(window).width()&&!0===s&&(z=[i.left,d.getSize().y]),L.edgeMarker({icon:m,rotateIcons:!0,layerGroup:x,findEdge:function(){return L.bounds([0,0],z)}}).addTo(d),L.edgeMarker({icon:h,rotateIcons:!0,layerGroup:b,findEdge:function(){return L.bounds([0,0],z)}}).addTo(d),L.edgeMarker({icon:k,rotateIcons:!0,layerGroup:w,findEdge:function(){return L.bounds([0,0],z)}}));D.addTo(d),d.on("popupopen",function(e){var e=e.popup._source.options,t=l("#excursion-".concat(e.id));console.log(t),t.addClass("active"),e.old?(l(".excursion-new-container").hide(),l(".excursion-old-container").show(),l(".button-excursion-old").addClass("active"),l(".button-excursion-new").removeClass("active"),l(".excursion-gradient").addClass("old"),l("#excursions").addClass("excursions-old"),e=t.position().top,l(".excursion-old-container").scrollTop(e)):(l(".excursion-old-container").hide(),l(".excursion-new-container").show(),l(".button-excursion-new").addClass("active"),l(".button-excursion-old").removeClass("active"),l(".excursion-gradient").removeClass("old"),l("#excursions").removeClass("excursions-old"),e=t.position().top,l(".excursion-new-container").scrollTop(e))}),d.on("popupclose",function(){l(".excursion").removeClass("active")}),l(".excursion").hover(function(e){var e=l(e.currentTarget).data("marker"),t=T[e.id];t.options.old?t.setIcon(v):t.options.now?t.setIcon(f):t.setIcon(y),O=setTimeout(function(){d.panTo(t.getLatLng())},1e3)},function(e){e=l(e.currentTarget).data("marker"),e=T[e.id];e.options.old?e.setIcon(k):e.options.now?e.setIcon(m):e.setIcon(h),clearTimeout(O)}),l(".excursion-block-btn").click(function(e){l(e.currentTarget).hide(),l(".excursion-block-search-btn").css("display","block"),l(".excursion-block-search").animate({height:"toggle",opacity:"toggle"},"fast")}),l("#excursion-block-search-form").submit(function(e){e.preventDefault();e=e.currentTarget,e=new FormData(e);e.append("action","excursion_search"),w.remove(),D.destroy(),_.remove(),M.destroy(),jQuery.ajax({url:rkgScript.ajaxUrl,type:"POST",contentType:!1,processData:!1,dataType:"json",data:e,success:function(t){console.log(t),l(".excursion-old-container-list-serarch").html(t.html),l(".excursion-old-container-list-serarch").show(),l(".excursion-old-container-list").hide(),_=L.layerGroup();for(var e=0;e<t.cords.length;e++)!function(e){T[t.cords[e].id]=L.marker([t.cords[e].latitude,t.cords[e].longitude],{icon:k,id:t.cords[e].id,old:!0,now:!1}),T[t.cords[e].id].bindPopup('<b class="leaflet-popup-bold-old">'.concat(t.cords[e].post_title,"</b><br>\n                ").concat(o(t.cords[e].starttime)," - ").concat(o(t.cords[e].endtime),"<br>\n                Organizator: ").concat(t.cords[e].display_name,"<br>\n                Planirano osoba: ").concat(t.cords[e].limitation)).on("mouseover",function(){T[t.cords[e].id].setIcon(v)}).on("mouseout",function(){T[t.cords[e].id].setIcon(k)}),_.addLayer(T[t.cords[e].id])}(e);_.addTo(d),(M=L.edgeMarker({icon:k,rotateIcons:!0,layerGroup:_,findEdge:function(){return L.bounds([0,0],z)}})).addTo(d)}})}),l(".button-excursion-new").on("click",function(){w.addTo(d),D.addTo(d),_.remove(),M.destroy(),l(".excursion-block-btn").css("display","block"),l(".excursion-block-search-btn").css("display","none"),l(".excursion-block-search").hide(),l(".excursion-old-container-list-serarch").hide(),l(".excursion-old-container-list").show(),l(".excursion-old-container").hide(),l(".excursion-new-container").show(),l(".button-excursion-new").addClass("active"),l(".button-excursion-old").removeClass("active"),l(".excursion-gradient").removeClass("old"),l("#excursions").removeClass("excursions-old")}),l(".button-excursion-old").on("click",function(){w.addTo(d),D.addTo(d),_.remove(),M.destroy(),l(".excursion-block-btn").css("display","block"),l(".excursion-block-search-btn").css("display","none"),l(".excursion-block-search").hide(),l(".excursion-old-container-list-serarch").hide(),l(".excursion-old-container-list").show(),l(".excursion-new-container").hide(),l(".excursion-old-container").show(),l(".button-excursion-old").addClass("active"),l(".button-excursion-new").removeClass("active"),l(".excursion-gradient").addClass("old"),l("#excursions").addClass("excursions-old")}),l(".buton-excursion-mobile").on("click",function(e){w.addTo(d),D.addTo(d),_.remove(),M.destroy(),l(".excursion-block-btn").css("display","block"),l(".excursion-block-search-btn").css("display","none"),l(".excursion-block-search").hide(),l(".excursion-old-container-list-serarch").hide(),l(e.currentTarget).hasClass("old")?(l(e.currentTarget).removeClass("old"),l(e.currentTarget).addClass("new"),l(".excursion-old-container-list").show(),l(".excursion-new-container").hide(),l(".excursion-old-container").show(),l(".button-excursion-old").addClass("active"),l(".button-excursion-new").removeClass("active"),l(".excursion-gradient").addClass("old"),l("#excursions").addClass("excursions-old")):(l(e.currentTarget).removeClass("new"),l(e.currentTarget).addClass("old"),l(".excursion-old-container-list").show(),l(".excursion-old-container").hide(),l(".excursion-new-container").show(),l(".button-excursion-new").addClass("active"),l(".button-excursion-old").removeClass("active"),l(".excursion-gradient").removeClass("old"),l("#excursions").removeClass("excursions-old"))})}}l("#rkg-admin-map").length&&(t=L.divIcon({className:"leaflet-div-icon",iconSize:[14,14]}),l("input[name=latitude]").val()?((n=L.map("rkg-admin-map").setView([l("input[name=latitude]").val(),l("input[name=longitude]").val()],15)).addLayer(r),a=L.marker([l("input[name=latitude]").val(),l("input[name=longitude]").val()],{icon:t}).addTo(n),n.addLayer(a)):(n=L.map("rkg-admin-map").setView([44.7,16],6)).addLayer(r),L.control.geocoder("bd35a36b680bdf",{bounds:!1,markers:!1,panToPoint:!1}).addTo(n).on("select",function(e){a&&n.removeLayer(a),n.setView(e.latlng,15),a=new L.Marker(e.latlng,{icon:t}),n.addLayer(a),l("input[name=latitude]").val(e.latlng.lat),l("input[name=longitude]").val(e.latlng.lng)}),n.on("click",function(e){a&&n.removeLayer(a),a=new L.Marker(e.latlng,{icon:t}),n.addLayer(a),l("input[name=latitude]").val(e.latlng.lat),l("input[name=longitude]").val(e.latlng.lng)})),l("#rkg-excursion-map").length&&(c=l("#rkg-excursion-map").data("lat"),s=l("#rkg-excursion-map").data("long"),i=L.divIcon({className:"new-div-icon",iconSize:[14,14]}),e=L.map("rkg-excursion-map",{attributionControl:!1,zoomControl:!1,zoomSnap:.5,gestureHandling:!0,gestureHandlingOptions:{text:{touch:"Koristi dva prsta za mapu",scroll:"ctrl + scroll"}}}).setView([c,s],15),c=L.marker([c,s],{icon:i}).addTo(e),e.addLayer(r),e.addLayer(c)),l("#rkg_category").change(function(){l("#title-prompt-text").hide();var e,t=l("#rkg_category option:selected").data("template"),o=l("#rkg_category option:selected").val();l("#title").val(t.name),l("#rkg-location").val(t.location),l("#rkg-terms").val(t.terms),l("#rkg-price").val(t.price),l("#rkg-limitation").val(t.limitation),l("#wp-content-wrap").hasClass("html-active")?l("#content").val(t.description):null!==(e=tinyMCE.get("content"))&&e.setContent(t.description.replace(/\n\s*\n/g,"\n").replace(new RegExp("\r?\n","g"),"<br />")),l("#rkg_organiser").children().removeAttr("selected"),l(".instructor-option").hide(),l("#instructor-".concat(o)).show(),l("#instructor-none").attr("selected","selected")}),l(".course-terms-control").click(function(){l(".course-terms").toggle(),l(".course-terms-up").toggle(),l(".course-terms-down").toggle()}),l(".rkg-course-slick").slick({infinite:!0,slidesToShow:3,slidesToScroll:3,prevArrow:l(".rkg-course-chevron-left"),nextArrow:l(".rkg-course-chevron-right"),responsive:[{breakpoint:1081,settings:{slidesToShow:1,slidesToScroll:1}}]}),l("#rkg-starttime").change(function(e){e=l(e.currentTarget).val();l("#rkg-endtime").attr("min",e)}),l(".course-block-select").click(function(e){e.preventDefault();e=l(e.currentTarget).data("target");l(".course-block-terms").not("#course-block-terms-".concat(e)).hide(),l("#course-block-terms-".concat(e)).animate({height:"toggle",opacity:"toggle"},"fast")}),l(document).mouseup(function(e){l(".course-block-select").is(e.target)||0!==l(".course-block-terms").has(e.target).length||l(".course-block-terms").hide()}),l(".course-block-term").click(function(e){e.preventDefault();var t=l(e.currentTarget).data("target"),o=l(e.currentTarget).data("id"),n=l(e.currentTarget).data("link"),a=l(e.currentTarget).data("date"),r=l(e.currentTarget).data("title"),i=l(e.currentTarget).data("content"),c=l(e.currentTarget).data("signdate"),s=l(e.currentTarget).data("signclass"),e=l(e.currentTarget).data("signtext");l("#course-block-link-".concat(t)).attr("href",n),l("#course-block-link-more-".concat(t)).attr("href",n),l("#course-block-date-".concat(t)).text(a),l("#course-block-title-".concat(t)).text(r),l("#course-block-content-".concat(t)).text(i),l("#course-block-signup-".concat(t)).removeClass(),l("#course-block-signup-".concat(t)).addClass(s),l("#course-block-signup-".concat(t)).text(e),l("#course-block-signup-".concat(t)).attr("data-course",o),l("#course-block-signup-".concat(t)).attr("data-name",r),l("#course-block-signup-".concat(t)).attr("data-date",c),l("#course-block-terms-".concat(t)).animate({height:"toggle",opacity:"toggle"},"fast"),window.location=n}),l("body").on("change","#file",function(e){var e=l(e.currentTarget).prop("files")[0],t=l("#userId").val(),o=new FormData;o.append("file",e),o.append("user",t),o.append("action","file_upload"),jQuery.ajax({url:rkgScript.ajaxUrl,type:"POST",contentType:!1,processData:!1,data:o,success:function(e){l("#brevetShow").attr("src",e)}})}),l("body").on("click",".rkg-news-category",function(e){var e=l(e.currentTarget).attr("data-id"),t=new FormData;t.append("id",e),t.append("action","news_block_update"),jQuery.ajax({url:rkgScript.ajaxUrl,type:"POST",contentType:!1,processData:!1,data:t,dataType:"json",success:function(e){l(".rkg-category-container").html(e.category),l(".news-content-container").fadeOut("fast").promise().done(function(){l(".news-content-container").html(e.content).fadeIn("fast")})},error:function(e){console.log(e)}})}),l(".rkg-category-container").on("click",".rkg-news-category-select",function(e){e.preventDefault();l(e.currentTarget).data("target");l(".rkg-news-category-select-arrow").toggleClass("up"),l(".rkg-news-category, .rkg-news-category-link").animate({height:"toggle",opacity:"toggle"},"fast")}),l("#misc-publishing-actions").after(l("#cancle_excursion")),l("#titlediv").before(l("#rkg_category_table")),l("#rkg_excursion_data_metabox, #rkg_course_data_metabox").detach().appendTo("#prenormal-sortables"),l(".new-inventory-icon").click(function(e){l(e.currentTarget).hide(),l(e.currentTarget).next().show()}),l(".reservation-resolve input[type=text]").focus(function(e){l(e.currentTarget).removeClass("ok no")}).blur(function(t){var e=l(t.currentTarget).val();console.log(e),l.ajax({type:"POST",dataType:"json",url:rkgScript.ajaxUrl,data:{action:"check_inventory",id:e},success:function(e){l(t.currentTarget).addClass(e)},error:function(e){console.log(e)}})}),l("label[for=role]").parent().parent().remove(),1==l("#guest_meta_check").prop("checked")&&l("#guest_count_row").show(),l("#guest_meta_check").on("change",function(e){1==l(e.currentTarget).prop("checked")?l("#guest_count_row").show():0==l(e.currentTarget).prop("checked")&&l("#guest_count_row").hide()}),l(".rkg-popover-control").click(function(e){l(".rkg-popover").not(l(e.currentTarget).next()).hide(),l(e.currentTarget).next().toggle()}),l("#niid, .preSignupSelect").select2(),l(".rkg-admin-switch").click(function(e){var t=l(e.currentTarget).attr("id");l(e.currentTarget).toggleClass("dashicons-arrow-down-alt2 dashicons-arrow-up-alt2"),l("#".concat(t,"-block")).toggle()}),l(".rkg-show-map").click(function(e){e.preventDefault(),l(e.currentTarget).toggleClass("on off"),l("#excursions").toggleClass("excursions-map-off")}),l(".rkg-toggler, .rkg-toggler-title").click(function(e){var t;"pointer"===l(e.currentTarget).css("cursor")&&(t=l(e.currentTarget).data("toggle"),l(e.currentTarget).find("i").toggleClass("fa-chevron-down fa-chevron-up"),l("#".concat(t)).toggle())}),l(".reservation-save").click(function(e){var t=e.target.getAttribute("data-id"),o=new FormData,n=(console.log("reservationId: ",t),o.append("reservation",t),l(e.target).parent().parent()),t=(o.append("user_id",n.children(".column-user_id").text()),["mask","regulator","suit","boots","gloves","fins","bcd","lead_belt"].forEach(function(e){var t=n.find(".column-"+e+" input");t.is(":visible")&&o.append(e,t.val())}),n.find(".column-comment textarea"));o.append("other",t.val()),jQuery.ajax({url:"admin.php?page=reservations",type:"POST",contentType:!1,processData:!1,dataType:"json",data:o,success:function(e){console.log(e)}})})});
//# sourceMappingURL=script.js.map
