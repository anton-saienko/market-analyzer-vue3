<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { businessStructure } from '@/constants'
import type { Place, BusinessObject } from '@/types'
import { googleAutocomplete } from '@/api/search-business'
import BusinessImage from '@/components/BusinessImage.vue'


//-- emits
const emit = defineEmits<{
    (e: 'select-business', business: BusinessObject): void,
    (e: 'unselect-business'): void
}>()


//-- data
const businessName = ref('')
const errorMessage = ref('')
const tipIsActive = ref(false)
const places = ref<Place[]>([])
const userStore = useUserStore()
const selectionDone = ref(false)
const loadingResults = ref(false)
const selectedBusiness = ref<Place | null>()
const searchInput = ref<HTMLInputElement | null>(null)
const businessData: BusinessObject = reactive(structuredClone(businessStructure))


//-- methods
const searchPlaces = async (e: Event) => {
    try {
        loadingResults.value = true
        selectedBusiness.value = null
        emit('unselect-business')
        const value = (e.target as HTMLInputElement).value
        const result = await googleAutocomplete(value, userStore.userLocation)
        places.value = result.data.predictions
    } catch(e) {
        console.log(e)
        errorMessage.value = 'Oops, something went wrong...'
    } finally {
        loadingResults.value = false
    }
}

const showTip = () => {
    setTimeout(() => {
        if (!selectionDone.value) {
            tipIsActive.value = true
        }
    }, 5000)
}

const hideTip = () => {
    if (places.value.length === 0) {
        tipIsActive.value = false
    }
}

const selectPlace = (placeId: string) => {
    const place = places.value.find(p => p.place_id === placeId)
    const fullName = `${place?.structured_formatting.main_text}, ${place?.structured_formatting.secondary_text}`
    selectedBusiness.value = place
    businessName.value = fullName
    selectionDone.value = true
    tipIsActive.value = false
    places.value = []
    businessData.name = fullName
    if (place) {
        businessData.coordinates = place.coordinates
        businessData.website = place.website
    }
    emit('select-business', businessData)
}

const clearSelection = () => {
    places.value = []
    businessName.value = ''
    selectedBusiness.value = null
    searchInput.value?.focus()
    emit('unselect-business')
}

const setBusinessInfo = (coordinates: {lat: number, lng: number}, website: string, placeId: string) => {
    const placeIndex = places.value.findIndex((place => place.place_id === placeId))
    places.value[placeIndex].coordinates = coordinates
    places.value[placeIndex].website = website
}
</script>

<template>
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="search-holder">
        <div class="selected-item" v-if="selectedBusiness">
            <business-image :place-id="selectedBusiness?.place_id"/>
        </div>
        <input
            ref="searchInput"
            type="text"
            class="search-input"
            :class="{'selected': selectedBusiness}"
            v-model="businessName"
            placeholder="Type in your business name and tap the result"
            @input="searchPlaces"
            @focus="showTip"
            @focusout="hideTip"
        >
        <div class="search-close" v-if="businessName" @click="clearSelection">&times;</div>
    </div>
    <div class="search-dropdown">
        <div class="search-loading" v-if="loadingResults">Loading...</div>
        <div class="search-item" v-for="p in places" :key="p.place_id" @click="selectPlace(p.place_id)">
            <business-image @set-business-info="setBusinessInfo" :place-id="p.place_id"/>
            <div class="item-text">
                <span class="item-name">{{ p.structured_formatting.main_text }},</span>
                <span class="item-city">{{ p.structured_formatting.secondary_text }}</span>
            </div>
        </div>
        <div class="search-tip" v-if="tipIsActive">
            <div class="tip-img-wrapper">
                <div class="tip-img">?</div>
            </div>
            <div class="tip-text">
                <span class="tip-bold">Having trouble finding a business?</span>
                Try using the domain (ex: example.com)
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.search-input {
    padding: 0 15px;
    height: 45px;
    width: 100%;
    box-sizing: border-box;
    color: #757575;
    outline: none;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    &.selected {
        padding-left: 60px;
    }
}
.search-dropdown {
    background: #FFFFFF;
    margin-top: -3px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    color: #212121;
}
.search-loading {
    padding: 10px 15px;
}
.search-item {
    display: flex;
    cursor: pointer;
    padding: 5px 15px;
    align-items: center;
    box-sizing: border-box;
    &:hover {
        background-color: #F3F3F3;
    }
}
.item-text {
    width: calc(100% - 35px);
}
.item-name {
    display: inline;
    font-size: 14px;
    margin-right: 5px;
}
.item-city {
    font-size: 12px;
    margin-right: 5px;
}
.search-tip {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    cursor: default;
}
.tip-img-wrapper {
    width: 35px;
    height: 35px;
}
.tip-img {
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    border: 3px solid #6A61AD;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6A61AD;
    font-size: 26px;
    font-weight: 700;
}
.tip-text {
    width: calc(100% - 35px);
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 14px;
    line-height: 20px;
    @media screen and (max-width: 480px) {
        font-size: 11px;
        line-height: 16px;
    }
}
.tip-bold {
    font-weight: 700;
}
.search-holder {
    position: relative;
}
.selected-item {
    position: absolute;
    top: 5px;
    left: 15px;
}
.error-message {
    color: #EE5643;
    margin-bottom: 15px;
}
.search-close {
    position: absolute;
    right: 10px;
    top: 5px;
    color: #5E6B79;
    padding: 5px 10px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 20px;
    background-color: #FFFFFF;
}
</style>