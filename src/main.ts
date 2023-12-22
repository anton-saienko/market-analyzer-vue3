import '@/assets/css/normalize.css';
import '@/assets/css/global.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { GOOGLE_MAP_API_KEY } from '@/constants';

import App from '@/App.vue'
import router from '@/router'
import VueGoogleMaps from 'vue-google-maps-community-fork'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(VueGoogleMaps, {
    load: {key: GOOGLE_MAP_API_KEY}
})

app.mount('#app')