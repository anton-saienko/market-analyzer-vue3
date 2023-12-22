export type GoogleMapEvent = {
    latLng: {
        lat: Function,
        lng: Function
    }
}

export type Place = {
    place_id: string,
    structured_formatting: {
        main_text: string,
        secondary_text: string
    },
    coordinates: {
        lat: number,
        lng: number
    },
    website: string
}

export type Coordinates = {
    lat: number,
    lng: number
}

export type BusinessObject = {
    name: string,
    coordinates: Coordinates,
    website: string
}