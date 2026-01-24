const clamp01 = (x) => Math.max(0, Math.min(1, x));
const clamp100 = (x) => Math.max(0, Math.min(100, x));

function bellScore(value, ideal, tolerance) {
    const d = Math.abs(value - ideal);
    return clamp01(1 - d / tolerance);
}

export function computeComfortIndex(raw) {
    const tempC = raw?.main?.temp;
    const humidity = raw?.main?.humidity;
    const wind = raw?.wind?.speed;
    const clouds = raw?.clouds?.all;

    if ([tempC, humidity, wind, clouds].some((v) => typeof v !== "number")) {
        return { score: null };
    }

    
    const tempScore = bellScore(tempC, 22, 12);
    const humidityScore = bellScore(humidity, 45, 30);
    const windScore = bellScore(wind, 3, 7);
    const cloudsScore = bellScore(clouds, 20, 50);

    const totalScore = (tempScore * 0.45) + (humidityScore * 0.25) + (windScore * 0.20) + (cloudsScore * 0.10);
    
    return { score: clamp100(Math.round(totalScore * 100)) };
}