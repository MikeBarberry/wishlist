import { SET_USER_CONTENT } from '../actions/types'
import { DELETE_USER_CONTENT } from '../actions/types'

let initialState = {
    userContent: [],
    lifestyleContent: [],
    clothingContent: [],
    technologyContent: [],
    householdContent: [],
    newPosts: [],
}

const contentReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_CONTENT:
            return {
                ...state,
                userContent: action.payload.user_content,
                lifestyleContent: action.payload.user_content.filter(content => {
                    return  content.category === "lifestyle"
                }),
                clothingContent: action.payload.user_content.filter(content => {
                    return  content.category === "clothing"
                }),
                technologyContent: action.payload.user_content.filter(content => {
                    return  content.category === "technology"
                }),
                householdContent: action.payload.user_content.filter(content => {
                    return  content.category === "household"
                }),
                newPosts: action.payload.new_posts
            }
        case DELETE_USER_CONTENT:
            return {
                ...state,
                userContent: action.payload.updated_content,
                newPosts: action.payload.new_content
            }
        default:
            return state
    }
}

export default contentReducer