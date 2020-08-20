import axios from 'axios';

//configuartion setting
const instance = axios.create({
   baseURL: 'https://reactburger-4b897.firebaseio.com/'
});

export default instance;