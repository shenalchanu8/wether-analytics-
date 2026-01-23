const clamp01 = (x) => Math.max(0, Math.min(1,x));
const clamp100 = (x) => Math.max(0, Math.min(100,x));

function bellScore (value, ideal, tolerance) {
    const d = Math.abs(value - ideal);
    return clamp01 (1 - d / tolerance);
}
export function computeComfortIndex (raw)  {
    const tempC = raw?.main?.temp;
    const humidity = raw?.main?.humidity;
    const wind = raw?.wind?.speed;
    const clouds = raw?.clouds?.all;

    if ([tempC, humidity, wind, clouds].some((v) => typeof v !== "number")) {
    return { score: null };
  }

    const tempScore = bellScore (tempC, 22, 14); // ideal 22C +/- 8C
    const humidityScore = bellScore (humidity, 45, 35);
    const windScore = bellScore (wind, 3, 6);
    const cloudsScore = bellScore (clouds, 20, 60);

    const totalScore = tempScore * 0.4 + humidityScore * 0.25 + windScore * 0.2 + cloudsScore * 0.10;;
    return { score: clamp100 (Math.round (totalScore * 100)) };
}