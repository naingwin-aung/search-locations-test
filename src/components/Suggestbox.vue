<script setup>
import { reactive } from "vue";

const locations = reactive([
  'Yangon, Bahan',
  'Yangon, Tharkayta',
  'Yangon, Botahtaung',
  'Yangon, Thanlyin',
  'Yangon, Pazunaung'
]);
</script>

<template>
  <div class="container">
    <div class="mt-5">
      <div class="row d-flex justify-content-center">
        <div class="col-6">
          <div class="location-box-wrapper">
            <div v-for="location in locations" :key="location" class="location-box">
                {{ location }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.location-box-wrapper {
  border: 1px solid darkgray;
  border-radius: 20px;
  position: absolute;
}

.location-box {
  padding: 12px;
}

.location-box:not(:last-child) {
  border-bottom: 1px solid darkgray;
}
</style>
