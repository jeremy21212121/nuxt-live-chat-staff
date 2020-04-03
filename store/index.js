const state = () => ({
  hasLocalStorage: false,
  conversations: {},
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
    state.conversations[obj.sid] = obj
    if (state.hasLocalStorage && lsFlag) { // lsFlag prevents unnecessary writes to localStorage
      localStorage.setItem(`convo${obj.sid}`, JSON.stringify(obj))
    }
  },
  ADD_MESSAGE(state, [ sid, messageObj ]) {
    const convoExists = state.conversations.hasOwnProperty(sid)
    if (convoExists) {
      state.conversations[sid].messages.push(messageObj)
      if (state.hasLocalStorage) {
        const string = JSON.stringify(state.conversations[sid].messages)
        localStorage.setItem(`convo${sid}messages`, string)
      }
    }
  },
  SET_CONVERSATIONS(state, arr) {
    const string = JSON.stringify(arr)
    state.conversations = JSON.parse(string)
    if (state.hasLocalStorage) {
      localStorage.setItem('conversations', string)
    }
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
      sidArray.forEach(sid => {
        const convo = localStorage.getItem(`convo${sid}`)
        if (convo) {
          const convoObj = JSON.parse(convo)
          convoObj.messages = []
          commit('ADD_CONVERSATION', [ convoObj, false ])
          const messages = localStorage.getItem(`convo${sid}messages`)
          if (messages) {
            const messageArr = JSON.parse(messages)
            messageArr.forEach(messageObj => { commit('ADD_MESSAGE', [ sid, messageObj ]) })
          }
        }
      })
      commit('SET_CONVO_SIDS', JSON.parse(sids))
    }
  },
  addConvo({ commit }, convoObj) {
    commit('ADD_CONVERSATION', [ convoObj, true ])
    commit('ADD_CONVO_SID', convoObj.sid)
  },
  addMessage({ commit }, [ sid, messageObj ]) {
    commit('ADD_MESSAGE', [ sid, messageObj ])
  }
}

export default { state, mutations, actions }
