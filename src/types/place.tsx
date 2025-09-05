export interface CurrentLocation {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  place_id?: string;
  name?: string;
  geometry?: google.maps.places.PlaceGeometry;
  vicinity?: string;
  photos?: google.maps.places.PlacePhoto[];
  rating?: number;
  types?: string[];
}
