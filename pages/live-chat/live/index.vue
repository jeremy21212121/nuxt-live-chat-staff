<style lang="scss" scoped>
@import '@/scss/colours.scss';
main.container {
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
    }
  }
}
section.convos {
  width: 100%;

  ul.convo-list {
    padding: 0;
    width: 100%;
    height: 75vh;
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
      &.active {
        min-height: 550px;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        padding: 3px 6px;
        div.alert-wrapper {
          display: none;
        }
        ul.messages {
          padding: 0;
          width: 100%;
          height: 80%;
          border: 1px solid $primary;
          flex-grow: 1;
          list-style-type: none;
          li {
            border: 1px solid $primary;
            display: flex;
            align-items: center;
            margin: 2px;
            img {
              border-radius: 50%;
              padding: 4px;
            }
            span {
              flex-grow: 1;
            }
          }
        }
        div.input {
          display: flex;
          input {
            flex-grow: 1;
          }
        }
      }
      &.small {
        flex-direction: row;
        padding: 5px 15px;
        height: 75px;
        // justify-content: flex-start;
        div {
          width: 0px;
          // flex-basis: 0px;
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
        // transform: scale(2);
        width: 40px;
        height: 40px;
      }
      h3 {
        text-transform: capitalize;
        // color: $light;
      }
      &:hover {
        color: $black90;
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
        <a @click.prevent="statusBar.a.action" :href="statusBar.a.href" :class="statusBar.a.class" :title="`Click to ${statusBar.a.text}`">{{ statusBar.a.text }}</a>
      </div>
      <h1 class="title">{{ title }}</h1>
    </section>
    <section class="convos">
      <ul class="convo-list">
        <li
          v-for="(sid, index) in convoSids"
          :key="`chatbox${index}`"
          @click.prevent="convoClickHandler(conversations[sid])"
          href="#"
          class="button--grey chatbox"
          :class="{ clickable: !activeConvo || activeConvo.sid !==  sid, small: activeConvo && activeConvo.sid !==  sid, active: activeConvo && activeConvo.sid ===  sid }"
        >
          <div class="alert-wrapper" v-if="conversations[sid].messages.length && conversations[sid].lastRead < conversations[sid].messages[conversations[sid].messages.length - 1].time">
            <span v-if="true" class="new">New message(s) from:</span>
            <span class="alert">!</span>
          </div>
          <img :src="conversations[sid].identicon" :alt="conversations[sid].humanId" :title="conversations[sid].humanId">
          <h3>{{ conversations[sid].humanId }}</h3>
          <ul class="messages"
            v-if="activeConvo && activeConvo.sid ===  sid"
          >
            <li
             v-for="(message, msgIndex) in conversations[sid].messages"
             :key="`message${msgIndex}`"
             :class="message.to === 'staff' ? 'received' : 'sent'"
            >
              <img :src="message.to === 'staff' ? activeConvo.identicon : staffIcon" alt="Sender icon">
              <span>{{ message.message }}</span>
            </li>
          </ul>
          <div v-if="activeConvo && activeConvo.sid ===  sid" class="input">
            <input v-model="messageBuffer" type="text">
            <button @click.prevent="sendMessage(activeConvo)" :disabled="!messageBuffer.length">Send</button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
<script>

function identictonDataUri(sid) {
  const b64PngIdenticton = new Identicton(sha1(sid).toString(), 20)
  return `data:image/png;base64,${b64PngIdenticton}`
}

function Conversation(socketId, chatEvent) {
  this.id = chatEvent.from
  this.sid = socketId
  this.humanId = humanHash(socketId)
  this.identicon = identictonDataUri(socketId)
  this.messages = []
  this.lastRead = 0
  this.archived = false
}

import io from '@/node_modules/socket.io-client/dist/socket.io.slim'
// import io from 'socket.io-client'
import humanHash from '@/mixins/humanHash'
import sha1 from 'crypto-js/sha1'
import Identicton from 'identicon.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'LiveSupportChat',
  // mixins: [ humanHash ],
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
    ...mapActions(['setHasLocalStorage','addConvo', 'addMessage', 'syncFromLocalStorage']),
    detectLocalStorage() {
      const testVal = 'test583745'
      try {
        localStorage.setItem(testVal, testVal)
        const checkVal = localStorage.getItem(testVal)
        localStorage.removeItem(testVal)
        return testVal === checkVal
      } catch (e) {
        return false
      }
    },
    init() {
      const ls = this.detectLocalStorage()
      this.setHasLocalStorage(ls)
      if (ls) {
        this.syncFromLocalStorage()
      }
    },
    chatEventHandler(chatEvent) {
      const socketId = chatEvent.from.replace(/\/client#/, '')
      const convo = this.conversations.hasOwnProperty(socketId)
      if (!convo) {
        const newConvo = new Conversation(socketId, chatEvent)
        // newConvo.messages.push(chatEvent)
        this.addConvo(newConvo)
      } 
      // else {
        this.addMessage([ socketId, chatEvent ])
      // }
    },
    echoChatEventHandler(echoChatEvent) {
      const socketId = echoChatEvent.to.replace(/\/client#/, '')
      const convo = this.conversations.hasOwnProperty(socketId)
      if (!convo) {
        this.addConvo(new Conversation(socketId, echoChatEvent))
      }
      this.addMessage([ socketId, echoChatEvent ])
    },
    convoClickHandler(convo) {
      const updatedConvo = Object.assign({}, convo)
      updatedConvo.lastRead = Date.now()
      this.addConvo(updatedConvo)
      this.$router.push(`?convoId=${convo.sid}`)
    },
    sendMessage(convo) {
      const msgObj = { to: convo.id, message: this.messageBuffer }
      this.ioSocket.emit('chatEvent', msgObj)
      this.messageBuffer = ''
    }
  },
  computed: {
    ...mapState(['hasLocalStorage', 'conversations', 'convoSids']),
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
        output = this.conversations[this.$route.query.convoId]
      }
      return output
      // return this.conversations[this.$route.query.convoId]
    },
    activeMessages() {
      // let output
      if (this.activeConvo) {
        return this.activeConvo.messages
      }
    }
  }
}
</script>