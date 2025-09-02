// -----------------------------
// DANA-DROUGHTWATCH v1.0
// JavaScript Frontend
// Author: Samuel Muturi Njeri | BSc. Geospatial, Dedan Kimathi University
// Project: Machine Learning-Enhanced Drought Early Warning System for Turkana
// Based on: CHIRPS, MODIS NDVI, SMAP, Combined Drought Index (CDI), Random Forest
// Accuracy: 89% (2-month forecast)
// For: Geospatial Society of Kenya Symposium
// Contact: samuelmuturi2002@gmail.com | 0759529126
// -----------------------------

// Wait for DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', function () {

  // === 1. Initialize Leaflet Map ===
  let mapInstance = null;

  function initializeMap() {
    if (document.getElementById('map') && !mapInstance) {
      mapInstance = L.map('map', {
        zoomControl: true,
        minZoom: 5,
        maxZoom: 12
      }).setView([3.5, 36.0], 7); // Turkana County

      // Base layer: OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      // Overlay: Satellite imagery (for visual impact)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics, © OpenStreetMap contributors',
        opacity: 0.6
      }).addTo(mapInstance);

      // Add Turkana County Boundary
      const turkanaBoundary = {
        "type": "Feature",
        "properties": {
          "name": "Turkana County",
          "population": "1.6M",
          "region": "ASAL"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [34.00, 2.00],
              [35.50, 2.00],
              [35.50, 5.00],
              [33.50, 5.00],
              [33.50, 3.00],
              [34.00, 2.00]
            ]
          ]
        }
      };

      // Drought risk color scale
      function getRiskColor(risk) {
        return risk === 'Extreme' ? '#7f0000' :
               risk === 'Severe' ? '#d73027' :
               risk === 'Moderate' ? '#fdae61' :
               '#a6d96a'; // Normal
      }

      // Add GeoJSON layer
      L.geoJSON(turkanaBoundary, {
        style: {
          color: '#1a3a6e',
          weight: 3,
          fillColor: getRiskColor('Severe'),
          fillOpacity: 0.6
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(`
            <b>${feature.properties.name}</b><br>
            Drought Risk: <strong>Severe</strong><br>
            Population: ~1.6 million<br>
            Region: Arid & Semi-Arid Lands (ASAL)
          `);
        }
      }).addTo(mapInstance);

      // Add Legend
      let legend = L.control({ position: 'bottomright' });
      legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let grades = ['Normal', 'Moderate', 'Severe', 'Extreme'];
        let colors = ['#a6d96a', '#fdae61', '#d73027', '#7f0000'];

        div.innerHTML = '<strong>Drought Severity</strong><br>';
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += 
            `<i style="background:${colors[i]};width:18px;height:18px;float:left;margin-right:8px;border:1px solid #ccc;"></i>
             ${grades[i]}<br>`;
        }
        return div;
      };
      legend.addTo(mapInstance);
    }
  }

  // Only initialize map if element exists and not collapsed
  if (document.getElementById('map') && !document.getElementById('map').classList.contains('collapsed')) {
    initializeMap();
  }

  // === 2. Chart.js - Historical Drought Trend (CDI 2010–2023) ===
  const chartElement = document.getElementById('trendChart');
  if (chartElement) {
    const ctx = chartElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'Drought Severity Index (CDI)',
          data: [1.2, 1.5, 2.1, 1.8, 1.9, 2.3, 3.0, 2.6, 2.5, 2.8, 3.2, 2.9, 2.8, 3.5],
          borderColor: '#d73027',
          backgroundColor: 'rgba(215, 48, 39, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#d73027',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Historical Drought Trends in Turkana County (2010–2023)'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            min: 1,
            max: 4,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return ['None', 'Normal', 'Moderate', 'Severe', 'Extreme'][value];
              }
            }
          }
        }
      }
    });
  }

  // === 3. Update Forecast Cards (Simulate ML Output) ===
  const nextMonth = document.getElementById('next-month');
  const twoMonths = document.getElementById('two-months');
  const threeMonths = document.getElementById('three-months');

  if (nextMonth) nextMonth.textContent = 'Severe';
  if (twoMonths) twoMonths.textContent = 'Moderate';
  if (threeMonths) threeMonths.textContent = 'Normal';

  // Add Accuracy Badge (Highlights 89% accuracy from your abstract)
  if (document.querySelector('.cards')) {
    let accuracyBadge = document.createElement('div');
    accuracyBadge.innerHTML = '<strong>Model Accuracy: 89% (Random Forest)</strong>';
    accuracyBadge.style.textAlign = 'center';
    accuracyBadge.style.margin = '15px 0';
    accuracyBadge.style.color = '#1a3a6e';
    accuracyBadge.style.fontWeight = 'bold';
    accuracyBadge.style.fontSize = '1.1em';
    document.querySelector('.cards').parentNode.insertBefore(accuracyBadge, document.querySelector('.cards'));
  }

  // === 4. Toggle Map: Expand/Collapse ===
  const toggleButton = document.getElementById('toggleMap');
  const mapElement = document.getElementById('map');

  if (toggleButton && mapElement) {
    toggleButton.addEventListener('click', function () {
      if (mapElement.classList.contains('collapsed')) {
        // Expand: Show map
        mapElement.classList.remove('collapsed');
        toggleButton.textContent = '–';
        // Re-initialize map if not already done
        if (!mapInstance) {
          initializeMap();
        } else {
          // Fix rendering issues
          setTimeout(() => { mapInstance.invalidateSize(); }, 100);
        }
      } else {
        // Collapse: Hide map
        mapElement.classList.add('collapsed');
        toggleButton.textContent = '+';
      }
    });
  }

  // Optional: Log project info to console (for symposium demo)
  console.log(`
Dana-DroughtWatch v1.0
BSc. Project by Samuel Muturi Njeri
Dedan Kimathi University of Technology
Integrates CHIRPS, MODIS NDVI, SMAP → CDI → Random Forest (89% accuracy)
For Geospatial Society of Kenya Symposium
Contact: samuelmuturi2002@gmail.com | 0759529126
`);
});