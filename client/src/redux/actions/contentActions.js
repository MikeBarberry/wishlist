import { SET_USER_CONTENT, DELETE_CONTENT, UPDATE_LIKES, ADD_CONTENT } from './types';
import store from '../store'

export const getUserContent = jwt => (dispatch) => {
    fetch('/index', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(jwt)
    })
    .then(res => res.json())
    .then(json => {
        dispatch({
            type: SET_USER_CONTENT,
            payload: json
        })
    });
};

export const deleteContent = request => (dispatch) => {
    fetch('/delete', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(request)
      })
    .then(res => res.json())
    .then(json => {
        const deletedContent = json.updated.deleted_content
        const newContent  = json.updated.new_content
        const index = store.getState().userContent.userContent.map(e => e.id).indexOf(deletedContent)
        const updateContent = store.getState().userContent.userContent.splice(index, 1)
        console.log(updateContent)
         dispatch({
            type: DELETE_CONTENT,
            payload: { 
                newContent: newContent
            }
        }) 
    })
}

export const addContent = request => (dispatch) => {
    fetch('/add', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(request)
      })
    .then(res => res.json())
    .then(json => {
        dispatch({
            type: ADD_CONTENT,
            payload: json.updated
        }) 
    })
}

export const likeContent = request => (dispatch) => {
    fetch('/like', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(request)
    })
    .then(res => res.json())
    .then(json => {
        dispatch({
            type: UPDATE_LIKES,
            payload: json.updated_likes
        }) 
    })
}