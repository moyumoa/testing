<template>
  <view>
    <view style="padding: 12px 0;background-color: antiquewhite;margin-bottom: 12px;" v-for="item in list"
      :key="item.channelID" @tap="navito(item)">{{ item.name }}: {{ item.phone }} : {{item.channelID}}</view>
  </view>
</template>

<script>
export default {
  data: () => ({
    list: [
      { name: '测试1号', phone: '10000000001', channelID: '48539b449d664047981285b24a6002cf' },
      { name: '测试2号', phone: '10000000002', channelID: '40d41d828bc641dfa64afbf86f0d4855' },
      { name: 'zhangsan', phone: '10000000003', channelID: '6157f35f283c4e72b72e9ca91953e05d' },
      { name: 'lisi', phone: '10000000004', channelID: '60567441b3cf4c17afc4de1a42de3af1' },
      { name: '哈哈哈', phone: '10000000005', channelID: 'bc3db5e23b954c6fbfe8d4f818bbeec3' },
      { name: 'lllll', phone: '10000000006', channelID: 'bbb5b2fc7f6944f99e11eb3b6ce10311' },
      { name: '临时', phone: '10000000007', channelID: 'f9d28ae952a4416c972fdb40b566158a' },
      { name: '10000000010', phone: '10000000010', channelID: 'b827cf287d0e46aca42f15346f0e6999' },
      { name: '10000000011', phone: '10000000011', channelID: '6b72f8260ddd48769de495bf9034a51f' },
    ]
  }),

  methods: {
    navito (item) {
      uni.navigateTo({
        url: `/pages/message/chat?channelID=${item.channelID}&channelType=1`
      })
    }
  }
}
</script>