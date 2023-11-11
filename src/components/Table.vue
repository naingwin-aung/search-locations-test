<script setup>
import { reactive, ref } from "vue";

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

const defaultView = ref('listView');

const changeViewHandler = (view) => {
  defaultView.value = view;
}

</script>
<template>
  <div class="container">
    <div class="mt-5">
      <div class="row">
        <div class="col-12">
          <div class="post-table-wrapper">
            <div class="d-flex justify-content-around align-items-center">
              <h4 class="cursor flex-fill d-flex justify-content-center post-list-view" :class="[{'view-active' : defaultView == 'listView'}]"
                @click="changeViewHandler('listView')">
                <div class="d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                    <path
                      d="M1.875 0.5C2.56523 0.5 3.125 1.05977 3.125 1.75C3.125 2.44141 2.56523 3 1.875 3C1.18477 3 0.625 2.44141 0.625 1.75C0.625 1.05977 1.18477 0.5 1.875 0.5ZM18.75 1.125C19.0938 1.125 19.375 1.40469 19.375 1.75C19.375 2.09375 19.0938 2.375 18.75 2.375H6.25C5.90625 2.375 5.625 2.09375 5.625 1.75C5.625 1.40469 5.90625 1.125 6.25 1.125H18.75ZM18.75 7.375C19.0938 7.375 19.375 7.65625 19.375 8C19.375 8.34375 19.0938 8.625 18.75 8.625H6.25C5.90625 8.625 5.625 8.34375 5.625 8C5.625 7.65625 5.90625 7.375 6.25 7.375H18.75ZM18.75 13.625C19.0938 13.625 19.375 13.9062 19.375 14.25C19.375 14.5938 19.0938 14.875 18.75 14.875H6.25C5.90625 14.875 5.625 14.5938 5.625 14.25C5.625 13.9062 5.90625 13.625 6.25 13.625H18.75ZM1.875 9.25C1.18477 9.25 0.625 8.69141 0.625 8C0.625 7.30859 1.18477 6.75 1.875 6.75C2.56523 6.75 3.125 7.30859 3.125 8C3.125 8.69141 2.56523 9.25 1.875 9.25ZM1.875 13C2.56523 13 3.125 13.5586 3.125 14.25C3.125 14.9414 2.56523 15.5 1.875 15.5C1.18477 15.5 0.625 14.9414 0.625 14.25C0.625 13.5586 1.18477 13 1.875 13Z"
                      fill="#681C32" />
                  </svg>
                  <div>
                    List View
                  </div>
                </div>
              </h4>
              <div class="tabs-break">
              </div>
              <h4 class="cursor flex-fill d-flex justify-content-center post-list-view" :class="[{'view-active' : defaultView == 'mapView'}]"
                @click="changeViewHandler('mapView')">
                <div class="d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                    <path
                      d="M9.16667 3.88889C9.16667 3.42882 9.53819 3.05556 10 3.05556C10.4618 3.05556 10.8333 3.42882 10.8333 3.88889C10.8333 4.35069 10.4618 4.72222 10 4.72222C9.53819 4.72222 9.16667 4.35069 9.16667 3.88889ZM9.48611 10.8021C8.37153 9.44097 5.83333 6.0625 5.83333 4.16667C5.83333 1.86563 7.69792 0 10 0C12.3021 0 14.1667 1.86563 14.1667 4.16667C14.1667 6.0625 11.6285 9.44097 10.5139 10.8021C10.2465 11.1667 9.75347 11.1667 9.48611 10.8021ZM12.7292 5.3507C12.9618 4.82639 13.0556 4.42361 13.0556 4.16667C13.0556 2.47917 11.6875 1.11111 10 1.11111C8.3125 1.11111 6.94444 2.47917 6.94444 4.16667C6.94444 4.42361 7.03819 4.82639 7.27083 5.3507C7.49653 5.91667 7.81597 6.50694 8.1875 7.10764C8.78125 8.07292 9.46875 9.00694 10 9.69097C10.5313 9.00694 11.2188 8.07292 11.8125 7.10764C12.184 6.50694 12.5035 5.91667 12.7292 5.3507ZM14.0938 7.73958C14.066 7.75 14.0382 7.75695 14.0069 7.76389C14.2917 7.27431 14.5521 6.76736 14.7639 6.27431L18.8576 4.63542C19.4062 4.41667 20 4.81944 20 5.40972V14.8125C20 15.1528 19.7917 15.4583 19.4757 15.5868L14.0938 17.7396C13.9792 17.7847 13.8542 17.7917 13.7361 17.7569L6.14236 15.5868L1.14271 17.5868C0.595486 17.8056 0 17.4028 0 16.8125V7.40972C0 7.06944 0.207465 6.76389 0.523958 6.63542L4.80208 4.92708C4.875 5.28819 4.98611 5.64931 5.12153 5.99306L1.11111 7.59722V16.4028L5.55556 14.625V10.5243C5.55556 10.25 5.80556 9.96875 6.11111 9.96875C6.41667 9.96875 6.66667 10.25 6.66667 10.5243V14.5799L13.3333 16.4861V10.5243C13.3333 10.25 13.5833 9.96875 13.8889 9.96875C14.1944 9.96875 14.4444 10.25 14.4444 10.5243V16.4028L18.8889 14.625V5.81945L14.0938 7.73958Z"
                      fill="#4A4C4F" />
                  </svg>
                  <div>
                    Map View
                  </div>
                </div>
              </h4>
            </div>
            <table class="table table-striped" v-if="defaultView == 'listView'">
              <tbody>
                <tr class="py-3">
                  <th scope="col">Location Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone</th>
                  <th scope="col"></th>
                </tr>
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

            <div v-if="defaultView == 'mapView'">
              Hello
            </div>
          </div>
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

.tabs-break {
  height: 40px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid darkgray;
  padding-bottom: 10px;
}

.cursor {
  cursor: pointer;
}

.post-list-view,
.post-map-view {
  height: 58px;
  margin-top: 12px;
}

.view-active {
  color: #681C32;
  border-bottom: 2px solid #681C32;
}
</style>