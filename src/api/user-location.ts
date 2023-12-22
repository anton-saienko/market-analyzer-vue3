import axios from '@/api/axios';
import { IP_STACK_KEY } from '@/constants';

const getUserLocation = () => {
    return axios.get(`https://api.ipstack.com/check`, {
        params: {
            access_key: IP_STACK_KEY
        }
    })
}

export default {
    getUserLocation
}