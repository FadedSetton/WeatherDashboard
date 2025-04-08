import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
  // TODO: save city to search history
  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    const savedCity = await HistoryService.addCity(city);

  return res.json({
      city: savedCity,
      forecast: weatherData.forecast,
    });
  } catch (error) {
    console.error(error)
  return  res.status(500).json({ error: 'Failed to retrieve weather data' });
  }

});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    const updatedHistory = await HistoryService.getCities();
    res.json(updatedHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete city from history.' });
  }
});

export default router;
