export type GoogleMapEvent = {
    latLng: {
        lat: Function,
        lng: Function
    }
}

export type Coordinates = {
    lat: number,
    lng: number
}

export type Place = {
    place_id: string,
    structured_formatting: {
        main_text: string,
        secondary_text: string
    },
    coordinates: Coordinates,
    website: string
}

export type BusinessObject = {
    name: string,
    coordinates: Coordinates,
    website: string
}