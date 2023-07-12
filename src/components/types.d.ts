interface Country {
    [key: string]: number;
}

interface FilterItems {
    id: number,
    title: string,
    checked: boolean
}

interface WeatherData {
    idCountry: number,
    name: string,
    id: number,
    countryName: string,
    location: {
        latitude: number,
        longitude: number,
    },
    current_weather: {
        temperature: number,
        windspeed: number,
        winddirection: number,
        weathercode: number,
        is_day: number,
        time: string,
    },
    min: number,
    max: number,
    avg: number[],
}

interface FilterByCountry {
    id: number,
    title: string
    checked: boolean
}

interface NumberFilter {
    min: number,
    max: number,
    type: string
}

export {
    Country, FilterItems, WeatherData, FilterByCountry, NumberFilter
};