import axios from '@/api/axios'
import { API_DOMAIN } from '@/constants'
import type { Coordinates } from '@/types'

export const googleAutocomplete = (value: string, coordinates: Coordinates) => {
    return axios.get(`${API_DOMAIN}/google/maps/place/autocomplete/json?input=${value}&location=${coordinates.lat},${coordinates.lng}&radius=500`)
}

export const getPlaceInfo = (place_id: string) => {
    return axios.get(`${API_DOMAIN}/google/maps/place/details/json?place_id=${place_id}`)
}