import axios from 'axios';
import crypto from 'crypto';

const users = [
    { id: 'kim@test.com', password: '123', name: 'Kim' },
    { id: 'lee@test.com', password: '456', name: 'Lee' },
    { id: 'park@test.com', password: '789', name: 'Park' }
  ]

export function onLogin ({ id, password }) {
    return new Promise ((resolve, reject) => {
        // const user = users.find(user => user.id === id && user.password === password);
        // console.log(user)
        // return user;
        const pw = crypto.createHash('sha512').update(password).digest('base64');
        const data = {
            "header": {
                "DATA_TYPE": "3"
            },
            "dto": {
                "USER_ID": id,
                "USER_PW": pw
            }
        }
        axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadUserAccount?action=SO', data)
        .then(response => {
            const user = response.data.dto;
            if (user != null){
                const auth = (user.USER_PW === pw);
                if(auth){
                    window.sessionStorage.setItem('id', user.USER_ID);
                    window.sessionStorage.setItem('lastlogin', user.LAST_LOGIN);
                    resolve(user);
                }else{
                    reject('not auth');
                }
            }else{
                reject('not exist');
            }
        }).catch((e) => {
            console.log(e);
            reject(e)
        });
    })
}