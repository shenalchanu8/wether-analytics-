import fs from "fs";
import path from "path";

export function loadCities() {
    const filePath = path.resolve("src", "data", "cities.json"  );
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);

    const list = Array.isArray(json.List) ? json.List : [];
    return list
    .map((c) => ({
      CityCode: String(c.CityCode || "").trim(),
      CityName: String(c.CityName || "").trim()
    }))
    .filter((c) => c.CityCode);
}