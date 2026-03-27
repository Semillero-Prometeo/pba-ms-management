export interface CountryResponse {
    name: string;
    phonecode: string;
    isoCode: string;
    flag: string;
    currency: string;
    latitude: string;
    longitude: string;
    timezones?: Timezones[];
    states: StateResponse[];
  }
  
  export interface StateResponse {
    name: string;
    isoCode: string;
    countryCode: string;
    latitude?: string | null;
    longitude?: string | null;
    cities: CityResponse[];
  }
  
  export interface CityResponse {
    name: string;
    countryCode: string;
    stateCode: string;
    latitude?: string | null;
    longitude?: string | null;
  }
  
  export interface Timezones {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }
  