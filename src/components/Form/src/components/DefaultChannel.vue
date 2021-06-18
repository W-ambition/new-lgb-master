<template>
  <TreeSelect
    v-bind="attrs"
    tree-data-simple-mode
    :style="style"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    :load-data="onLoadData"
    treeNodeFilterProp="title"
    v-model:value="state"
  >
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </TreeSelect>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, unref, onMounted } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { get } from 'lodash-es';

  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { propTypes } from '/@/utils/propTypes';

  import { getPartnerDic } from '/@/api/channel/channel';
  import { GetPartnerDicParams } from '/@/api/channel/model/channelModel';

  type TreeDataItem = { id: string | number; value: string | number; pId: string | number; title: string };
  interface fetchParams extends GetPartnerDicParams {
    level?: number;
  }
  export default defineComponent({
    name: 'DefaultChannel',
    components: {
      TreeSelect,
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
        type: Function as PropType<(arg?: Recordable) => Promise<any[]>>,
        default: getPartnerDic,
      },
      // support xxx.xxx.xx
      resultField: propTypes.string.def(''),
      fieldNames: {
        type: Object as PropType<Recordable>,
        default: () => {
          return {
            label: 'PartnerName',
            value: 'PId',
            children: 'SubRegions'
          }
        },
      },
      immediate: propTypes.bool.def(true),
      isLoadOnce: propTypes.bool.def(false)
    },
    emits: ['options-change', 'change'],
    setup(props, { emit }) {
      const treeData = ref<TreeDataItem[]>([]);
      const loading = ref(false);
      const isFirstLoad = ref(true);
      const attrs = useAttrs();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props);

      watchEffect(() => {
        !props.isLoadOnce && props.immediate && fetch({level: 1});
      });

      onMounted(() => {
        if(props.isLoadOnce) {
          fetch({level: 1});
          isFirstLoad.value = false;
        }
      })

      async function fetch(params: fetchParams) {
        const api = props.api;
        if (!api || !isFunction(api)) return;

        try {
          const { level, ...reset } = params;
          loading.value = true;
          const res = await api(reset);
          if (Array.isArray(res)) {
            let list: TreeDataItem[] = [];
            res.map(item => {
              list.push({
                id: item.PId,
                value: item.PId,
                pId: item.ParentNodeId,
                title: item.PartnerName
              })
            })
            if(level === 1) {
              treeData.value = list;
            }else {
              treeData.value = treeData.value.concat(list);
            }
            emitChange();
            return;
          }
          if (props.resultField) {
            treeData.value = get(res, props.resultField) || [];
          }
          emitChange();
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function onLoadData(treeNode) {
        return new Promise(async (resolve: (value?: unknown) => void) => {
          const { id } = treeNode.dataRef;
          await fetch({ PId: id });
          resolve();
        });
      }

      function emitChange() {
        emit('options-change', unref(treeData));
      }

      return { state, attrs, treeData, fieldNames: props.fieldNames, loading, onLoadData };
    },
  });
</script>
