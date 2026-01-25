# Weather Analytics Application
This repository contains a secure, full-stack weather analytics application developed for the Fidenz Technologies assignment. The application retrieves real-time weather data, calculates a custom Comfort Index, and provides an authenticated dashboard for viewing city rankings.
# 1. Setup Instructions
Prerequisites
  * Node.js: v18 or higher.
  * OpenWeatherMap API Key: Required for fetching real-time weather data.
  * Auth0 Account: For secure authentication and Multi-Factor Authentication (MFA).
# Backend Setup
Navigate to the backend directory.

* Install dependencies: npm install.
* Create a .env file with the following variables:
  
  ● PORT: 5000
  ● OPENWEATHER_API_KEY: Your registered API key.
  ● CACHE_TTL_MS: 300000 (5 minutes).
  ● AUTH0_ISSUER_BASE_URL: Your Auth0 domain.
  ● AUTH0_AUDIENCE: Your Auth0 API Identifier.
  ● Start the server: npm start.

# Frontend Setup
Navigate to the frontend directory.

 * Install dependencies: npm install.
 * Create a .env file with your Auth0 credentials:

  ●  VITE_AUTH0_DOMAIN: Your Auth0 domain.
  ●  VITE_AUTH0_CLIENT_ID: Your Auth0 client ID.
  ●  VITE_AUTH0_AUDIENCE: Your Auth0 audience.
  ●  Start the development server: npm run dev.

# 2. Comfort Index FormulaThe 
Comfort Index Score is a custom metric designed to represent weather quality on a scale of 0 to 100. It uses a "Bell Curve" scoring method to determine how close current conditions are to an "Ideal" state.

 # The Formula:
    Total Score = (TempScore \times 0.45) + (HumidityScore \times 0.25) + (WindScore \times 0.20) + (CloudScore \times 0.10)

   * The scoring is based on the following ideal parameters:Temperature: Ideal is 22°C.Humidity: Ideal is 45%.Wind Speed: Ideal is 3 m/s.Cloudiness: Ideal is 20%.

# 3. Reasoning Behind Variable Weights
  The weights reflect the impact of each environmental factor on human physical comfort:
  
  ● Temperature (45%): Weighted most heavily as it is the primary driver of comfort. Deviations from the 20-24°C range impact the score significantly.
  ● Humidity (25%): A critical secondary factor as high humidity affects the body's ability to cool itself.
  ● Wind Speed (20%): Moderate wind is refreshing, but extreme wind or completely stagnant air reduces comfort.
  ● Cloudiness (10%): Primarily a psychological and aesthetic factor, clear to partly cloudy skies are preferred.

# 4. Trade-offs Considered

  ● Bell Curve vs. Linear Scaling: A bell curve was chosen because weather comfort is not linear. Both extreme cold and extreme heat are uncomfortable, which this formula penalizes equally.
  ● In-Memory Caching: I utilized an in-memory TTLCache to meet the 5-minute requirement without adding the complexity of an external database like Redis.
  ● Server-Side Computation: The backend computes the score rather than the frontend to ensure data integrity and consistent rankings across all devices.

# 5. Cache Design Explanation

The application implements a Two-Tier Layered Cache:

  ● Raw Weather Cache: Stores the raw OpenWeatherMap API responses for 5 minutes (300,000ms) to prevent redundant API calls and rate-limiting.
  ● Processed Output Cache: Caches the final calculated and ranked city list.
  ● Debug Endpoint: A dedicated route (/api/debug/cache) provides visibility into "HIT" or "MISS" status

# 6. Known Limitations

  ● Static City List: The application currently processes a fixed set of cities provided in cities.json.
  ● Volatile Cache: Since the cache is in-memory, data is cleared whenever the server restarts.
  ● MFA Restrictions: Access is limited to whitelisted users, such as the test account: careers@fidenz.com.

# Frontend UI

<img width="1865" height="904" alt="image" src="https://github.com/user-attachments/assets/82f9290c-4d20-42de-b2b1-34b4ef8c8602" />
<img width="1454" height="910" alt="image" src="https://github.com/user-attachments/assets/01ea7cd1-302f-4b1f-97a6-19f4cf8dddea" />

