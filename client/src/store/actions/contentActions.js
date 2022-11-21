import {
  SET_USER_CONTENT,
  DELETE_CONTENT,
  UPDATE_LIKES,
  ADD_CONTENT,
  CONTENT_SUCCESS,
} from "./types";
import store from "../../store";

export const getUserContent = (jwt) => (dispatch) => {
  fetch("/api/index", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(jwt),
  })
    .then((res) => res.json())
    .then((json) => {
      dispatch({
        type: SET_USER_CONTENT,
        payload: json,
      });
    });
};

export const deleteContent = (request) => (dispatch) => {
  fetch("/api/delete", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((res) => res.json())
    .then((json) => {
      const { deletedContent, newContent } = json.updated;
      const index = store
        .getState()
        .userContent.userContent.map((e) => e.id)
        .indexOf(deletedContent);
      dispatch({
        type: DELETE_CONTENT,
        payload: {
          deleteIndex: index,
          newContent: newContent,
        },
      });
    });
};

export const addContent = (request) => (dispatch) => {
  fetch("/api/add", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((res) => res.json())
    .then((json) => {
      dispatch({
        type: ADD_CONTENT,
        payload: json.updated,
      });
      dispatch({
        type: CONTENT_SUCCESS,
        payload: true,
      });
    });
};

export const likeContent = (request) => (dispatch) => {
  fetch("/api/like", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((res) => res.json())
    .then((json) => {
      dispatch({
        type: UPDATE_LIKES,
        payload: json.updated_likes,
      });
    });
};
