<script setup>
import { onMounted, reactive, ref, watch } from "vue";

const postParams = reactive({
  'post_type': 'branch',
  'taxo_name': 'branch-location'
});

const lang = ref('en');
const loading = ref(false);
const postLoading = ref(false);
const keyword = ref('');
const resLocations = ref([]);
const postTypes = ref([]);
const locationSuggests = ref([]);

const getLocations = async () => {
  postLoading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-location/?lang=${lang.value}&taxo_name=${postParams.taxo_name}&search_key=`);
  resLocations.value = res.data.data;
  postLoading.value = false;
}

const getPostType = async () => {
  loading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-lists?lang=${lang.value}`)
  postTypes.value = res.data.data;
  loading.value = false;
}

onMounted(() => {
  getPostType();
  getLocations();
})

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
  keyword.value = '';
  locationSuggests.value = [];
  getLocations();
}

const replaceSearchKeyword = (location) => {
  keyword.value = location;
  locationSuggests.value = [];
}

</script>

<template>
  <div>
    <div class="container">
      <div class="mt-5 mb-5">
        <!-- start search box -->
        <div class="d-flex justify-content-center align-items-center pb-2 gap-3 ">
          <div>
            Type Location
          </div>
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
            <button class="btn-white-secondary" @click="postHandler(1)">Search</button>
          </div>
        </div>

        <div v-if="!loading" class="d-flex justify-content-center align-items-center">
          <div class="me-2 bottom-line-currenct-location cursor" @click="searchUserCurrentLocation">
            Or use my current location
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_7154_5656)">
              <path
                d="M7.97278 16.005L7.50806 15.6067C6.86741 15.0702 1.27344 10.2391 1.27344 6.7052C1.27344 3.00527 4.27284 0.00585938 7.97278 0.00585938C11.6727 0.00585938 14.6721 3.00527 14.6721 6.7052C14.6721 10.2391 9.07816 15.0703 8.44016 15.6093L7.97278 16.005ZM7.97278 1.45445C5.07425 1.45773 2.72534 3.80664 2.72206 6.70517C2.72206 8.92524 6.16369 12.4717 7.97278 14.095C9.78191 12.4711 13.2235 8.92255 13.2235 6.70517C13.2202 3.80664 10.8713 1.45777 7.97278 1.45445Z"
                fill="#681C32" />
              <path
                d="M7.97197 9.36191C6.50534 9.36191 5.31641 8.17297 5.31641 6.70634C5.31641 5.23972 6.50534 4.05078 7.97197 4.05078C9.43859 4.05078 10.6275 5.23972 10.6275 6.70634C10.6275 8.17297 9.43862 9.36191 7.97197 9.36191ZM7.97197 5.37853C7.23866 5.37853 6.64419 5.973 6.64419 6.70631C6.64419 7.43963 7.23866 8.03409 7.97197 8.03409C8.70528 8.03409 9.29975 7.43963 9.29975 6.70631C9.29975 5.973 8.70531 5.37853 7.97197 5.37853Z"
                fill="#681C32" />
            </g>
            <defs>
              <clipPath id="clip0_7154_5656">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <!-- end search box -->

        <!--start show me banner -->
        <div v-if="!loading" class="row d-flex justify-content-center mt-3">
          <div class="col-12 col-md-8">
            <div class="card-box">
              <div class="text-muted m-0 small">Show Me</div>
              <div class="d-flex gap-4 justify-content-center p-2 flex-wrap">
                <div v-for="(taxo_name, postType) in postTypes" :key="taxo_name" class="d-flex align-items-center ">
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

        <!-- spinner loading -->
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
        <!-- end spinner loading -->

        <div class="row mt-4 post-types">
          <div class="col-12">
            <nav class="post-tabs">
              <div class="nav nav-tabs mb-0 border-0 d-flex justify-content-around align-items-center" id="nav-tab"
                role="tablist">
                <div class="cursor flex-fill nav-link text-center" id="nav-home-tab" data-bs-toggle="tab"
                  data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                  <h4 class="d-flex justify-content-center align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 18" fill="none">
                      <path
                        d="M1.875 0.5C2.56523 0.5 3.125 1.05977 3.125 1.75C3.125 2.44141 2.56523 3 1.875 3C1.18477 3 0.625 2.44141 0.625 1.75C0.625 1.05977 1.18477 0.5 1.875 0.5ZM18.75 1.125C19.0938 1.125 19.375 1.40469 19.375 1.75C19.375 2.09375 19.0938 2.375 18.75 2.375H6.25C5.90625 2.375 5.625 2.09375 5.625 1.75C5.625 1.40469 5.90625 1.125 6.25 1.125H18.75ZM18.75 7.375C19.0938 7.375 19.375 7.65625 19.375 8C19.375 8.34375 19.0938 8.625 18.75 8.625H6.25C5.90625 8.625 5.625 8.34375 5.625 8C5.625 7.65625 5.90625 7.375 6.25 7.375H18.75ZM18.75 13.625C19.0938 13.625 19.375 13.9062 19.375 14.25C19.375 14.5938 19.0938 14.875 18.75 14.875H6.25C5.90625 14.875 5.625 14.5938 5.625 14.25C5.625 13.9062 5.90625 13.625 6.25 13.625H18.75ZM1.875 9.25C1.18477 9.25 0.625 8.69141 0.625 8C0.625 7.30859 1.18477 6.75 1.875 6.75C2.56523 6.75 3.125 7.30859 3.125 8C3.125 8.69141 2.56523 9.25 1.875 9.25ZM1.875 13C2.56523 13 3.125 13.5586 3.125 14.25C3.125 14.9414 2.56523 15.5 1.875 15.5C1.18477 15.5 0.625 14.9414 0.625 14.25C0.625 13.5586 1.18477 13 1.875 13Z"
                        fill="#000" />
                    </svg>
                    <div>
                      List View
                    </div>
                  </h4>
                </div>

                <div class="tabs-break">
                </div>

                <div class="cursor flex-fill nav-link text-center" id="nav-profile-tab" data-bs-toggle="tab"
                  data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                  aria-selected="false">
                  Profile
                </div>
              </div>
            </nav>

            <div class="tab-content p-3 border bg-light" id="nav-tabContent">
              <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <p><strong>This is some placeholder content the Home tab's associated content.</strong>
                  Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps
                  classes to control the content visibility and styling. You can use it with tabs, pills, and any
                  other <code>.nav</code>-powered navigation.</p>
              </div>
              <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <p><strong>This is some placeholder content the Profile tab's associated content.</strong>
                  Clicking another tab will toggle the visibility of this one for the next.
                  The tab JavaScript swaps classes to control the content visibility and styling. You can use it with
                  tabs, pills, and any other <code>.nav</code>-powered navigation.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-white-secondary {
  background-color: #ffffff;
  color: #691C32;
  border: 1px solid #691C32;
  border-radius: 100px;
  padding: 12px 24px;
  transition: background-color 0.5s ease;
  font-weight: 600;
}

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

.post-tabs {
  border: 1px solid darkgray;
  border-bottom: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.tabs-break {
  height: 40px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid darkgray;
  padding-bottom: 10px;
}

.post-data-table-wrapper {
  border: 1px solid darkgray;
  border-top: none;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  max-height: 570px;
  overflow-y: scroll;
}

.post-table-wrapper::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
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

.post-list-view,
.post-map-view {
  height: 58px;
  margin-top: 12px;
}

.view-active {
  color: #681C32;
  border-bottom: 2px solid #681C32;
}

.post-view-table {
  border-top: none !important;
  border-bottom: none !important;
}

.post-data-table>:not(caption)>*>* {
  border-bottom-width: 0px !important
}

.bottom-line-currenct-location {
  color: #691C32;
  border-bottom: 1px solid #691C32;
}

.post-types .nav-tabs .nav-link:focus,
.nav-tabs .nav-link {
  border: none !important;
}

.post-types .nav-tabs .nav-link:focus,
.nav-tabs .nav-link:hover {
  border-color: unset !important;
}

.post-types .nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
  background-color: unset !important;
}

.post-types .nav-link {
  color: unset !important;
}</style>