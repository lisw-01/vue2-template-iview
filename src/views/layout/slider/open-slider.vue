<template>
  <div class="slider-menu-open">
    <Menu
      :mode="menu_mode"
      :theme="menutheme"
      :accordion="menu_accordion"
      :width="menuwidth"
      :active-name="activeMenuName"
      :open-names="openNames"
      @on-select="selectMenu"
      @on-open-change="updateOpenNames"
    >
      <template v-if="menuList.length">
        <template v-for="(menu1, index) in menuList">
          <!-- 一级菜单模板 -->
          <template v-if="!menu1.children">
            <MenuItem
              :name="menu1.name"
              :title="menu1.title"
              :key="'menu1' + index"
            >
              <span class="menu-item" :key="'menu-item1' + index">
                <Icon :type="menu1.icon" :key="'icon1' + index" />
                <span class="title-span" :key="'title-span1' + index">{{
                  menu1.title
                }}</span>
              </span>
            </MenuItem>
          </template>
          <!-- 该一级菜单，有且只有一个二级菜单，并且该二级菜单没有三级菜单。 则该二级菜单提高等级 为一级菜单 -->
          <template
            v-else-if="
              menu1.children &&
              menu1.children.length == 1 &&
              !menu1.children[0].children
            "
          >
            <MenuItem
              :name="menu1.children[0].name"
              :title="menu1.children[0].title"
              :key="'menu1' + index"
              :class="[
                activeMenuName === menu1.children[0].name &&
                menutheme == 'dark'
                  ? 'menu-item-selected-dark'
                  : '',
                activeMenuName === menu1.children[0].name &&
                menutheme == 'light'
                  ? 'menu-item-selected-light'
                  : '',
              ]"
            >
              <span class="menu-item" :key="'menu-item1' + index">
                <Icon :type="menu1.children[0].icon" :key="'icon1' + index" />
                <span class="title-span" :key="'title-span1' + index">{{
                  menu1.children[0].title
                }}</span>
              </span>
            </MenuItem>
          </template>
          <!-- 该一级菜单，有>1个二级菜单； 或者有且只有一个二级菜单，但是该二级菜单有三级菜单 -->
          <template v-else-if="menu1.children && menu1.children.length >= 1">
            <Submenu :name="menu1.name" :key="'menu1' + index">
              <template slot="title">
                <span class="menu-item" :key="'menu-item1' + index">
                  <Icon :type="menu1.icon" :key="'icon1' + index" />
                  <span class="title-span" :key="'title-span1' + index">{{
                    menu1.title
                  }}</span>
                </span>
              </template>
              <template v-for="(menu2, index) in menu1.children">
                <!-- 二级菜单下没有三级菜单 -->
                <template v-if="!menu2.children">
                  <MenuItem
                    :name="menu2.name"
                    :title="menu2.title"
                    :key="'menu2' + index"
                  >
                    <span class="menu-item" :key="'menu-item2' + index">
                      <Icon :type="menu2.icon" :key="'icon2' + index" />
                      <span class="title-span" :key="'title-span2' + index">{{
                        menu2.title
                      }}</span>
                    </span>
                  </MenuItem>
                </template>
                <!-- 二级菜单下有三级菜单 -->
                <template v-else-if="menu2.children && menu2.children.length">
                  <Submenu :name="menu2.name" :key="'menu2' + index">
                    <template slot="title">
                      <span class="menu-item" :key="'menu-item2' + index">
                        <Icon :type="menu2.icon" :key="'icon2' + index" />
                        <span class="title-span" :key="'title-span2' + index">{{
                          menu2.title
                        }}</span>
                      </span>
                    </template>
                    <template v-for="(menu3, index) in menu2.children">
                      <MenuItem
                        :name="menu3.name"
                        :title="menu3.title"
                        :key="'menu3' + index"
                      >
                        <span class="menu-item" :key="'menu-item3' + index">
                          <Icon :type="menu2.icon" :key="'icon3' + index" />
                          <span
                            class="title-span"
                            :key="'title-span3' + index"
                            >{{ menu3.title }}</span
                          >
                        </span>
                      </MenuItem>
                    </template>
                  </Submenu>
                </template>
              </template>
            </Submenu>
          </template>
        </template>
      </template>
    </Menu>
  </div>
</template>
<script>
import { MenuItem, Submenu } from "view-design";

export default {
  data: () => {
    return {
      menu_mode: "vertical", // 菜单类型，可选值为 horizontal（水平） 和 vertical（垂直） 默认 vertical
      menu_accordion: true, // true-手风琴模式 false-- 默认值  false
    };
  },
  props: {
    menuList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    menuwidth: {
      type: String,
      default: () => {
        return "200px";
      },
    },
    //主题，可选值为 light|dark |primary，其中 primary 只适用于 mode="horizontal"  默认 light
    menutheme: {
      type: String,
      default: () => {
        return "dark";
      },
    },
  },
  computed: {
    //激活菜单的name值  String | Number
    activeMenuName() {
      return this.$route.name; // 因此菜单的name值要和   路由的name属性值保持对应
    },
    // 展开的 Submenu 的 name 集合  Array
    openNames() {
      console.log(this.$store.state.app.openNames);
      return this.$store.state.app.openNames;
    },
  },
  methods: {
    selectMenu(name) {
      this.$router.push({
        name: name,
      });
    },
    // 当 展开/收起 子菜单时触发   opennames 当前展开的 Submenu 的 name 值数组
    updateOpenNames(opennames) {
      this.$store.commit("app/updateOpenNames", {
        type: "openchange",
        data: opennames,
      });
    },
  },
  created() {
    console.log(this.menuList);
  },
  components: { Submenu, MenuItem },
};
</script>
<style lang="less" scoped>
@import url("~@/base.less");
.slider-menu-open {
  font-size: 2rem;
  // dark 主题下， 提升的二级菜单的选中状态
  .menu-item-selected-dark {
    background-color: @menu-background-color-dark!important;
    color: @menu-color-dark!important;
  }
  // light 主题下， 提升的二级菜单的选中状态
  .menu-item-selected-light {
    background-color: @menu-background-color-light!important;
    color: @menu-color-light!important;
  }
  .menu-item {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    padding-right: 10px;
  }
}
.ivu-menu-item,
.ivu-menu-submenu {
  text-align: left;
}
</style>