<!-- @file 地区选择器 -->
<template>
  <view class="c-region">
    <view class="c-region-box c-bg-color-white">
      <view
        v-for="(item, i) in provincesList"
        :key="i"
        :class="['c-region-box-item', proIndex === i ? 'c-region-provinces-item-sel' : 'c-region-provinces-item-no']"
        @click="chooceProvince(item, i)"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="c-region-box c-bg-color-gray">
      <view
        v-for="(item, i) in cityList"
        :key="i"
        :class="['c-region-box-item', cityIndex === i ? 'c-region-city-item-sel' : 'c-region-city-item-no']"
        @click="chooceCity(item, i)"
      >
        {{ item.name }}
      </view>
    </view>
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
      // 省份
      provincesList: [],
      // 城市
      cityList: [],
      // 区域
      areaList: [],
      proIndex: 0, // 当前选中的省份
      cityIndex: 0, // 当前选中的城市
    }
  },
  created() {
    this.getRegionList()
  },

  methods: {
    // 获取地址信息
    getRegionList() {
      this.provincesList = region
      this.cityList = this.provincesList.length ? this.provincesList[0].children : []
      // this.areaList = this.cityList.length ? this.cityList[0].children : []
      this.sengMessage() // 默认选中的省份和城市
    },
    // 获取省份信息
    chooceProvince(item, i) {
      this.proIndex = i
      this.cityIndex = 0 // 新的城市列表默认选中第一个
      this.cityList = item.children.length ? item.children : []
      this.sengMessage()
    },
    // 获取城市信息
    chooceCity(item, i) {
      this.cityIndex = i
      this.sengMessage()
    },
    // 传送选择的省份和地址
    sengMessage() {
      const province = this.provincesList[this.proIndex]
      const city = province.children && province.children[this.cityIndex]
      this.$emit('chooce', {
        province: {
          name: province.name,
          code: province.provinceCode,
        },
        city: {
          name: city && city.name,
          code: city && city.cityCode
        }
      })
    }
  }
}
</script>

<style lang="scss">
.c-region {
  width: 100%;
  height: 100%;
  display: flex;
  .c-region-box {
    width: 50%;
    height: 100%;
    overflow-y: auto;
  }
  .c-region-box-item {
    box-sizing: border-box;
    width: 100%;
    height: 74rpx;
    line-height: 74rpx;
    padding-left: 40rpx;
    font-size: 28rpx;
    font-weight: 500;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .c-bg-color-white {
    background-color: #FFFFFF;
  }
  .c-bg-color-gray {
    background-color: #F4F8FB;
  }
  .c-region-provinces-item-sel {
    color: #333333;
    background-color: #F4F8FB;
  }
  .c-region-provinces-item-no {
    color: #666666;
    background-color: #FFFFFF;
  }
  .c-region-city-item-sel {
    color: #333333;
  }
  .c-region-city-item-no {
    color: #666666;
  }
}
</style>
