import {atom} from "recoil"

export const UserState = atom({
    key: "USER_STATE",
    default: new Promise(async (resolve)=>{
        // setTimeout(() => {
        //     resolve({
        //         name: "imran",
        //         age: 23
        //     })
        // }, 1000 * 5);
    }) 
});