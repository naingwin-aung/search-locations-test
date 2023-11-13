<script setup>
import { onMounted, ref } from "vue";

const merchantMetas = ref([
  {
    latitude: 16.807369322631676,
    longitude: 96.19581186349771,
    branch_name: 'Shop 2',
    branch_address: '456 Oak St',
    branch_phone: '987-654-3210',
    post_id: 1
  },
  {
    latitude: 16.7952649,
    longitude: 96.1768363,
    branch_name: 'Shop 2',
    branch_address: '456 Oak St',
    branch_phone: '987-654-3210',
    post_id: 2
  },
]);
const map = ref(null);
const infowindow = ref(null);

const initializeMap = () => {
  map.value = new google.maps.Map(document.getElementById('dining-map'), {
    zoom: 12,
    center: new google.maps.LatLng(merchantMetas.value[0].latitude, merchantMetas.value[0].longitude),
    mapTypeId: 'roadmap',
  });

  infowindow.value = new google.maps.InfoWindow();

  let iconBase = `https://mabbank.mabsayyaungchelrun.com/wp-content/uploads/2023/11/MAB-Logo-Pattern.png`;
  let icons = {
    info: {
      icon: iconBase,
    },
  };

  merchantMetas.value.forEach((meta) => {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(meta.latitude, meta.longitude),
      animation: google.maps.Animation.DROP,
      icon: icons.info.icon,
      map: map.value,
      title: meta.branch_name,
    });

    var contentString = `<div id="branch-${meta.post_id}" class="branch-info">
                                <h2>${meta.branch_name}</h2>
                                <p class="address">${meta.branch_address}</p>
                                <p class="phone"> Tel: ${meta.branch_phone}</p>
                              </div>`;

    marker.addListener('click', () => {
      infowindow.value.setContent(contentString);
      infowindow.value.open(map.value, marker);
    });
  })
}

onMounted(() => {
  initializeMap();
})
</script>

<template>
  <div>
    <div id="dining-map" style="height: 400px; width: 100%;"></div>
  </div>
</template>
