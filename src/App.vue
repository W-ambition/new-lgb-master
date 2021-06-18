<template>
  <template v-if="!judgeLoading">
    <ConfigProvider v-bind="lockEvent" :locale="getAntdLocale">
      <AppProvider>
        <RouterView />
      </AppProvider>
    </ConfigProvider>
  </template>

</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';

  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  import { useUserStore } from '/@/store/modules/user';
  import { getParamsToUrl } from '/@/utils/index';
  import { LoginResultModel } from '/@/api/sys/model/userModel';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      const judgeLoading = ref<boolean>(true);
      useTitle();

      const userStore = useUserStore();
      onMounted(() => {
        const params = getParamsToUrl(decodeURI(window.location.href));
        judgeLoginInfo(params);
      })

      async function judgeLoginInfo(data: {[propname: string]: string}) {
        if(data.t) {
          const params: LoginResultModel = {
            UserId: data.i,
            Plevel: Number(data.l),
            UserName: data.n,
            RoleType: Number(data.r),
            Token: data.t,
            UserType: Number(data.ty),
            IsDefaultPwd: Number(data.p)
          }
          try {
            await userStore.saveLoginInfo({
              loginInfo: params,
            });
          } finally {
            judgeLoading.value = false;
          }
        } else {
          judgeLoading.value = false;
        }
      }

      // support Multi-language
      const { getAntdLocale } = useLocale();

      // Create a lock screen monitor
      const lockEvent = useLockPage();

      return { getAntdLocale, lockEvent, judgeLoading };
    },
  });
</script>
