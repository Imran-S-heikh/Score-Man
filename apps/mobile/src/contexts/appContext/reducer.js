const { OPTIONS_DROP_DOWN_OPEN, STACK_PROPS } = require("./types");

export default function appReducer(state,action) {
    switch (action.type) {
        case OPTIONS_DROP_DOWN_OPEN:
            return {...state,optionsOpen: action.value };
    
        default:
            return state;
    }
}