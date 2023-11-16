<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import './assets/css/style.css';

const postParams = reactive({
  'post_type': 'branch',
  'taxo_name': 'branch-location'
});

const mapCenter = reactive({
  'latitude': null,
  'longitude': null,
});

const selectedItem = ref(null);
const dataEmpty = ref('');
const lang = ref('en');
const loading = ref(false);
const postLoading = ref(false);
const resLocations = ref([]);
const postTypes = ref([]);
const keyword = ref('');
const locationSuggests = ref([]);
const posts = ref([]);
const defaultView = ref('listView');
const page = ref(null);
const scrollComponent = ref(null);
const pageChangeLoading = ref(false);
const totalPageCount = ref(null);
const userLocation = reactive({
  'latitude': null,
  'longitude': null,
});
const services = ref([]);
const postTitle = ref('');

const map = ref(null);
const infowindow = ref(null);

const initializeMap = () => {
  map.value = new google.maps.Map(document.getElementById('dining-map'), {
    zoom: 10,
    center: new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
    mapTypeId: 'roadmap',
  });

  infowindow.value = new google.maps.InfoWindow();

  let iconBase = `https://mabbank.mabsayyaungchelrun.com/wp-content/uploads/2023/11/MAB-Logo-Pattern.png`;
  let icons = {
    info: {
      icon: iconBase,
    },
  };

  posts.value.forEach((post) => {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(post.meta_data.latitude, post.meta_data.longitude),
      animation: google.maps.Animation.DROP,
      icon: icons.info.icon,
      map: map.value,
      title: post.title,
    });

    var contentString = `<div id="branch-${post.id}" class="branch-info">
                                <h2>${post.title}</h2>
                                <p class="address">${post.meta_data.address}</p>
                                <p class="phone"> Tel: ${post.meta_data.phone}</p>
                              </div>`;

    marker.addListener('click', () => {
      infowindow.value.setContent(contentString);
      infowindow.value.open(map.value, marker);
    });
  })
}

const handleScroll = () => {
  let element = scrollComponent.value;
  console.log(element.scrollTop, element.scrollHeight, element.clientHeight);

  // Calculate a small margin of error for the scroll comparison
  const marginOfError = 1;

  if (element.scrollTop >= element.scrollHeight - element.clientHeight - marginOfError) {
    if (!pageChangeLoading.value) {
      page.value += 1;
      console.log(page.value, totalPageCount.value);
      if (page.value <= totalPageCount.value) {
        postHandler(page.value, true);
      }
    }
  }
};

watch(scrollComponent, () => {
  if (scrollComponent.value) {
    scrollComponent.value.addEventListener("scroll", handleScroll);
  }
})

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
  postHandler(1);
})

let debounceTimer;
const searchLocation = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (keyword.value) {
      locationSuggests.value = resLocations.value.filter(location => location.toLowerCase().includes(keyword.value.toLowerCase()))
        .slice(0, 5);
    } else {
      locationSuggests.value = [];
    }
  }, 400);
}

const clearHandler = () => {
  keyword.value = '';
  locationSuggests.value = [];
  selectedItem.value = null;
}

const getPostTypeAndTaxoName = async (postType, taxoName) => {
  postParams.post_type = postType;
  postParams.taxo_name = taxoName;
  keyword.value = '';
  locationSuggests.value = [];
  posts.value = [];
  getLocations();
  postHandler(1);
}

const replaceSearchKeyword = (location) => {
  keyword.value = location;
  locationSuggests.value = [];
  selectedItem.value = null;
}

const handleKeyDown = () => {
  if (selectedItem.value === null || selectedItem.value === locationSuggests.value.length - 1) {
    selectedItem.value = 0;
  } else {
    selectedItem.value++;
  }

  changeKeyword();
}

const handleKeyUp = () => {
  if (selectedItem.value === null || selectedItem.value === 0) {
    selectedItem.value = locationSuggests.value.length - 1;
  } else {
    selectedItem.value--;
  }

  changeKeyword();
}

const changeKeyword = () => {
  if (locationSuggests.value[selectedItem.value]) {
    keyword.value = locationSuggests.value[selectedItem.value];
  }
}

const postHandler = async (pagePaginate, isPageChange = false) => {
  if (!isPageChange) {
    postLoading.value = true;
  } else {
    pageChangeLoading.value = true;
  }
  locationSuggests.value = [];

  const res = keyword.value === 'Current Location'
    ? await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/search-by-location?lang=${lang.value}&post_type=${postParams.post_type}&lat=${userLocation.latitude}&long=${userLocation.longitude}&paged=${pagePaginate}`)

    : await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/search?lang=${lang.value}&post_type=${postParams.post_type}&taxo_name=${postParams.taxo_name}&search_key=${keyword.value}&paged=${pagePaginate}`);

  if (res.data.data) {
    if (pagePaginate == 1) {
      page.value = 1;
      posts.value = res.data.data;
    } else {
      posts.value = [...posts.value, ...res.data.data];
    }

    totalPageCount.value = res.data.pagination.total_page_count;
    mapCenter.latitude = res.data.center_location.latitude;
    mapCenter.longitude = res.data.center_location.longitude;

    initializeMap();
  } else {
    pageChangeLoading.value = false;
    if (pagePaginate === 1) {
      posts.value = [];
    }
    dataEmpty.value = ucfirst(`${postParams.post_type} not found.`);
  }

  if (!isPageChange) {
    postLoading.value = false;
  } else {
    pageChangeLoading.value = false;
  }
}

const changeViewHandler = (view) => {
  defaultView.value = view;
}

const ucfirst = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const showGetDirectionWithMap = (location, newLat, newLng) => {
  const encodedPlace = encodeURIComponent(`MAB ${location}`);
  const zoom = 18;
  const url = `https://www.google.com/maps/search/${encodedPlace}/@${newLat},${newLng},${zoom}z/${newLat},${newLng},17z`;

  window.open(url, '_blank');
};

const searchUserCurrentLocation = async () => {
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition((position) => {
      keyword.value = 'Current Location';
      userLocation.latitude = position.coords.latitude;
      userLocation.longitude = position.coords.longitude;
      postHandler(1);
    });
  }
}

const showSeeServices = (title, branchService) => {
  services.value = branchService;
  postTitle.value = title;
}
</script>

<template>
  <div>
    <div class="container">
      <div class="mt-5 mb-5">
        <!-- start search box -->
        <div class="d-flex d-mobile-location justify-content-center align-items-center pb-2 gap-3 ">
          <div class="fw-bold">
            Type Location
          </div>
          <div class="d-flex position-relative w-50 mobile-search">
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

            <input type="text" class="location-form-input" v-model="keyword" @input="searchLocation" @keyup.down="handleKeyDown"
              @keyup.up="handleKeyUp" @keyup.enter="postHandler(1)">

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
                <div v-for="(location, index) in locationSuggests" :key="location" class="location-box cursor"
                  @click="replaceSearchKeyword(location)" @mouseenter="selectedItem = index"
                  :class="{ 'search-selected': selectedItem === index }">
                  {{ location }}
                </div>
              </div>
            </div>
          </div>

            <button class="btn-location-search" @click="postHandler(1)">Search</button>
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

        <!-- start spinner loading -->
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

        <!-- start post -->
        <div v-show="!postLoading && posts && posts.length > 0" class="row mt-4">
          <div class="col-12">
            <div class="d-flex justify-content-around align-items-center post-tabs">
              <h5 class="cursor flex-fill d-flex justify-content-center post-list-view"
                :class="[{ 'view-active': defaultView == 'listView' }]" @click="changeViewHandler('listView')">
                <div class="d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 18" fill="none">
                    <path
                      d="M1.875 0.5C2.56523 0.5 3.125 1.05977 3.125 1.75C3.125 2.44141 2.56523 3 1.875 3C1.18477 3 0.625 2.44141 0.625 1.75C0.625 1.05977 1.18477 0.5 1.875 0.5ZM18.75 1.125C19.0938 1.125 19.375 1.40469 19.375 1.75C19.375 2.09375 19.0938 2.375 18.75 2.375H6.25C5.90625 2.375 5.625 2.09375 5.625 1.75C5.625 1.40469 5.90625 1.125 6.25 1.125H18.75ZM18.75 7.375C19.0938 7.375 19.375 7.65625 19.375 8C19.375 8.34375 19.0938 8.625 18.75 8.625H6.25C5.90625 8.625 5.625 8.34375 5.625 8C5.625 7.65625 5.90625 7.375 6.25 7.375H18.75ZM18.75 13.625C19.0938 13.625 19.375 13.9062 19.375 14.25C19.375 14.5938 19.0938 14.875 18.75 14.875H6.25C5.90625 14.875 5.625 14.5938 5.625 14.25C5.625 13.9062 5.90625 13.625 6.25 13.625H18.75ZM1.875 9.25C1.18477 9.25 0.625 8.69141 0.625 8C0.625 7.30859 1.18477 6.75 1.875 6.75C2.56523 6.75 3.125 7.30859 3.125 8C3.125 8.69141 2.56523 9.25 1.875 9.25ZM1.875 13C2.56523 13 3.125 13.5586 3.125 14.25C3.125 14.9414 2.56523 15.5 1.875 15.5C1.18477 15.5 0.625 14.9414 0.625 14.25C0.625 13.5586 1.18477 13 1.875 13Z"
                      fill="#000" />
                  </svg>
                  <div>
                    List View
                  </div>
                </div>
              </h5>
              <div class="tabs-break">
              </div>
              <h5 class="cursor flex-fill d-flex justify-content-center post-list-view"
                :class="[{ 'view-active': defaultView == 'mapView' }]" @click="changeViewHandler('mapView')">
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
              </h5>
            </div>
            <div class="post-data-table-wrapper" ref="scrollComponent">
              <!-- start list view -->
              <div class="table-responsive">
                <table class="table table-striped border-0 post-data-table" v-show="defaultView == 'listView'">
                  <thead>
                    <tr class="py-3">
                      <th scope="col">Location Name</th>
                      <th scope="col">Address</th>
                      <th scope="col" v-if="postParams.post_type !== 'atm'">
                        Phone
                      </th>
                      <th scope="col" v-if="postParams.post_type === 'atm' || postParams.post_type === 'branch'">Services
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="post in posts" :key="post" class="post-data">
                      <td>{{ post.title }}</td>
                      <td>{{ post.meta_data.address }}</td>
                      <td v-if="postParams.post_type !== 'atm'">{{ post.meta_data?.phone }}</td>
  
                      <td v-if="postParams.post_type === 'atm' || postParams.post_type === 'branch'" class="post-services">
  
                        <span v-if="postParams.post_type === 'atm'">
                          <span v-if="post.meta_data.available && post.meta_data.available !== '0'" class="text-success">
                            <i class="fa-solid fa-check"></i> Available
                          </span>
                          <span v-else class="text-danger">
                            <i class="fa-solid fa-xmark"></i> Unavailable
                          </span>
                        </span>
  
                        <span v-if="postParams.post_type === 'branch' && post.meta_data.available_services"
                          class="branch-services cursor d-flex align-items-center gap-1" data-bs-toggle="modal"
                          data-bs-target="#serviceModal"
                          @click="showSeeServices(post.title, post.meta_data.available_services)">
                          <i class="fa-regular fa-eye"></i>
                          <span class="branch-service-see">
                            See services
                          </span>
                        </span>
                      </td>
                      <td>
                        <button class="btn-post-direction"
                          @click="showGetDirectionWithMap(post.title, 'atm_' + post.meta_data.latitude, post.meta_data.longitude)">
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

              <div v-if="pageChangeLoading" class="d-flex justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;"
                  width="60px" height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
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
              <!-- end list view -->
              <div v-show="defaultView == 'mapView'">
                <div id="dining-map" class="posts-map"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- end post -->


        <!-- Modal -->
        <div class="modal fade" id="serviceModal" tabindex="-1" aria-labelledby="serviceModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-border-radius">
              <div class="service-modal-header">
                <div>
                  <div class="d-flex justify-content-end">
                    <svg class="cursor mt-2" data-bs-dismiss="modal" aria-label="Close" xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                  <h6 class="ms-4 modal-title-width">
                    Available Services at {{ postTitle }}
                    <div class="border-bottom mt-3">
                    </div>
                  </h6>
                </div>
              </div>
              <div class="modal-body modal-body-start-padding mb-3 pt-0">
                <div v-for="service in services" :key="service.service_title" class="mb-2 ms-2">
                  <span :class="[{ 'text-muted': !service.is_available }]">
                    <span class="me-2 text-success" v-if="service.is_available">
                      <i class="fa-solid fa-check"></i>
                    </span>
                    <span v-else class="me-2">
                      <i class="fa-solid fa-xmark"></i>
                    </span>
                    {{ service.service_title }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>