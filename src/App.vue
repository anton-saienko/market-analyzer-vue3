<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import authApi from '@/api/user-location';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(async () => {
    const response = await authApi.getUserLocation()
    const latitude = response.data.latitude
    const longitude = response.data.longitude
    if (latitude) {
        userStore.setUserLocation(latitude, longitude)
    }
})
</script>

<template>
    <router-view/>
</template>