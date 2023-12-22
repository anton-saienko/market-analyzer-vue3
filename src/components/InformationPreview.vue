<script setup lang="ts">
import markerIcon from '@/assets/img/map_pin.svg'
import { reactive, ref, watch, onMounted } from 'vue'
import type { GoogleMapEvent, BusinessObject, Coordinates } from '@/types'


//-- props
const props = withDefaults(defineProps<BusinessObject>(), {
    name: '',
    coordinates: () => ({
        lat: 0,
        lng: 0
    }),
    website: ''
})


//-- data
const markerPosition: Coordinates = reactive({ lat: 0, lng: 0 })
const mapPosition: Coordinates = reactive({ lat: 0, lng: 0 })
const markers = [{ id: 1, position: markerPosition }]
const businessOwnership = ref('my')
const businessName = ref('')
const businessWebsite = ref('')
const mapStyles = [{
    stylers: [
        { invert_lightness: true },
        { saturation: -100 },
        { hue: '#FF1A00' },
        { lightness: 33 },
        { gamma: 0.5 }
    ]
},
{
    featureType: 'water',
    stylers: [{ color: '#2D333C' }]
}]


//-- watch
watch(() => props.name, () => {
    setValuesFromProps()
})


//-- methods
const setMarkerPosition = (e: GoogleMapEvent) => {
    markerPosition.lat = e.latLng.lat()
    markerPosition.lng = e.latLng.lng()
}

const setValuesFromProps = () => {
    businessName.value = props.name
    markerPosition.lat = props.coordinates.lat
    markerPosition.lng = props.coordinates.lng
    mapPosition.lat = props.coordinates.lat
    mapPosition.lng = props.coordinates.lng
    businessWebsite.value = props.website
}

const submit = () => {
    const finalObject = {
        name: businessName.value,
        coordinates: {
            lat: markerPosition.lat,
            lng: markerPosition.lng
        },
        website: businessWebsite.value
    }
    console.log(finalObject)
    // to do - submit the form
}


//-- hooks
onMounted(() => {
    setValuesFromProps()
})
</script>

<template>
    <div class="add-header">
        <div>Location:</div>
        <div class="add-drag">Drag marker to change location</div>
    </div>
    <GMapMap class="google-map"
        @click="setMarkerPosition"
        :center="mapPosition"
        :zoom="16"
        :options="{
            controlSize: 30,
            styles: mapStyles,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        }">
        <GMapMarker
            v-for="marker in markers"
            :key="marker.id"
            :draggable="true"
            :position="markerPosition"
            :icon="{
                url: markerIcon,
                scaledSize: { width: 50, height: 50 }
            }"
            @dragend="setMarkerPosition"
        />
    </GMapMap>
    <div class="small-title">I'm analyzing for:</div>
    <div class="selection-wrapper">
        <div class="single-selection">
            <input type="radio" name="business_ownership" id="my" value="my" v-model="businessOwnership" checked>
            <label for="my">My Business</label>
        </div>
        <div class="single-selection">
            <input type="radio" name="business_ownership" id="another" value="another" v-model="businessOwnership">
            <label for="another">Another Business</label>
        </div>
    </div>
    <div class="small-title">
        <span v-if="businessOwnership === 'my'">My</span><span v-else>Another</span> Business' Name:
    </div>
    <input class="business-name" type="text" v-model="businessName" placeholder="Enter Business Name">
    <div class="small-title">Business Website</div>
    <input class="business-name" type="text" v-model="businessWebsite" placeholder="Enter Business Website">
    <button class="continue" :disabled="!businessName" @click="submit">Continue</button>
</template>

<style lang="scss" scoped>
.google-map {
    height: 225px;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
}
.add-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 15px;
    color: #F5F5F5;
}
.add-drag {
    color: #C2C2C2;
    font-size: 14px;
}
.selection-wrapper {
    display: flex;
    padding-top: 5px;
}
.single-selection {
    margin-right: 30px;
    padding-left: 30px;
    input {
        display: none;
        &:checked {
            & + label:before {
                background: #6A61AD;
            }
            & + label:after {
                display: block;
            }
        }
    }
    label {
        cursor: pointer;
        display: block;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: -2px;
            left: -30px;
            background: white;
            border-radius: 50%;
        }
        &:after {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            top: 1px;
            left: -27px;
            background-image: url('@/assets/img/check.png');
            background-size: contain; background-repeat: no-repeat;
            background-position: center center;
            border-radius: 50%;
            display: none;
        }
    }
}
.small-title {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 14px;
}
.business-name {
    padding: 0 15px;
    height: 45px;
    width: 100%;
    box-sizing: border-box;
    color: #424242;
    outline: none;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    &::placeholder {
        color: #878E96;
    }
}
.continue {
    margin-top: 45px;
    color: white;
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 0 15px;
    height: 45px;
    width: 100%;
    background: #6A61AD;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    font-size: 22px;
    cursor: pointer;
    &:disabled {
        background: #534A84;
        color: #B1AEB8;
        cursor: default;
    }
}
</style>