<template>
  <div class="app-container">
    <div class="form-container">
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="auto"
        :status-icon="true"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="身份证：" prop="idCardNumber">
          <el-input v-model="form.idCardNumber" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入11位有效手机号" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="单日期：" prop="singleDate">
          <el-date-picker
            v-model="form.singleDate"
            style="width: 100%;"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="singleDatePickerOptions"
          />
        </el-form-item>
        <el-form-item label="日期范围：" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            style="width: 100%;"
            type="daterange"
            placeholder="请选择日期范围"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="dateRangePickerOptions"
          />
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <div class="code-area">
            <el-input v-model="form.code" placeholder="请输入验证码" />
            <el-button type="primary" :disabled="!codeFlag" @click="handleSendCode()" v-html="getCodeText" />
          </div>
        </el-form-item>
        <el-form-item>
          <div class="btn-area">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="danger" plain @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicForm',
  data() {
    return {
      /* 存储表单数据 */
      form: {
        name: '',
        address: '',
        idCardNumber: '',
        phoneNumber: '',
        email: '',
        singleDate: '',
        dateRange: [],
        code: ''
      },

      /* 表单验证规则 */
      formRules: {
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        idCardNumber: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号格式', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        singleDate: { required: true, message: '请选择日期', trigger: 'blur' },
        dateRange: { required: true, message: '请选择日期范围', trigger: 'blur' },
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码应为6位数字', trigger: 'blur' }
        ]
      },

      /* 日期选择器选项 */
      singleDatePickerOptions: {
        /* 只能选择今天或之后的时间 */
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
        }
      },
      dateRangePickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      /* 短信验证码 */
      codeFlag: true,
      codeRetrySeconds: 0,
      codeTimer: null // 重新发送验证码定时器
    }
  },
  computed: {
    // 获取验证码按钮内的HTML内容
    getCodeText() {
      if (!this.codeRetrySeconds || this.codeRetrySeconds === 0) {
        return '<span>获取验证码</span>'
      } else {
        return '<span style="color: #b2b2b2">重新获取(' + this.codeRetrySeconds + 's)</span>'
      }
    }
  },
  methods: {
    /* 表单提交按钮的点击事件处理 */
    handleSubmit() {
      this.$refs['form'].validate((valid, errObj) => {
        if (valid) {
          console.log('form -> handle submit', this.form)
          this.$notify.success({
            title: '成功',
            message: '表单提交成功'
          })
          // this.$refs['form'].resetFields()
        } else {
          let errMsg = ''
          for (const key in errObj) {
            if (Object.hasOwnProperty.call(errObj, key)) {
              const element = errObj[key]
              element.forEach(element => {
                errMsg += `${element.message}；`
              })
            }
          }
          this.$notify.error({
            title: '错误',
            message: errMsg
          })
          return
        }
      })
    },
    /* 表单重置按钮的点击事件处理 */
    handleReset() {
      console.log('form -> handle reset')
      this.$refs['form'].resetFields()
    },
    /* 表单取消按钮的点击事件处理 */
    handleCancel() {
      console.log('form -> handle cancel')
      this.$router.go(-1)
    },

    /* 获取验证码按钮的点击事件处理 */
    handleSendCode() {
      const flag = this.sendCode()
      const that = this
      if (flag) {
        that.codeRetrySeconds = 60
        that.codeFlag = false
        that.codeTimer = setInterval(() => {
          that.codeRetrySeconds -= 1
          if (that.codeRetrySeconds <= 0) {
            clearInterval(that.codeTimer)
            that.codeFlag = true
          }
        }, 1000)
      }
    },

    /* 发送请求获取验证码 */
    sendCode() {
      const fakeResponse = Math.round(Math.random()) // 使用fakeResponse模拟请求响应结果

      // ... 发送获取验证码请求, 若响应成功
      if (fakeResponse) {
        this.$notify.success({
          title: '成功',
          message: '发送验证码成功'
        })
        return true
      } else { // ... 请求响应失败
        this.$notify.error({
          title: '失败',
          message: '发送验证码失败, 请重试.'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .form-container {
    width: 66%;
    margin: 0 auto;
    .code-area {
      display: flex;
      justify-content: space-between;
      gap: 14px;
    }
    .btn-area {
      text-align: center;
      margin-top: 14px;
    }

    /* 将校验错误信息放置在输入框右下方 */
    // ::v-deep .el-form-item__error {
    //   color: #F56C6C;
    //   font-size: 12px;
    //   line-height: 1;
    //   padding-top: 4px;
    //   position: absolute;
    //   top: 100%;
    //   right: 0;
    //   left: auto;
    // }
  }
}
</style>
