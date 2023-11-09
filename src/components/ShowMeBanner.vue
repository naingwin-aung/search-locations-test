<script setup>
import { reactive, ref } from "vue";

const postTypes = reactive([
  'Agency Banking',
  'ATMs',
  'Branches',
  'Agents',
  'Merchants',
  'Exchange Counters'
]);

const type = ref('Exchange Counters');

</script>
<template>
  <div class="container">
    <div class="mt-5">
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-md-8">
          <div class="card-box">
            <p class="text-muted m-0 small">Show Me</p>
            <div class="d-flex gap-4 justify-content-center p-2">
              <div v-for="postType in postTypes" :key="postType">
                  <div class="d-flex align-items-center">
                    <input type="radio" :id="postType" name="post_type" :value="postType" :checked="postType === type" class="cursor post-type-radio">
                    <label :for="postType" class="margin-start cursor">{{ postType }}</label>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.cursor {
  cursor: pointer;
}
</style>