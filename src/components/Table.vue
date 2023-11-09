<script setup>
import { reactive } from "vue";

const posts = reactive([
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  },
  {
    "location": 'Bogyoke Zay Branch',
    "address": 'No. 212, Natmaw Street, Oo Yin Myauk Ward, Hinthada Township.',
    'phone': '+95 (1) 2302309',
  }
]);

</script>
<template>
  <div class="container">
    <div class="row d-flex justify-content-center mt-5">
      <div class="col-12 col-md-9">
        <div class="post-table-wrapper">
            <table class="table table-striped">
              <thead>
                <tr class="py-3">
                  <th scope="col">Location Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in posts" :key="post" class="post-data">
                  <td>{{ post.location }}</td>
                  <td>{{ post.address }}</td>
                  <td>{{ post.phone }}</td>
                  <td>
                    <button class="btn-post-direction">
                      <div class="d-flex align-items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <mask id="mask0_3653_21831" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                            width="10" height="10">
                            <rect width="10" height="10" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_3653_21831)">
                            <path
                              d="M0.712891 10V2.94118H7.28642L5.18348 0.823529L6.00701 0L9.53642 3.52941L6.00701 7.05882L5.18348 6.22059L7.28642 4.11765H1.88936V10H0.712891Z"
                              fill="#681C32" />
                          </g>
                        </svg>
                        <div>
                          Get Direction
                        </div>
                      </div>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-table-wrapper {
  border: 1px solid darkgray;
  border-radius: 20px;
  height: 570px;
  overflow-y: scroll;
}

.post-table-wrapper th {
  padding: 13px;
  vertical-align: middle;
}

.btn-post-direction {
  padding: 8px;
  outline: none;
  border: 1px solid darkgray;
  border-radius: 16px;
  font-size: 11px;
  color: #681C32;
}

.post-data td {
  padding: 13px;
  vertical-align: middle;
}
</style>