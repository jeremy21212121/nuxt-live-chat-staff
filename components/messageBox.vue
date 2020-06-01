<style lang="scss" scoped>
@import '@/scss/caret.scss';
@import '@/scss/colours.scss';
@import '@/scss/boxShadows.scss';
ul.messages {
  padding: 0;
  width: 100%;
  height: 80%;
  border: 1px solid $primary;
  border-radius: 4px;
  flex-grow: 1;
  list-style-type: none;
  overflow-y: scroll;
  scroll-behavior: smooth;
  background-color: $white10;
  li {
    margin: 12px 8px;
    margin-bottom: 20px;
    blockquote {
      border-radius: 4px;
      padding: 12px 8px;
      background-color: $olive;
      color: white;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      text-align: left;
      span.message {
        // flex-grow: 1;
        overflow-wrap: break-word;
        width: 100%;
      }
      &::after {
        @include caret(bottom, $default-caret-unit, $olive);
        // border-top-width: $caret-unit;
        // content: '';
        // display: block;
        // position: relative;
        // left: 0%;
        // bottom: -$caret-unit * 1.1;
        // transform-origin: center;
        // transform: rotate(90deg) skew(-(strip-unit($caret-unit))+deg) translateY($caret-unit / 1.5);
      }
    }
    span.cite {
      width: 100%;
      margin-top: 4px;
      padding-left: 24px;
      // position: relative;
      // top: 42px;
      // right: 67%;
      display: flex;
      align-items: center;
      img {
        border-radius: 4px;
        margin: 8px;
        width: 24px;
        height: 24px;
      }
      span.human-id {
        text-transform: capitalize;
        color: $white70;
        font-style: italic;
        font-size: 0.8rem;
      }
    }
    &.sent {
      blockquote {
        text-align: right;
        background-color: $light;
        &::after {
          // speech bubble caret
          @include caret(bottom, $default-caret-unit, $light);
          // override 'left' value for position: relative, compensating for scroll bar
          left: calc(97% - 12px);
          transform: skew(25deg);
        }
        span {
          padding-right: 20px;
        }
      }
      span.cite {
        justify-content: flex-end;
        padding: 0;
        padding-right: 24px;
      }
    }
  }
}
</style>
<template>
  <ul class="messages"
    ref="msgWindow"
  >
    <li
      v-for="(message, msgIndex) in messages"
      :key="`message${msgIndex}`"
      :class="message.to === 'staff' ? 'received' : 'sent'"
    >
      <blockquote>
        <!-- the following handles newlines in messages -->
        <span
          v-for="(msgString, msgStrIndex) in splitMessage(message.message)"
          :key="`msg${msgIndex}-${msgStrIndex}-${message.to}-${message.from}`"
          class="message"
        >{{ msgString }}</span>
      </blockquote>
      <span class="cite">
        <img :src="message.to === 'staff' ? convo.identicon : staffIcon" alt="Sender icon">
        <span class="human-id">{{ message.from === 'staff' ? 'staff' : convo.humanId }}</span>
      </span>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'MessageWindow',
  props: {
    messages: Array,
    convo: Object
  },
  data() {
    return {
      messageBuffer: '',
      staffIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH5AQMFS0FtPoltwAABD9JREFUWMPNmOlOE1EUgAmI/lTjQ5go4gtoNDEqQkQBwZYlsgouRJCZoQVaFLqh4MIaFRdQBEHEBaWI4AouVCAatBSM2lJ8A/wh5njupK0tTMvMdFiafEln5txzvzm993bmBgSI/OzKp1bvZqi9SAnShLxFTA7I99uOayRmTcBifMIYOhg7kyFG5A8CPCGx3Yg8gmKCJRfbqaQCMXk6YhUg5Q0byRVxkgmURA6ThSAfJRCbzVAYTYX4K5eCTC+AnJPpMIZKFSy2fut2Ile6gGIehNG0JnTLDkGV0yyWnLskX7nUxZZzk0zzvYzQ9KYFHnPzjslwignllIvOUQZhwPASyjmqSI0kZaiCOKpHHV5qOSd7aPqwh1xMdsFKnO725SKIxbLHZ6pWuQQPZanly0XOSXKWOsEleDyptJtvw3AFAwW1NRCnVvmuApJfXQnyU2pRgujUw8ox0YY1J+I1M3wbdg30g2XSBh++jEJkgcJr3L3nfWzckMU8781wcSJBM4Nua4lgJAryapRZpmc7dVJ+q5EzjlRtzGZ1xVXfaREjCOi2nwhq+AoW1dV6CF6+184ZR1de9Ii71fVErKCOCDbzFUzX6zw6PtvYwBknK1aD2a2CVS3NYgVbieA7voKEh69esp0OfP4EEThhvMXd7e1h40zmrxCrLhIr+IEImoQIEpiqSthfqJw3jsKfWoycm6CJFcyV6WC5rYO5Mq1L8D0C0TmKZSNHXIiT8yduIQc5ci1EnmSWXC4yj2FdHIJtRFDrOADqgB6yUk5DakYxoubNwewCj7sX0vY/xWzfxMHpg+iJ4D63E6LITvw/yTLSToG/+dyIIoJrkRl/k0VQNCuYI9NKJfcXWef8P+6ZHaA/Vgs3Ktp4J4w/XsiOHwmr1+t6msGDBK6gzqZnMDo4Bm2XO0GVWOEzIRk/iUeLpBRMcgnS0YaVeMLOFdjT/homJ37Bj6826DcOQuOFdlAlnZsTlxengyPJJbwFDNl1oDta4+36FLLK46kaT2R4S9ZxrQuslilWlGAbn4KRgVHo7XgDrZceQd3pm6DJrAImdm5b5cGzUJF3Ba4aWqDjuhH6uwfBPDwBxtYXvm4gc847CZ4MRIa9NapWN8AXk8Ul6Q3rmB1+mCfhJ2K12OdcHxv5BvUo60NuBAnifLPDCyHItLfGitgzcPfKY6zAt3lFZzP+6Ts8aHgKhfJyX3K/kVCf78YYkMJnDNUbmqHvfj9bVds4t5R5aAJedr6DG+Wt7M3xyJvOa3cBA0uEzDjFgTI4z9RDTXEDywXFVVDGnRE6a3W892a2bQgXLOkn2p2bo4Rvv2HDZF9jUgJI7lS/9ggxwUbk4wLIkRVjkyS7rExUGVmC0hCbBGKTZM2lY8oCJd+rZmL0KzC5DDEKfMAgsU+ReMwRvCg7/uSFH9nrmExNyFvyiO6AfL+NlJL3bhIrtp9/96mpsx1dU3wAAAAASUVORK5CYII="
    }
  },
  mounted() {
    this.scrollMessageWindow()
  },
  methods: {
    scrollMessageWindow() {
      // make sure all neccessary $refs exist
      if (!this.$isServer && this.$refs && this.$refs.hasOwnProperty('msgWindow') ) {
        const msgWindow = this.$refs.msgWindow
         // scroll messageWindow to bottom
        requestAnimationFrame(() => { msgWindow.scrollTop = msgWindow.scrollTopMax })
      }
    },
    splitMessage(msg) {
      return msg.trim().split('\n').map(str => str.trim())
    }
  },
  watch: {
    messages(val, oldVal) {
      this.scrollMessageWindow()
    }
  }
}
</script>