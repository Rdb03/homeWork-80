export interface Category {
    id: string,
    nameCategory: string,
    description: string | null,
}

export interface CategoryWithOutID {
    nameCategory: string,
    description: string | null,
}

export interface Place {
    id: string,
    namePlace: string,
    description: string | null,
}

export interface PlacesWithOutID {
    namePlace: string,
    description: string | null,
}

export interface Items {
    id: string,
    idCategory: string,
    idPlaces: string,
    nameItems: string,
    description: string | null,
    image: string | null,
}

export interface ItemsWithOutID {
    idCategory: string,
    idPlaces: string,
    nameItems: string,
    description: string | null,
    image: string | null,
}

