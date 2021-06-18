<template>
  <Cascader
    @popupVisibleChange="handleFetch"
    v-bind="attrs"
    :style="style"
    :options="options"
    :fieldNames="fieldNames"
    v-model:value="state"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Cascader>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, unref, onMounted } from 'vue';
  import { Cascader } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { get } from 'lodash-es';

  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';

  import { getRegionDic } from '/@/api/generous/generous';

  type OptionsItem = { label: string; value: string; children: OptionsItem[]; disabled?: boolean };

  export default defineComponent({
    name: 'DefaultCascader',
    components: {
      Cascader,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      style: propTypes.oneOfType([
        propTypes.object,
        propTypes.string,
      ]),
      value: propTypes.oneOfType([
        propTypes.object,
        propTypes.number,
        propTypes.string,
        propTypes.array,
      ]),
      numberToString: propTypes.bool,
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
        default: getRegionDic,
      },
      // api params
      params: {
        type: Object as PropType<Recordable>,
        default: () => {
          return {
            Level: 2,
            QueryType: 2
          }
        },
      },
      // support xxx.xxx.xx
      resultField: propTypes.string.def(''),
      fieldNames: {
        type: Object as PropType<Recordable>,
        default: () => {
          return {
            label: 'RegionName',
            value: 'RegionId',
            children: 'SubRegions'
          }
        },
      },
      immediate: propTypes.bool.def(true),
      isLoadOnce: propTypes.bool.def(false)
    },
    emits: ['options-change', 'change'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([]);
      const loading = ref(false);
      const isFirstLoad = ref(true);
      const attrs = useAttrs();
      const { t } = useI18n();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props);

      watchEffect(() => {
        !props.isLoadOnce && props.immediate && fetch();
      });

      onMounted(() => {
        if(props.isLoadOnce) {
          fetch();
          isFirstLoad.value = false;
        }
      })

      async function fetch() {
        const api = props.api;
        if (!api || !isFunction(api)) return;

        try {
          loading.value = true;
          const res = await api(props.params);
          if (Array.isArray(res)) {
            options.value = res;
            emitChange();
            return;
          }
          if (props.resultField) {
            options.value = get(res, props.resultField) || [];
          }
          emitChange();
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function handleFetch() {
        if (!props.immediate && unref(isFirstLoad)) {
          await fetch();
          isFirstLoad.value = false;
        }
      }

      function emitChange() {
        emit('options-change', unref(options));
      }

      return { state, attrs, options, fieldNames: props.fieldNames, loading, t, handleFetch };
    },
  });
</script>
