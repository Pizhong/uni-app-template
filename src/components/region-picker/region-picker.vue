<!-- @file 地区选择器 -->
<template>
  <view class="c-region-picker">
    <l-popup ref="regionPopup" :title="title" @confirm="confirm">
      <view class="c-region-picker-title">
        <text>省份</text>
        <text>城市</text>
        <text>区域</text>
      </view>
      <view>
        <picker-view
          :indicator-style="indicatorStyle"
          :value="value"
          class="c-region-picker-view"
          @change="bindChange"
        >
          <!-- 省份 -->
          <picker-view-column>
            <view v-for="item in provincesList" :key="item.provinceCode" class="c-region-picker-item">{{ item.name }}</view>
          </picker-view-column>

          <!-- 城市 -->
          <picker-view-column>
            <view v-for="item in cityList" :key="item.cityCode" class="c-region-picker-item">{{ item.name }}</view>
          </picker-view-column>

          <!-- 区域 -->
          <picker-view-column>
            <view v-for="item in areaList" :key="item.areaCode" class="c-region-picker-item">{{ item.name }}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </l-popup>
  </view>
</template>

<script>
import region from '../../assets/data/region.json'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      indicatorStyle: 'height: 96rpx; font-weight: bold; font-size: 28rpx; color: #222222; font-family: PingFang SC;',
      value: [0, 0, 0],
      // 省份
      provincesList: [],
      // 城市
      cityList: [],
      // 区域
      areaList: []
    }
  },

  watch: {
    value: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (newVal[0] !== oldVal[0]) {
          this.value = [newVal[0], 0, 0]
        }
        if (newVal[1] !== oldVal[1]) {
          this.value = [newVal[0], newVal[1], 0]
        }
      }
    }
  },

  methods: {
    open() {
      this.value = [0, 0, 0]
      this.provincesList = region
      this.cityList = this.provincesList.length ? this.provincesList[0].children : []
      this.areaList = this.cityList.length ? this.cityList[0].children : []
      this.$refs.regionPopup.open()
    },

    bindChange(e) {
      const arr = e.detail.value
      this.cityList = this.provincesList[arr[0]].children.length ? this.provincesList[arr[0]].children : []
      this.areaList = this.cityList[arr[1]].children.length ? this.cityList[arr[1]].children : []
      this.value = arr
    },

    confirm() {
      const province = this.provincesList[this.value[0]]
      const city = province.children && province.children[this.value[1]]
      const area = city.children && city.children[this.value[2]]
      this.$emit('confirm', {
        province: {
          name: province.name,
          code: province.provinceCode,
        },
        city: {
          name: city && city.name,
          code: city && city.cityCode
        },
        area: {
          name: area && area.name,
          code: area && area.areaCode
        }
      })
    }
  }
}
</script>

<style lang="scss">
.c-region-picker {
  .c-region-picker-title {
    display: flex;
    justify-content: space-around;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    line-height: 30rpx;
  }
  .c-region-picker-view {
    height: 300rpx;
    margin: 20rpx 0;
    font-size: $font-size-text;
  }
  .c-region-picker-item {
    height: 96rpx;
    line-height: 96rpx;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
  }
}
</style>
