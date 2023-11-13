<template>
  <div>
    <div id="dining-map"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      iconBase: '/path/to/images/', // Update with your image path
      icons: {
        info: {
          icon: '/path/to/images/map.png' // Update with your image path
        }
      },
      features: [
        {
          position: { lat: 37.7749, lng: -122.4194 }, // Example coordinates
          type: 'info',
          title: 'Example Branch',
          postID: '1',
          address: '123 Main St, Cityville',
          phone: '555-1234'
        },
        // Add more data as needed
      ],
      infowindow: new google.maps.InfoWindow()
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(document.getElementById('dining-map'), {
        zoom: 12, // Example zoom level
        center: new google.maps.LatLng(37.7749, -122.4194), // Example center coordinates
        mapTypeId: 'roadmap'
      });

      this.features.forEach((feature) => {
        const marker = new google.maps.Marker({
          position: feature.position,
          animation: google.maps.Animation.DROP,
          icon: this.icons[feature.type].icon,
          map: this.map,
          title: feature.title
        });

        const contentString = `<div id="branch-${feature.postID}" class="branch-info">
                                <h2>${feature.title}</h2>
                                <p class="address">${feature.address}</p>
                                <p class="phone"> Tel: ${feature.phone}</p>
                              </div>`;

        marker.addListener('click', () => {
          this.infowindow.setContent(contentString);
          this.infowindow.open(this.map, marker);
        });
      });
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
