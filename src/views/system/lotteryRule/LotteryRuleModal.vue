<template>
  <BasicModal
    :minHeight="500"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    @visible-change="visibleChange"
  >
    <BasicForm @register="registerForm">
      <template #rule="{ model, field }">
        <div>请按照图示输入真实票号</div>
        <img
          :src="LotteryType === 2 ? FLotteryRuleImg : TLotteryRuleImg"
          mode="scaleToFill"
          class="ruleImg"
        />
        <a-input type="hidden" v-model:value="model[field]" />
        <a-row type="flex" :gutter="6">
          <a-col :span="4">
            <a-input v-model:value="rule1" @change="handleRuleChange" />
          </a-col>
          <a-col :span="4">
            <a-input v-model:value="rule2" @change="handleRuleChange" />
          </a-col>
          <a-col :span="10">
            <a-input v-model:value="rule3" @change="handleRuleChange" />
          </a-col>
          <a-col :span="4">
            <a-input v-model:value="rule4" @change="handleRuleChange" />
          </a-col>
        </a-row>
      </template>
    </BasicForm>
    <a-row type="flex" justify="end">
      <a-col :span="19">
        <a-space direction="vertical" class="space">
          <a-typography-text>票号长度：{{ruleInfo.CodeLength}}</a-typography-text>
          <a-typography-text>开头字符：{{ruleInfo.StartWith}}</a-typography-text>
          <a-typography-text>包号开始位：{{ruleInfo.PackageSta + 1}}</a-typography-text>
          <a-typography-text>包号结束位：{{ruleInfo.PackageEnd + 1}}</a-typography-text>
          <a-typography-text>序号开始位：{{ruleInfo.TicketSta + 1}}</a-typography-text>
          <a-typography-text>序号结束位：{{ruleInfo.TicketEnd + 1}}</a-typography-text>
          <a-typography-text>批号开始位：{{ruleInfo.BatchSta + 1}}</a-typography-text>
          <a-typography-text>批号结束位：{{ruleInfo.BatchEnd + 1}}</a-typography-text>
        </a-space>
      </a-col>
    </a-row>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { Input, Row, Col, Form, Space, Typography } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { LotteryRuleFormSchema } from './data';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { addLotteryPackageRule, editLotteryPackageRule } from '/@/api/lottery/lottery';
  import { AddLotteryPackageRuleParams } from '/@/api/lottery/model/lotteryModel';

  import TLotteryRuleImg from '/@/assets/images/tycp-lottery-rule.png';
  import FLotteryRuleImg from '/@/assets/images/flcp-lottery-rule.png';

  interface RuleInfo{
    CodeLength: number;
    StartWith: string;
    PackageSta: number;
    PackageEnd: number;
    TicketSta: number;
    TicketEnd: number;
    BatchSta: number;
    BatchEnd: number;
    Example: string;
  }

  const defaultRules: RuleInfo = {
    CodeLength: 0,
    StartWith: '0',
    PackageSta: 0,
    PackageEnd: 0,
    TicketSta: 0,
    TicketEnd: 0,
    BatchSta: 0,
    BatchEnd: 0,
    Example: '',
  }

  export default defineComponent({
    name: 'LotteryRuleModal',
    components: {
      BasicModal,
      BasicForm,
      [Form.Item.name]: Form.Item,
      [Input.name]: Input,
      [Input.Group.name]: Input.Group,
      [Row.name]: Row,
      [Col.name]: Col,
      [Space.name]: Space,
      [Typography.name]: Typography
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const LotteryId = ref<number>(-1);
      const LotteryPackageRuleId = ref<number>(-1);
      const LotteryType = ref<number>(0);
      let ruleInfo = reactive<RuleInfo>({...defaultRules});

      const rule1 = ref<string>('');
      const rule2 = ref<string>('');
      const rule3 = ref<string>('');
      const rule4 = ref<string>('');

      const { createMessage } = useMessage();

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: LotteryRuleFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        LotteryType.value = data.LotteryType;
        LotteryId.value = data.LotteryId;
        if(isUpdate.value) {
          LotteryPackageRuleId.value = data.record.LotteryPackageRuleId;
        }
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record
          });
          initRule(data.record.Example);
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增编码规则' : '编辑编码规则'));

      function generationRules(values) {
        let { rule1, rule2, rule3, rule4 } = values;
        const additionalLength = LotteryType.value === 1 ? 2 : LotteryType.value === 2 ? 11 : 0;
        ruleInfo.CodeLength = rule1.length + rule2.length + rule3.length + rule4.length + additionalLength;
        ruleInfo.StartWith = rule1[0];
        ruleInfo.PackageSta = 0;
        ruleInfo.PackageEnd = rule1.length + rule2.length + rule3.length - 1;
        ruleInfo.TicketSta = rule1.length + rule2.length + rule3.length;
        ruleInfo.TicketEnd = ruleInfo.TicketSta + rule4.length - 1;
        ruleInfo.BatchSta = rule1.length;
        ruleInfo.BatchEnd = ruleInfo.BatchSta + rule2.length - 1;
        const Example = `${rule1}-${rule2}-${rule3}-${rule4}`;
        ruleInfo.Example = Example;
        setFieldsValue({Example})
      }

      function resetRules() {
        if(ruleInfo.CodeLength > 0) {
          for(let item in defaultRules) {
            ruleInfo[item] = defaultRules[item];
          }
          setFieldsValue({Example: ''})
        }
      }

      async function handleRuleChange() {
        const _rule1 = rule1.value.trim();
        const _rule2 = rule2.value.trim();
        const _rule3 = rule3.value.trim();
        const _rule4 = rule4.value.trim();
        if(_rule1 && _rule2 && _rule3 && _rule4) {
          generationRules({
            rule1: rule1.value.trim(),
            rule2: rule2.value.trim(),
            rule3: rule3.value.trim(),
            rule4: rule4.value.trim(),
          });
        } else {
          resetRules();
        }
      }

      function initRule(Example: string) {
        if(!Example) {
          return false
        }
        const ExampleList = Example.split("-");
        rule1.value = ExampleList[0];
        rule2.value = ExampleList[1];
        rule3.value = ExampleList[2];
        rule4.value = ExampleList[3];
        handleRuleChange();
      }

      async function handleSubmit() {
        try {
          let values = await validate();
          const params: AddLotteryPackageRuleParams = {
            RuleName: values.RuleName,
            PackageQuantity: values.PackageQuantity,
            Enable: 1,
            LotteryId: LotteryId.value,
            ...ruleInfo
          }
          setModalProps({ confirmLoading: true });
          let result;
          if(unref(isUpdate)) {
            result = await editLotteryPackageRule({
              ...params,
              LotteryPackageRuleId: LotteryPackageRuleId.value
            });
          }else {
            result = await addLotteryPackageRule(params);
          }
          createMessage.success(result);
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      function visibleChange(visible: boolean) {
        if(!visible) {
          resetRules();
          rule1.value = '';
          rule2.value = '';
          rule3.value = '';
          rule4.value = '';
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        LotteryType,
        TLotteryRuleImg,
        FLotteryRuleImg,
        ruleInfo: ruleInfo,
        handleRuleChange,
        visibleChange,
        rule1,
        rule2,
        rule3,
        rule4,
      };
    },
  });
</script>
<style lang="less" scoped>
  .space {
    width: 90%;
    padding: 15px;
    background-color: rgb(235, 231, 231);
    box-sizing: border-box;
  }

  .ruleImg {
    width: 318px;
    height: 108px;
  }
</style>
