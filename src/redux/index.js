import {createStore} from 'redux'

const cache = (state={},action) => {
    return {...state,[action.type]:action.data}
}

const store = createStore(cache)

export default store