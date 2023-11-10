<script setup>
import { onMounted, reactive, ref, watch, watchEffect } from "vue";

const postParams = reactive({
  'post_type': 'branch',
  'taxo_name': 'branch-location'
});

const lang = ref('en');
const loading = ref(false);
const postLoading = ref(false);
const resLocations = ref([]);
const postTypes = ref([]);
const keyword = ref('');
const locationSuggests = ref([]);
const posts = ref([]);

onMounted(() => {
  getPostType();
  getLocations();
})

const getLocations = async () => {
  postLoading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-location/?lang=${lang.value}&taxo_name=${postParams.taxo_name}&search_key=`);
  console.log(res.data.data.length);
  resLocations.value = res.data.data;
  postLoading.value = false;
}

const getPostType = async () => {
  loading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-lists?lang=${lang.value}`)
  postTypes.value = res.data.data;
  loading.value = false;
}

let debounceTimer;
const searchLocation = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (keyword.value) {
      locationSuggests.value = resLocations.value.filter(location => location.includes(keyword.value))
        .slice(0, 5);
    } else {
      locationSuggests.value = [];
    }
  }, 400);
}

const clearHandler = () => {
  keyword.value = '';
  locationSuggests.value = [];
}

const getPostTypeAndTaxoName = async (postType, taxoName) => {
  postParams.post_type = postType;
  postParams.taxo_name = taxoName;
  getLocations();
}

const replaceSearchKeyword = (location) => {
  keyword.value = location;
}

watch(postParams, () => {
  keyword.value = '';
  locationSuggests.value = [];
  posts.value = [];
})

const postHandler = async () => {
  postLoading.value = true;
  locationSuggests.value = [];
  const parts = keyword.value.split(', ');

  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/search?lang=${lang.value}&post_type=${postParams.post_type}&taxo_name=${postParams.taxo_name}&search_key=${parts[1]}`);
  console.log(res.data.data);
  posts.value = res.data.data;
  postLoading.value = false;
}

</script>

<template>
  <div>
    <div class="container">
      <div class="mt-5 mb-5">
        <!-- start search box -->
        <div class="d-flex justify-content-center align-items-center pb-2 gap-3 ">
          <div class="d-flex position-relative w-50">
            <!-- serach icon -->
            <div class="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_6977_3084" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_6977_3084)">
                  <path
                    d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                    fill="#4A4C4F" />
                </g>
              </svg>
            </div>

            <input type="text" class="form-input" v-model="keyword" @input="searchLocation">

            <!-- close icon -->
            <div class="close-icon">
              <svg @click="clearHandler" v-if="keyword" class="cursor" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_6977_3087" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_6977_3087)">
                  <path
                    d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                    fill="#62656A" />
                </g>
              </svg>
            </div>

            <div v-if="locationSuggests && locationSuggests.length > 0" class="location-wrapper">
              <div class="location-box-wrapper">
                <div v-for="location in locationSuggests" :key="location" class="location-box cursor"
                  @click="replaceSearchKeyword(location)">
                  {{ location }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button class="btn-search" @click="postHandler">Search</button>
          </div>
        </div>
        <!-- end search box -->

        <!--start show me banner -->
        <div v-if="!loading" class="row d-flex justify-content-center mt-3">
          <div class="col-12 col-md-8">
            <div class="card-box">
              <div class="text-muted m-0 small">Show Me</div>
              <div class="d-flex gap-4 justify-content-center p-2">
                <div v-for="(taxo_name, postType) in postTypes" :key="taxo_name" class="d-flex align-items-center">
                  <input type="radio" :id="postType" name="post_type" :value="taxo_name.tax"
                    :checked="taxo_name.tax === postParams.taxo_name"
                    @input="getPostTypeAndTaxoName(postType, taxo_name.tax)" class="cursor post-type-radio">
                  <label :for="postType" class="margin-start cursor">{{ taxo_name.label }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- end show me banner -->
        <div v-if="postLoading" class="mt-5">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="60px"
            height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="rotate(0 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.8184523809523808s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(30 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.744047619047619s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(60 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.6696428571428571s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(90 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.5952380952380952s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(120 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.5208333333333333s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(150 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.4464285714285714s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(180 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.3720238095238095s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(210 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.2976190476190476s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(240 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.2232142857142857s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(270 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.1488095238095238s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(300 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s"
                  begin="-0.0744047619047619s" repeatCount="indefinite" />
              </rect>
            </g>
            <g transform="rotate(330 50 50)">
              <rect x="49.5" y="24" rx="0" ry="0" width="1" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8928571428571428s" begin="0s"
                  repeatCount="indefinite" />
              </rect>
            </g>
          </svg>
        </div>
        <div v-else-if="posts && posts.length > 0" class="row mt-4">
          <div class="col-12">
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
                    <td>{{ post.title }}</td>
                    <td>{{ post.meta_data.address }}</td>
                    <td>{{ post.id }}</td>
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
    </div>
  </div>
</template>

<style scoped>
.cursor {
  cursor: pointer;
}

.form-input {
  display: block;
  width: 100%;
  height: 60px;
  border: 1px solid darkgray;
  font-size: 21px;
  outline: none;
  border-left: none;
  border-right: none;
}

.search-icon {
  width: 75px;
  border: 1px solid darkgray;
  border-top-left-radius: 60%;
  border-bottom-left-radius: 60%;
  border-right: none;
  padding-top: 15px;
  text-align: center;
}

.close-icon {
  width: 75px;
  border: 1px solid darkgray;
  border-top-right-radius: 60%;
  border-bottom-right-radius: 60%;
  border-left: none;
  padding-top: 15px;
  text-align: center;
}

.location-wrapper {
  position: absolute;
  width: 100%;
  top: 70px;
  left: 0;
  right: 0;
}

.location-box-wrapper {
  border: 1px solid darkgray;
  border-radius: 20px;
  background-color: white;
}

.location-box {
  padding: 12px;
}

.location-box:not(:last-child) {
  border-bottom: 1px solid darkgray;
}

.card-box {
  border: 1px solid darkgray;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 8px 30px;
}

.post-type-radio {
  accent-color: #681C32;
}

.margin-start {
  margin-left: 6px;
}

.btn-search {
  background-color: transparent;
  color: #313235;
  border: 1px solid darkgray;
  border-radius: 100px;
  padding: 12px 24px;
  transition: background-color 0.5s ease;
}

.btn-search:hover {
  background-color: #313235;
  color: white;
}

.post-table-wrapper {
  border: 1px solid darkgray;
  border-radius: 20px;
  max-height: 570px;
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