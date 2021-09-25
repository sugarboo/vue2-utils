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
  name: 'VerificationCode',
  data() {
    return {
      /* 表单 */
      form: {
        code: ''
      },
      formRules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码应为6位数字', trigger: 'blur' }
        ]
      },
      /* 短信验证码 */
      codeFlag: true, // 限定时间内是否已发送过验证码
      codeRetrySeconds: 0, // 重新获取验证码倒计时(秒)
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
    },

    /* 表单提交按钮的点击事件处理 */
    handleSubmit() {
      this.$refs['form'].validate((valid, errObj) => {
        if (valid) {
          console.log('form -> handle submit', this.form)
          this.$notify.success({
            title: '成功',
            message: '表单提交成功'
          })
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
  }
}
</style>
