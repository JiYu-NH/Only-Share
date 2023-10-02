<template>
  <div class="header-container">
    <div class="header" :style="headerStyle">
      <!-- 左边 -->
      <div
        class="left arrow"
        @click="onClickLeft"
        v-if="leftShow"
        :style="leftStyle"
      ></div>

      <!-- 中间 -->
      <div class="title" :style="titleStyle">{{ title }}</div>

      <!-- 右边 -->
      <div
        class="right"
        @click="onClickRight"
        v-if="rightShow"
        :style="rightStyle"
      >
        {{ rightText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //   是否显示左边
    leftShow: {
      type: Boolean,
      default: true,
    },
    //   是否显示右边
    rightShow: {
      type: Boolean,
      default: false,
    },
    //   右边的文本内容
    rightText: {
      type: String,
      default: "",
    },
    //   中间的文本内容
    title: {
      type: String,
      default: "",
    },
    //   自定义header样式
    headerStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    //  自定义left样式
    leftStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    //   自定义title样式
    titleStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    //   自定义right样式
    rightStyle: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    //   左边的点击事件
    onClickLeft() {
      this.$router.back();
      //   this.$emit("onClickLeft"); 当左边不是100%为返回功能时、再修改此组件
    },
    //   右边的点击事件
    onClickRight() {
      this.$emit("onClickRight");
    },
  },
};
</script>

<style lang="less" scoped>
@headHeight: 60px; // header默认高度
@headBgColor: #fff; // header背景颜色
@arrowColor: rgba(0, 0, 0, 0.5); //箭头颜色

.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  // z-index: 10;

  // header 默认样式
  .header {
    height: @headHeight;
    background: @headBgColor;
    position: relative;
    box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.2);

    .left {
      position: absolute;
      top: 50%;
      left: 20px; // 默认距离左边的距离
      transform: translateY(-50%);
    }

    .title {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-size: 18px;
    }

    .right {
      position: absolute;
      top: 50%;
      right: 15px; // 默认距离右边的距离
      transform: translateY(-50%);
      color: #f8841a;
      font-size: 16px;
    }

    // 箭头样式
    .arrow {
      border-top: 2px solid @arrowColor;
      border-right: 2px solid @arrowColor;
      transform: translateY(-50%) rotate(-135deg);
      width: 12px;
      height: 12px;
    }
  }
}
</style>
