<style lang="scss" scoped>
@import '@/scss/colours.scss';
@import '@/scss/boxShadows.scss';
main.container {
  justify-content: flex-start;
  margin-top: 60px;
  section.heading {
    width: 100%;
    .status {
      display: flex;
      justify-content: center;
      align-items: center;
      span.indicator {
        display: block;
        width: 20px;
        height: 20px;
        margin-left: 8px;
        background-color: $red80;
        border-radius: 50%;
        transition: background-color 300ms ease;
        &.active {
          background-color: $green80;
        }
      }
      a {
        font-size: 0.8rem;
        display: inline-block;
        border-radius: 4px;
        text-decoration: none;
        padding: 5px 10px;
        margin-left: 20px;
        transition: color, background-color 300ms ease;
        &.red {
          border: 1px solid $red80;
          color: $red80;
          -webkit-tap-highlight-color: $red80;
          &:hover {
            background-color: $red80;
            color: $white80;
          }
        }
        &.green {
          border: 1px solid $green80;
          color: $green80;
          -webkit-tap-highlight-color: $green80;
          &:hover {
            background-color: $green80;
            color: $white80;
          }
        }
      }
    }
    h1.title {
      margin: 0;
      font-size: 32px;
    }
  }
}
section.convos {
  width: 100%;
  ul.convo-list {
    padding: 0;
    width: 100%;
    // min-height: 75vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .chatbox {
      flex-grow: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      max-height: 150px;
      min-width: 95%;
      max-width: 96%;
      margin-bottom: 12px;
      transition: all 300ms ease;
      animation: 300ms appear ease;
      color: $light;
      border-radius: 4px;
      border: 1px solid $primary;
      -webkit-tap-highlight-color: $light;
      text-decoration: none;
      padding: 10px 20px;
      transition: color, background-color, max-height 300ms ease;
      &.active {
        h3 {
          color: $light;
          -webkit-text-stroke: 1px $primary;
        }
        min-height: 550px;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        padding: 3px 6px;
        div.alert-wrapper {
          display: none;
        }
        form.input {
          display: flex;
          width: 100%;
          input[type="text"], textarea {
            flex-grow: 1;
          }
        }
      }
      &.small {
        flex-direction: row;
        padding: 5px 15px;
        height: 50px;
        justify-content: space-between;
        img {
          max-width: 30px;
          max-height: 30px;
        }
        div {
          width: 0px;
          position: relative;
          right: 5%;
          span {
            position: absolute;
            // left: 0;
          }
          span.new {
            display: none;
          }
        }
      }
      &.clickable {
        cursor: pointer;
      }
      div {
        width: 100%;
        .new {
          text-align: right;
          animation: 300ms appear ease;
          // color: $light;
        }
        .alert {
          position: relative;
          left: 25%;
          bottom: 10px;
          display: inline-block;
          background-color: yellow;
          border-radius: 50%;
          color: $black80;
          width: 24px;
          height: 24px;
          font-size: 22px;
          font-weight: bold;
          transition: all 300ms ease;
          animation: 300ms appear ease;
        }
      }
      img {
        width: 36px;
        height: 36px;
        border-radius: 4px;
      }
      h3 {
        text-transform: capitalize;
        color: $primary;
        &.smaller {
          font-size: 17px;
        }
      }
      img.close {
        width: 24px;
        height: 24px;
        -webkit-tap-highlight-color: $secondary;
        border-radius: 12px;
      }
    }
  }
}
@media screen and (min-width: 720px) {
  main.container {
    section.convos {
      ul.convo-list {
        li.chatbox {
          min-width: 47%;
          max-width: 48%;
          &.active {
            min-width: 96%;
            max-width: 97%;
          }
        }
      }
    }
  }
}
</style>
<template>
  <main class="container">
    <section class="heading">
      <div v-if="ioSocket" class="status">
        <span>Connected: </span>
        <span class="indicator" :class="{ active: isConnected }" :title="(() => { const con = isConnected ? 'connected' : 'disconnected'; return `You are ${con}`})()"></span>
        <!-- <a @click.prevent="statusBar.a.action" :href="statusBar.a.href" :class="statusBar.a.class" :title="`Click to ${statusBar.a.text}`">{{ statusBar.a.text }}</a> -->
      </div>
      <h1 class="title">{{ title }}</h1>
    </section>
    <section class="convos">
      <ul class="convo-list">
        <li
          v-for="(sid, index) in convoSids"
          :key="`chatbox${index}`"
          @click.prevent="convoClickHandler(sid)"
          href="#"
          class="chatbox"
          :class="{ clickable: !activeConvo || activeConvo.sid !==  sid, small: activeConvo && activeConvo.sid !==  sid, active: activeConvo && activeConvo.sid === sid }"
        >
          <div class="alert-wrapper" v-if="getMessages(sid).length && getConvo(sid).lastRead < getMessages(sid)[getMessages(sid).length - 1].time">
            <span v-if="true" class="new">New message(s) from:</span>
            <span class="alert">!</span>
          </div>
          <img :src="getConvo(sid).identicon" :alt="getConvo(sid).humanId" :title="getConvo(sid).humanId">
          <h3 :class="{ smaller:  getConvo(sid).humanId.length > 27 }">{{ getConvo(sid).humanId }}</h3>
          <img v-if="activeConvo && activeConvo.sid ===  sid" @click.prevent="$router.replace({ query: {} })" :src="require('@/assets/close.svg')" alt="close conversation" title="Close" class="close">
          <message-box 
            v-if="activeMessages && activeConvo.sid === sid"
            :messages="activeMessages"
            :convo="activeConvo"
            ref="messageBox"
          />
          <form v-if="activeConvo && activeConvo.sid ===  sid" @submit.prevent="sendMessage(activeConvo.id)" class="input">
            <!-- <input v-model="messageBuffer" @keyup.enter="()=>{}" type="text"> -->
            <textarea v-model.trim="messageBuffer" @keyup.enter="keyUp" :rows="messageBuffer ? messageBuffer.split('\n').length : 1" />
            <button @click.prevent="sendMessage(activeConvo.id)" ref="formButton" :disabled="!messageBuffer.length">Send</button>
            <!-- <input type="submit" :disabled="!messageBuffer.length" value="Send"> -->
          </form>
        </li>
      </ul>
    </section>
  </main>
</template>
<script>
import io from '@/node_modules/socket.io-client/dist/socket.io.slim'
import { mapState, mapActions } from 'vuex'
import Conversation from '@/types/Conversation.js'

import MessageBox from '@/components/messageBox.vue'

export default {
  name: 'LiveSupportChat',
  // mixins: [ humanHash ],
  components: {
    MessageBox
  },
  data() {
    return {
      title: 'Live support chat',
      subtitle: 'Active chat sessions',
      // baseUrl: this.$auth.ctx.env.BASE_URL,
      baseUrl: process.env.BASE_URL,
      // socketSlug: process.env.SOCKET_SLUG,
      // chatSessions: {
      //   isActive: false,
      //   conversations: []
      // },
      isConnected: false,
      ioSocket: null,
      staffIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE7UlEQVRYhcWX3W9URRjGfzPn7AdtKVAppUtbSjF8SGlrWz4E0UQvjIYYjF57hcbEKy+8xfgHGOONMfoHGI1EYwwXNiGhpaXfLW1pKdAPwN1SKW2hbPfzzOvF6ZazyzYBEfskk5zd95n3ec7MnHlnYJ2hnqGvDeiV5zRgnreBbcBJ4E2gAagAileEHwC3gH6gBTgHLP4bQ/lQC/wIJAB5whYFfgBqnkW4CPgGSD2FcG6LAWcA/9OK1wDDzyCc29pwp/CJsA8I/4fimTYOhHLFchfhVqCrKGjVoEAphWNgOZ7OImmtKN4YdLsrN/2DpRjGSBavaIONUgoRQUSIxp1e4HVgOZ8BDZxVilM/f/02e/ZXoy1FJHKPtz78KSvxiaM1fP/V+9g+PygF4nD6s1+40H49y2Tr2dNsLinGGENn2wgfn2kB+Bb41CuawUnglAhM3F6ivDLEtlCIg7WVlJYEswwcbaqkpGQjm4qLVtoGXmmqzOLUVBazsyZEafl2toXKGJtayIQ+AZpzDWjgy8yfvUNhxKRR2sYKBGnYX5YzArtQ2rcygArB5viR6ixO3f7t+AJBd/iNQ8/ALa/mFxntjIHDuJsLAENX77IcjaKUAiyaG3asJn5hSwEH9pV5ugooTcOBEIUFj762xroKlLYB4eHifYavz3v9vYO7ka1mec8bnYxEmZ2Zc+dX2VkGDjdWEQz6UUqjfQHQ7rM/YHOooWKV19xQBcpNPzZ2m/vRrIWsgXe9Bl71RtOOMDAcBjEobdNQuwPbctfrsUNV+HwBBOH6xCzziwksO4jSFkebqgAoKvCxd8/2lRUuXOqZJg9OZAxoYE9utKs/jDhJlLYoLCpk34tbAXjtaDVoH5g051tHaW0fAQTB4viRnQAc3FuKf0MhgiBi6O67mc/APq+Bktzo5bFZEvEYSlsoy6bpYDnVlVuoqtiCUhbGpGnrnKS98wZOOoHSPuprd1BY4KO+NoTPHwCB2NJDLo/P5TNQAm5JzYuxqUUW7i1QsKkUpXw0NVSwnBQCwQ0AOI6ho2uCstKNpBJxAoWb8fkDNNeFaKyrBGWDpJi4HmbufnItGTRuOZ3PDcQTDkNXIohxUJaPxvoqjjVXY/uCiHEYvBLhwVKMG1N/E55ZQGmN1jaHXq6isb4apTSI0NE9tZb2vNfAtXyM7sEw4iTQlp/du0K88dpLaMuPSJrWjkkARKCtcwKMg9J+PjhZR2lZKSIGEUNXf975B7iaMQBwMR+jb3iGZCKOsmwChZvZUVnuipo0rZ2P3uxi5yTpdBxtB6jevYtgQRARQyK2zODo7FoG2rwGfs3HGBmfI7q0BCIIgrY0KMVyLEXfwPQqr6NnmmQ85u4NlkYpAGF6MkJkLp4vtQF+9xroBgZzWfcfJhkdv4OYNOIYEBDj0Nl7k2TKWeXN3n3I1WsRQBBxVgqwcKlnzfk/B/zlNWBw9+fH0DMYRkwSpRUohZgkF1bm34vWjgl3wSq9WiG7+m7lyYjBrTvGawDgD+C3XHbvUIRkPIoYB5NOIU6Kts7HDbR3T5FKuGVexJBKLDMwMpPPwHdAb+aHdx8wwEdAHZ7D5MCVO7ScH8UfDILSxOJpxq49nrir/zZ/tgygLY1JOyzcW+TmTPSx9wE+z+fKi//1SLYW1vVQmsG6Hsu9eK4Xk3W/mq375XTd8Q/GPGLNUR9jfgAAAABJRU5ErkJggg==",
      messageBuffer: ''
    }
  },
  mounted() {
    if (!this.$isServer) {
      this.init()
      // 
      const reauth = () => { this.$auth.loginWith('google'); console.log('reauuuth!') }
      // const reauth = () => 
      this.ioSocket = io(`/staff`, { path: '/ws/v1/socket.io' })
      this.ioSocket.on('connect', () => { this.isConnected = true })
      this.ioSocket.on('chatEvent', this.chatEventHandler)
      this.ioSocket.on('echoChatEvent', this.echoChatEventHandler)
      this.ioSocket.on('disconnect', () => { this.isConnected = false })
      this.ioSocket.on('error', (msg) => (typeof msg === 'string' && msg.includes('Auth error')) ? reauth() : null)
      // this.ioSocket.on('connect_error', (e) => { console.log('connect_error event: ',e) })
    }
  },
  methods: {
    ...mapActions(['setHasLocalStorage','addConvo', 'addMessage', 'syncFromLocalStorage', 'touchConvo']),
    // humanHash: humanHash,
    encodeUrlParms: require('@/functions/encodeUrlParams.js'),
    detectLocalStorage: require('@/functions/detectLocalStorage.js'),
    init() {
      const ls = this.detectLocalStorage()
      this.setHasLocalStorage(ls)
      if (ls) {
        this.syncFromLocalStorage()
      }
    },
    // scrollMessageBox() {
    //   // make sure all neccessary $refs exist
    //   if (this.$refs.hasOwnProperty('messageBox') && Array.isArray(this.$refs.messageBox) && this.$refs.messageBox[0].$refs.hasOwnProperty('msgWindow')) {
    //     const msgWindow = this.$refs.messageBox[0].$refs.msgWindow
    //     msgWindow.scrollTop = msgWindow.scrollTopMax // scroll messageWindow to bottom
    //   }
    // },
    chatEventHandler(chatEvent) {
      const socketId = chatEvent.from.replace(/\/client#/, '')
      const convo = this.conversations.find(obj => obj.sid === socketId)
      if (!convo) {
        const newConvo = new Conversation(socketId, chatEvent)
        this.addConvo(newConvo)
      } 
      this.addMessage([ socketId, chatEvent ])
    },
    echoChatEventHandler(echoChatEvent) {
      console.log(echoChatEvent)
      const socketId = echoChatEvent.to.replace(/\/client#/, '')
      const convo = this.conversations.find(obj => obj.sid === socketId)
      if (!convo) {
        const newConvo = new Conversation(socketId, echoChatEvent)
        this.addConvo(newConvo)
      }
      this.addMessage([ socketId, echoChatEvent ])
    },
    sendMessage(convoId) {
      if (!this.messageBuffer.length) { return false }
      const msgObj = { to: convoId, message: this.messageBuffer }
      this.ioSocket.emit('chatEvent', msgObj)
      this.messageBuffer = ''
    },
    // filterMessage: (msg, convoId) => (msg.to === convoId || msg.from === convoId),
    getConvo(sid) {
      return this.conversations.find((convo) => convo.sid === sid)
    },
    hasMessages(convoId) {
      return this.messages.some((msg) => (msg.to === convoId || msg.from === convoId))
    },
    getMessages(socketId) {
      const convoId = '/client#' + socketId
      return this.messages.filter((msg) => (msg.to === convoId || msg.from === convoId))
    },
    convoClickHandler(convoId) {
      // const updatedConvo = Object.assign({}, convo)
      // updatedConvo.lastRead = Date.now()
      // this.addConvo(updatedConvo)
      this.touchConvo(convoId) // updates lastRead timestamp
      this.$router.push(this.encodeUrlParms({ convoId: convoId }))
    },
    clearLocalStorage() {
      // debug/dev function
      if (this.hasLocalStorage) {
        const ls = Object.assign({}, localStorage)
        Object.keys(ls).filter(str => str.startsWith('convo')).forEach(str=> localStorage.removeItem(str))
      }
    },
    keyUp(e) {
      console.log(e)
      if (!e.shiftKey && !e.altKey && !e.ctrlKey && e.charCode === 0 && this.$refs && this.$refs.formButton && this.messageBuffer) {
        this.$refs.formButton[0].click()
      }
    }
  },
  computed: {
    ...mapState(['hasLocalStorage', 'conversations', 'convoSids', 'messages']),
    statusBar() {
      return {
        a: {
          href: this.isConnected ? '/disconnect' : '/connect',
          text: this.isConnected ? 'Disconnect' : 'Reconnect',
          class: this.isConnected ? 'red' : 'green',
          action: () => this.isConnected ? this.ioSocket.disconnect() : this.ioSocket.connect()
        }
      }
    },
    activeConvo() {
      let output
      if (this.$route.query.convoId) {
        output = this.conversations.find((convo) => convo.sid === this.$route.query.convoId)
      }
      return output
      // return this.conversations[this.$route.query.convoId]
    },
    activeMessages() {
      // let output
      if (this.activeConvo) {
        const convoId = this.$route.query.convoId
        return this.messages.filter((msg) => msg.to.includes(convoId) || msg.from.includes(convoId) )
      }
    }
  }
}
</script>