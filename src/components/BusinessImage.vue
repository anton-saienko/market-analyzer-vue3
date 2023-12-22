<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GOOGLE_MAP_API_KEY } from '@/constants'
import { getPlaceInfo } from '@/api/search-business'


//-- emits
const emit = defineEmits<{
    (e: 'set-business-info', coordinates: {lat: number, lng: number}, website: string, place_id: string): void
}>()


//-- props
const props = defineProps<{
    placeId?: string
}>()


//-- data
const imageLink = ref('')


//-- methods
const getImageLink = async () => {
    try {
        if (props.placeId) {
            const result = await getPlaceInfo(props.placeId)
            const photos = result.data.result.photos
            const coordinates = result.data.result.geometry.location
            const website = result.data.result.website
            emit('set-business-info', coordinates, website, props.placeId)
            if (photos) {
                imageLink.value = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photo_reference=${photos[0].photo_reference}&key=${GOOGLE_MAP_API_KEY}`
            }
        }
    } catch(e) {
        console.log(e)
    }
}


//-- hooks
onMounted(() => {
    getImageLink()
})
</script>

<template>
    <div class="business-img">
        <img v-if="imageLink" :src="imageLink" alt="">
    </div>
</template>

<style lang="scss" scoped>
.business-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #E4E4E4;
    margin-right: 10px;
    overflow: hidden;
    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        vertical-align: top;
    }
}
</style>