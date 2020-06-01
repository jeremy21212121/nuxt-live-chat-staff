// NPM modules
import sha1 from 'crypto-js/sha1'
import Identicton from 'identicon.js'
// my own module that is not on NPM yet
import humanHash from '@/functions/humanHash.js'
// const humanHash = require('@/functions/humanHash.js')

// returns a base64-encoded PNG data URI
const identictonDataUri = (sid) => {
  const b64PngIdenticton = new Identicton(sha1(sid).toString(), 20)
  return `data:image/png;base64,${b64PngIdenticton}`
}

// constructor function
const Conversation = function(socketId, chatEvent) {
  // conversations are created on a chatEvent from a new user
  this.id = '/client#' + socketId
  this.sid = socketId
  this.humanId = humanHash(socketId)
  this.identicon = identictonDataUri(socketId)
  // this.messages = [] // messages are now stored in a seperate array
  this.lastRead = 0
  this.archived = false
}

export default Conversation
