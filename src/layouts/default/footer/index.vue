<template>
  <Footer :class="prefixCls" v-if="getShowLayoutFooter">
    <div>Copyright &copy;2021 杭州君越文化传播有限公司</div>
  </Footer>
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';
  import { Layout } from 'ant-design-vue';

  import { GithubFilled } from '@ant-design/icons-vue';

  import { DOC_URL, GITHUB_URL, SITE_URL } from '/@/settings/siteSetting';
  import { openWindow } from '/@/utils';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useRouter } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'LayoutFooter',
    components: { Footer: Layout.Footer, GithubFilled },
    setup() {
      const { t } = useI18n();
      const { getShowFooter } = useRootSetting();
      const { currentRoute } = useRouter();
      const { prefixCls } = useDesign('layout-footer');

      const getShowLayoutFooter = computed(() => {
        return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter;
      });
      return { getShowLayoutFooter, prefixCls, t, DOC_URL, GITHUB_URL, SITE_URL, openWindow };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-footer';

  @n-color: rgba(0, 0, 0, 0.65);

  @hover-color: rgba(0, 0, 0, 0.85);

  .@{prefix-cls} {
    color: @n-color;
    text-align: center;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-color;

        &:hover {
          color: @hover-color;
        }
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-color;
      }
    }
  }
</style>
