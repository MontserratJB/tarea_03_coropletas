// Mapa Leaflet
var mapa = L.map('mapid').setView([9.94, -84.01], 13);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

// Capa base 2
var capa_esri = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
  {
    maxZoom: 19,
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
).addTo(mapa);	

// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "ESRI": capa_esri
};	    


// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);
	    

// Capa de coropletas de % de zonas urbanas en cantones de la GAM
$.getJSON('https://raw.githubusercontent.com/MontserratJB/tarea_03_coropletas/master/ign/zonas_homog.geojson', function (geojson) {
  var capa_zonas_homog_coropletas = L.choropleth(geojson, {
	  valueProperty: 'valor',
	  scale: ['#90ee90', '#F63208'],
	  steps: 5,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.7
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Zona: ' + feature.properties.codigo_zon + '<br>' + 'Valor: ' + feature.properties.valor.toLocaleString() + ' colones')
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_zonas_homog_coropletas, 'Zonas Homogeneas, Montes de Oca');	

  // Leyenda de la capa de coropletas
  var leyenda = L.control({ position: 'bottomleft' })
  leyenda.onAdd = function (mapa) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = capa_zonas_homog_coropletas.options.limits
    var colors = capa_zonas_homog_coropletas.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  leyenda.addTo(mapa)
});

// Capa raster acuarela
var capa_temperatura = L.imageOverlay("https://raw.githubusercontent.com/tpb729-desarrollosigweb-2021/datos/main/worldclim/bio1_cr.png", 
	[[11.2174518619451575, -87.0981414346102696], 
	[5.4997120253547189, -82.5543713734725770]], 
	{opacity:0.5}
).addTo(mapa);
control_capas.addOverlay(capa_temperatura, 'Temperatura');


