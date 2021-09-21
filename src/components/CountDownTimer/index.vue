<template>
  <div class="component-container">
    <span class="count-down-text" v-html="timeStr" />
  </div>
</template>

<script>
export default {
  name: 'CountDownTimer',
  props: {
    /* 倒计时(单位: 毫秒) */
    time: {
      type: Number,
      required: true
    },

    /* 其他操作触发的倒计时终止 */
    stop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      timer: null
    }
  },
  computed: {
    // 倒计时的HTML内容
    timeStr() {
      const hourStr = this.hour < 10 ? `0${this.hour}` : this.hour
      const minuteStr = this.minute < 10 ? `0${this.minute}` : this.minute
      const secondStr = this.second < 10 ? `0${this.second}` : this.second
      return `${hourStr}:${minuteStr}:${secondStr}`
    }
  },
  watch: {
    stop: {
      handler: function() {
        if (this.stop === true) {
          this.handleStop()
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.time) {
      this.handleTime()
    }
  },
  methods: {
    handleTime() {
      this.hour = Math.floor(this.time / (1000 * 60 * 60)) // 时
      this.minute = Math.floor((this.time - this.hour * 1000 * 60 * 60) / (60 * 1000)) // 分
      this.second = Math.floor((this.time - this.hour * 1000 * 60 * 60 - this.minute * 60 * 1000) / 1000) // 秒
      const that = this
      that.timer = setInterval(() => {
        that.second -= 1
        if (that.second < 0) {
          that.second = 59
          that.minute -= 1
        }
        if (that.minute < 0) {
          that.minute = 59
          that.hour -= 1
        }
        if (that.hour === 0 && that.minute === 0 && that.second === 0) {
          // clearInterval(that.timer)
          that.handleStop()
          that.$emit('timesup', true)
        }
      }, 1000)
    },
    handleStop() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="scss" scoped>
.component-container {
  display: inline-block;
  .count-down-text {
    // font-size: 16px;
    font-weight: 600;
    color: #EF5350;
  }
}
</style>
