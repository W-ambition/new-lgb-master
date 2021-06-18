<template>
  <my-icon :type="type" :style="style" :spin="spin" :rotate="rotate" />
</template>

<script lang="ts">
  import { createFromIconfontCN } from '@ant-design/icons-vue';
  import { defineComponent } from 'vue';

  const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2327197_1vqv2l1gp9e.js',
  });

  export default defineComponent({
    components: {
      MyIcon
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      style: Object,
      spin: {
        type: Boolean,
        default: false
      },
      rotate: Number
    },
  })
</script>
