import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            userLocation: {
                lat: 0,
                lng: 0
            }
        }
    },
    actions: {
        setUserLocation(latitude: number, longtitude: number) {
            this.userLocation = {
                lat: latitude,
                lng: longtitude
            }
        }
    }
})