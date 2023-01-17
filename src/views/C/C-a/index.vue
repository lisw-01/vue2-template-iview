<template>
  <div>
    <h5 style="height:500px">{{ msg }}</h5>
    <hr />
    <router-view />
  </div>
</template>
<script>
export default {
  name: "Ca",
  data: () => {
    return {
      msg: "page C-a",
    };
  },
};
</script>