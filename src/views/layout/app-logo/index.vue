<template>
  <div class="image-containter">
    <div v-if="!isCollapsed" class="icon bigIcon">
      <img :src="app_logo" />
    </div>
    <div v-else class="icon smallIcon">
      <img :src="app_logo" />
    </div>
  </div>
</template>
<script>
export default {
  name: "app-logo",
  data: () => {
    return {
      app_logo: require("@/assets/image/loginbg.jpg"),
    };
  },
  props: {
    isCollapsed: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {},
  created() {},
};
</script>
<style lang="less" scoped>
.image-containter {
  width: 100%;
  height: 100px;
  .icon {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bigIcon {
    img {
      width: 80%;
      height: 80%;
    }
  }
  .smallIcon {
    img {
      width: 40%;
      height: 40%;
    }
  }
}
</style>