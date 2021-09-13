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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日期：" prop="date">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
                style="width: 100%;"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间：" prop="time">
              <el-time-select
                v-model="form.time"
                value-format="hh:mm:ss"
                placeholder="请选择时间"
                :editable="false"
                :picker-options="form.date === currentDate ? timePickerOptionsForToday : timePickerOptions"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  name: 'DatePicker',
  data() {
    return {
      /* 表单 */
      form: {
        singleDate: '',
        dateRange: [],
        date: '',
        time: ''
      },
      formRules: {
        singleDate: { required: true, message: '请选择日期', trigger: 'blur' },
        dateRange: { required: true, message: '请选择日期范围', trigger: 'blur' },
        date: { required: true, message: '请选择日期', trigger: 'blur' },
        time: { required: true, message: '请选择时间', trigger: 'blur' }
      },

      /* 日期选择器选项 */
      /* 单日期选择器 */
      singleDatePickerOptions: {
        /* 只能选择今天或之后的时间 */
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
        }
      },

      /* 日期范围选择器选项 */
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

      /* 日期限制, 只能选择今天或之后的日期 */
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 // 包含今天
          // return time.getTime() < Date.now() // 不包含今天
        }
      },

      /* 一般情况下的时间限制 */
      timePickerOptions: {
        start: '00:00',
        step: '01:00',
        end: '23:00',
        minTime: ''
      },

      /* 选择日期为当天的情况下的时间限制 */
      timePickerOptionsForToday: {
        start: '00:00',
        step: '01:00',
        end: '23:00',
        // 小于当前时间的时间段将被禁用
        minTime: new Date().toLocaleString('chinese', { 'hour12': false }).substring(10, 15)
      }
    }
  },

  computed: {
    // 计算属性: 获取今天的日期, 格式化为'yyyy-MM-dd'
    currentDate: function() {
      // 获取当前日期, 格式为'yyyy/MM/dd'
      const today = new Date().toLocaleString().substring(0, 9)
      // 将today格式化为'yyyy-MM-dd'
      const todayFormatArr = today.split('/')
      const year = todayFormatArr[0]
      const month = todayFormatArr[1].length === 1 ? '0' + todayFormatArr[1] : todayFormatArr[1]
      const day = todayFormatArr[2].length === 1 ? '0' + todayFormatArr[2] : todayFormatArr[2]
      const todayFormatStr = `${year}-${month}-${day}`
      return todayFormatStr
    }
  },

  methods: {
    /* 日期确认时的事件处理 */
    handleDateChange() {
      this.form.time = '' // 日期改变后, 需要重新选择时间
    },

    /* 表单提交按钮的点击事件处理 */
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.dateTime = this.form.date + ' ' + this.form.time + ':00'
          // 删除无用的参数
          // delete this.form.date
          // delete this.form.time
          console.log('form -> submit', this.form)
          this.$notify.success({
            title: '成功',
            message: '表单提交成功'
          })
          this.$refs['form'].resetFields()
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
    .btn-area {
      text-align: center;
      margin-top: 14px;
    }
  }
}
</style>
