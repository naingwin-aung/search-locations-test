<template>
    <div>
      <div id="dining-map"></div>
    </div>
  </template>
  
  <script>
  export const DiningMap = {
    setup() {
      const map = ref(null);
      const infowindow = ref(new google.maps.InfoWindow());
      const features = reactive([
        {
          position: { lat: 37.7749, lng: -122.4194 }, // Example coordinates
          type: 'info',
          title: 'Example Branch',
          postID: '1',
          address: '123 Main St, Cityville',
          phone: '555-1234'
        },
        // Add more data as needed
      ]);
  
      onMounted(() => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC44n4EJxputPRoWzorOaszqW-dFoVN8UE&callback=initMap';
        document.head.appendChild(script);
        initMap();
      });
  
      function initMap() {
        map.value = new google.maps.Map(document.getElementById('dining-map'), {
          zoom: 12, // Example zoom level
          center: new google.maps.LatLng(37.7749, -122.4194), // Example center coordinates
          mapTypeId: 'roadmap'
        });
  
        features.forEach((feature) => {
          const marker = new google.maps.Marker({
            position: feature.position,
            animation: google.maps.Animation.DROP,
            icon: `https://mabbank.mabsayyaungchelrun.com/wp-content/uploads/2023/11/MAB-Logo-Pattern.png`,
            map: map.value,
            title: feature.title
          });
  
          const contentString = `<div id="branch-${feature.postID}" class="branch-info">
            <h2>${feature.title}</h2>
            <p class="address">${feature.address}</p>
            <p class="phone"> Tel: ${feature.phone}</p>
          </div>`;
  
          marker.addListener('click', () => {
            infowindow.value.setContent(contentString);
            infowindow.value.open(map.value, marker);
          });
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  