<template>
  <div class="slider-menu-collapsed">
    <template v-if="menuList.length">
      <template v-for="(menu1, index) in menuList">
        <!-- 一级菜单模板 -->
        <template v-if="!menu1.children">
          <div
            :class="[
              'menu-item',
              activeMenu1Name != menu1.name && menutheme == 'dark'
                ? 'menu-item-default-dark'
                : '',
              activeMenu1Name != menu1.name && menutheme == 'light'
                ? 'menu-item-default-light'
                : '',
              activeMenu1Name == menu1.name && menutheme == 'dark'
                ? 'menu-item-selected-dark'
                : '',
              activeMenu1Name == menu1.name && menutheme == 'light'
                ? 'menu-item-selected-light'
                : '',
            ]"
            @click="selectMenu(menu1)"
            :key="'menu1' + index"
          >
            <Tooltip placement="right">
              <Icon :type="menu1.icon" />
              <div slot="content">
                <Icon :type="menu1.icon" />
                <span>{{ menu1.title }}</span>
              </div>
            </Tooltip>
          </div>
        </template>
        <!-- 该一级菜单， 有且只有一个二级菜单，并且该二级菜单下 无子菜单，  二级菜单提级到一级菜单 -->
        <template
          v-else-if="
            menu1.children &&
            menu1.children.length == 1 &&
            !menu1.children[0].children
          "
        >
          <div
            :class="[
              'menu-item',
              activeMenu1Name != menu1.name && menutheme == 'dark'
                ? 'menu-item-default-dark'
                : '',
              activeMenu1Name != menu1.name && menutheme == 'light'
                ? 'menu-item-default-light'
                : '',
              activeMenu1Name == menu1.name && menutheme == 'dark'
                ? 'menu-item-selected-dark'
                : '',
              activeMenu1Name == menu1.name && menutheme == 'light'
                ? 'menu-item-selected-light'
                : '',
            ]"
            @click="selectMenu(menu1.children[0])"
            :key="'menu1' + index"
          >
            <Tooltip placement="right">
              <Icon :type="menu1.children[0].icon" />
              <div slot="content">
                <Icon :type="menu1.children[0].icon" />
                <span>{{ menu1.children[0].title }}</span>
              </div>
            </Tooltip>
          </div>
        </template>
        <!-- 该一级菜单，有>1个二级菜单； 或者有且只有一个二级菜单，但是该二级菜单有三级菜单 -->
        <template v-else-if="menu1.children && menu1.children.length >= 1">
          <Dropdown
            :key="'menu1' + index"
            placement="right-start"
            @on-click="menuClick"
          >
            <div
              :class="[
                'menu-item',
                activeMenu1Name != menu1.name && menutheme == 'dark'
                  ? 'menu-item-default-dark'
                  : '',
                activeMenu1Name != menu1.name && menutheme == 'light'
                  ? 'menu-item-default-light'
                  : '',
                activeMenu1Name == menu1.name && menutheme == 'dark'
                  ? 'menu-item-selected-dark'
                  : '',
                activeMenu1Name == menu1.name && menutheme == 'light'
                  ? 'menu-item-selected-light'
                  : '',
              ]"
            >
              <Icon :type="menu1.icon" />
            </div>
            <DropdownMenu slot="list">
              <template v-for="(menu2, index) in menu1.children">
                <!-- 该二级菜单没有三级菜单 -->
                <template v-if="!menu2.children">
                  <DropdownItem :key="'menu2' + index" :name="menu2.name">
                    <Icon :type="menu2.icon" />
                    <span>{{ menu2.title }}</span>
                  </DropdownItem>
                </template>
                <!-- 该二级菜单有三级菜单 -->
                <template v-if="menu2.children && menu2.children.length">
                  <Dropdown :key="'menu2' + index" placement="right-start">
                    <DropdownItem :name="menu2.name">
                      {{ menu2.title }}
                      <Icon type="ios-arrow-forward"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                      <template v-for="(menu3, index) in menu2.children">
                        <DropdownItem
                          :name="menu3.name"
                          :key="'menu3' + index"
                          >{{ menu3.title }}</DropdownItem
                        >
                      </template>
                    </DropdownMenu>
                  </Dropdown>
                </template>
              </template>
            </DropdownMenu>
          </Dropdown>
        </template>
      </template>
    </template>
  </div>
</template>
<script>
import { Dropdown, DropdownMenu } from "view-design";

export default {
  data: () => {
    return {};
  },
  props: {
    menuList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    menutheme: {
      type: String,
      default: () => {
        return "dark";
      },
    },
  },
  computed: {
    //激活菜单所属一级菜单的 name值 【collapsed-slier只处理一级菜单】
    activeMenu1Name() {
      const activemenuname = this.$route.name;
      const rootmenu = this.$util.getLeaf_FromRouteTree(
        this.$store.state.app.routeTree,
        activemenuname
      );
      return rootmenu ? rootmenu.name : "";
    },
  },
  methods: {
    navigator(routename) {
      this.$router.push({
        name: routename,
      });
    },
    selectMenu(menuobj) {
      this.navigator(menuobj.name);
    },
    menuClick(menuname) {
      this.navigator(menuname);
    },
  },
  components: { Dropdown, DropdownMenu },
};
</script>
<style lang="less" scoped>
@import url("~@/base.less");
@deep:~ '>>>'; // 样式穿透
.slider-menu-collapsed {
  .menu-item {
    height: 50px;
    line-height: 50px;
    width: 100%;
  }
  .menu-item-default-dark {
    background-color: @menu-default-background-color-dark;
    color: @menu-default-color-dark;
  }
  .menu-item-default-light {
    background-color: @menu-default-background-color-light;
    color: @menu-default-color-light;
  }
  .menu-item-selected-dark {
    background-color: @menu-selected-background-color-dark!important;
    color: @menu-selected-color-dark!important;
  }
  .menu-item-selected-light {
    background-color: @menu-selected-background-color-light!important;
    color: @menu-selected-color-light!important;
  }
}
@{deep} .ivu-dropdown {
  background: #fff;
  color: #000;
  width: 100%;
}

@{deep} .ivu-select-dropdown {
  width: 100%;
}
@{deep} .ivu-dropdown-menu {
  width: 100%;
  min-width: auto;
}
@{deep} .ivu-dropdown-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>