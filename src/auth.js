import axios from 'axios';

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
        const data = {
            "header": {
                "DATA_TYPE": "3"
            },
            "dto": {
                "USER_ID": id,
                "USER_PW": password
            }
        }
        var result;
        axios.post('http://192.1.4.246:14000/AB3-5/OJTWEB/ReadUserAccount?action=SO', data)
        .then(response => {
            const user = response.data.dto;
            const auth = (user.USER_PW === password);
            // console.log('Axios return: '+JSON.stringify(user))
            resolve(user);
        }).catch((e) => {
            console.log(e);
            reject(e)
        });
    })
}