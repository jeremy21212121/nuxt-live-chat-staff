const state = () => ({
  hasLocalStorage: false,
  conversations: [],
  messages: [],
  convoSids: []
})

const mutations = {
  SET_HAS_LOCAL_STORAGE(state, bool) {
    state.hasLocalStorage = bool
  },
  ADD_CONVO_SID(state, string) {
    if (state.convoSids.includes(string)) { return }
    state.convoSids.push(string)
    if (state.hasLocalStorage) {
      localStorage.setItem('convoSids', JSON.stringify(state.convoSids))
    }
  },
  SET_CONVO_SIDS(state,  array) {
    state.convoSids = array
  },
  ADD_CONVERSATION(state, [ obj, lsFlag]) {
    state.conversations.push(obj)
    if (state.hasLocalStorage && lsFlag) { // lsFlag prevents unnecessary writes to localStorage
      // store each convo seperately to reduce large writes to localStorage each time a convo is added.
      // each convo obj is kind of large, about 3kB, due to having a base64 encoded png image
      localStorage.setItem(`convo${obj.sid}`, JSON.stringify(obj))
    }
  },
  ADD_MESSAGE(state, [ sid, messageObj, lsFlag ]) {
    // const convoExists = state.conversations.find((obj) => obj.sid === sid )
    // if (convoExists) {
    state.messages.push(messageObj)
    if (state.hasLocalStorage && lsFlag) {
      const convoMessages = state.messages.filter((msg) => msg.from.includes(sid) || msg.to.includes(sid))
      // storing each conversation's messages seperately to reduce frequency and size of writes to localStorage
      localStorage.setItem(`convo${sid}messages`, JSON.stringify(convoMessages))
    }
    // }
  },
  TOUCH_CONVO(state, convoId) {
    // sets lastRead property timestamp to current moment
    const convo = state.conversations.find((convoObj) => convoObj.sid === convoId)
    if (!convo) {
      console.log(`Can't find convo: ${convoId} to update timestamp`)
      return false
    }
    convo.lastRead = Date.now()
    if (state.hasLocalStorage) {
      localStorage.setItem(`convo${convo.sid}`, JSON.stringify(convo))
    }
    return true
  }
}

const actions = {
  setHasLocalStorage({ commit }, boolean) {
    commit('SET_HAS_LOCAL_STORAGE', boolean)
  },
  syncFromLocalStorage({ commit }) {
    const sids = localStorage.getItem('convoSids')
    if (sids) {
      const sidArray = JSON.parse(sids)
      // const convos = []
      const sidArrayIsValid = Array.isArray(sidArray) && sidArray.every(str => typeof str === 'string')
      if (!sidArrayIsValid) {
        console.log('Error loading sid array from localStorage')
        return
      }
      sidArray.forEach(sid => {
        const convo = localStorage.getItem(`convo${sid}`)
        if (convo) {
          const convoObj = JSON.parse(convo)
          // convoObj.messages = []
          delete convoObj.messages // messages are no longer part of conversations array but rather their own messages array
          commit('ADD_CONVERSATION', [ convoObj, true ]) // set to true temporarily to update ls schema. false boolean prevents superfluous write to localStorage, since we just read the value from there
          const messages = localStorage.getItem(`convo${sid}messages`)
          if (messages) {
            const messageArr = JSON.parse(messages)
            messageArr.forEach(messageObj => { commit('ADD_MESSAGE', [ sid, messageObj, false ]) }) // false boolean prevents superfluous write to localStorage, since we just read the value from there
          }
        }
      })
      commit('SET_CONVO_SIDS', JSON.parse(sids)) // we always set the sids last, by convention. 
    }
  },
  addConvo({ commit }, convoObj) {
    commit('ADD_CONVERSATION', [ convoObj, true ]) // true boolean flag tells mutation to set relevant localStorage key
    commit('ADD_CONVO_SID', convoObj.sid)
  },
  addMessage({ commit }, [ sid, messageObj ]) {
    commit('ADD_MESSAGE', [ sid, messageObj, true ]) // true boolean flag tells mutation to set relevant localStorage key
  },
  touchConvo({ commit }, convoId) {
    commit('TOUCH_CONVO', convoId)
  }
}

export default { state, mutations, actions }
