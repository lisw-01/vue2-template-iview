<template>
  <div>
    <h5>{{ msg }}</h5>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "Ca1",
  data: () => {
    return {
      msg: "page C-a-1",
    };
  },
};
</script>