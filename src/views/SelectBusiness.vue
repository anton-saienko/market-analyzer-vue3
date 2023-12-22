<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { BusinessObject } from '@/types'
import { businessStructure } from '@/constants'
import SearchBusiness from '@/components/SearchBusiness.vue'
import InformationPreview from '@/components/InformationPreview.vue'


// data
const showPreview = ref(false)
const manualSearch = ref(false)
const userStore = useUserStore()
let selectedBusiness: BusinessObject = reactive(structuredClone(businessStructure))


// methods
const selectBusiness = (business: BusinessObject) => {
    selectedBusiness = business
    showPreview.value = true
}

const unSelectBusiness = () => {
    selectedBusiness = structuredClone(businessStructure)
    showPreview.value = false
}

const startManual = () => {
    unSelectBusiness()
    manualSearch.value = true
    selectedBusiness.coordinates = {
        lat: userStore.userLocation.lat,
        lng: userStore.userLocation.lng
    }
}

const goBack = () => {
    unSelectBusiness()
    manualSearch.value = false
}

const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            userStore.setUserLocation(lat, lng)
        },
        (error) => {
            console.error("Error getting user location:", error)
        }
    )
}


//-- hooks
onMounted(async () => {
    getUserLocation()
})
</script>

<template>
    <div class="cone"></div>
    <header class="header">
        <div class="logo-title">MarketAnalyzer</div>
        <!-- <div class="logo-img"> <img src="https://buyerbridge-assets-public.s3.amazonaws.com/attachedFiles/WCDqea4ajFk5GpgEObOnWLNPCuOLqKsR9fk6qIdR.png"> </div> -->
    </header>
    <div class="main">
        <div class="main-left">
            <div class="main-title">Visualize your market opportunity.</div>
            <div class="main-desc">
                Don't know where to start with your digital strategy?
                There are so many factors to consider when making marketing decisions, like audience targeting, budget, and ROI.
                We built this tool to give you everything you need to visualize your market opportunity and make data-driven decisions with your ad dollars.
            </div>
        </div>
        <div class="main-right">
            <div class="right-inner">
                <div class="search-title">
                    <span v-if="manualSearch">Add business manually</span>
                    <span v-else>Search for your business</span>
                </div> 
                <template v-if="!manualSearch">
                    <search-business
                        @select-business="selectBusiness"
                        @unselect-business="unSelectBusiness"
                    />
                    <div class="search-or">Or click <span class="search-here" @click="startManual">here</span> to enter details manually</div>
                </template>
                <div v-if="showPreview" class="information-title">Does this information look right?</div>
                <information-preview
                    v-if="showPreview || manualSearch"
                    :name="selectedBusiness.name"
                    :coordinates="selectedBusiness.coordinates"
                    :website="selectedBusiness.website"
                />
                <button class="go-back" v-if="manualSearch" @click="goBack">&lt; &nbsp; go back</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    padding: 35px 50px;
}
.logo-title {
    font-size: 20px;
    font-weight: 600;
}
.logo-img {
    margin-left: 50px;
    img {
        max-height: 90px;
        width: auto;
    }
}
.cone {
    background-color: #3222a7;
    position: absolute;
    opacity: 0.7;
    z-index: -1;
    top: 0;
    right: 0;
    width: 80%;
    height: 80%;
    max-width: 55vw;
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: right top;
    mask-image: url('@/assets/img/cone_level_curves.svg');
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: right top;
    -webkit-mask-image: url('@/assets/img/cone_level_curves.svg');
    @media screen and (max-width: 991px) {
        width: 100%;
        height: 100%;
    }
}
.main {
    display: flex;
    justify-content: center;
    padding-top: 125px;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
        padding-top: 0;
    }
}
.main-left {
    width: 400px;
    margin-right: 4%;
    box-sizing: border-box;
    @media screen and (max-width: 1024px) {
        width: 100%;
        padding: 30px;
    }
}
.main-right {
    width: 500px;
    display: flex;
    align-items: center;
    margin-left: 4%;
    box-sizing: border-box;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-left: 0;
    }
}
.right-inner {
    width: 100%;
    background: rgba(106, 97, 173, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 12px; padding: 50px;
    box-sizing: border-box;
    @media screen and (max-width: 1024px) {
        padding: 30px;
    }
}
.main-title {
    font-family: 'Work Sans', sans-serif;
    font-size: 60px;
    line-height: 60px;
    font-weight: 600;
    margin-bottom: 30px;
    @media screen and (max-width: 480px) {
        font-size: 30px;
        line-height: 30px;
    }
}
.main-desc {
    font-size: 20px;
    line-height: 28px;
    font-weight: 300;
    @media screen and (max-width: 480px) {
        font-size: 14px;
        line-height: 18px;
    }
}
.search-title {
    font-family: 'Work Sans', sans-serif;
    font-size: 28px;
    line-height: 36px;
    font-weight: 600;
    margin-bottom: 25px;
    @media screen and (max-width: 480px) {
        font-size: 20px;
        line-height: 24px;
    }
}
.search-or {
    font-weight: 300;
    margin-top: 15px;
}
.search-here {
    font-weight: 700;
    cursor: pointer;
}
.information-title {
    font-family: 'Work Sans', sans-serif;
    font-size: 20px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 15px;
}
.go-back {
    margin-top: 30px;
    color: white;
    border: none;
    outline: none;
    background: none;
    border: 1px solid white;
    border-radius: 5px;
    width: 100%;
    height: 45px;
    cursor: pointer;
}
</style>