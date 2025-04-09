// TODO: Define a City class with name and id properties
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../db/db.json');

class City {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = uuidv4();
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private async read(): Promise<string> {
    return await fs.readFile(DB_PATH, {
      flag: 'a+', // Create file if not exists
      encoding: 'utf8',
    });
  }

  private async write(cities: City[]): Promise<void> {
    return await fs.writeFile(DB_PATH, JSON.stringify(cities, null, '\t'));
  }

  async getCities(): Promise<City[]> {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  async addCity(city: string): Promise<City> {
    if (!city) throw new Error('City cannot be blank');

    const newCity: City = { name: city, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name.toLowerCase() === city.toLowerCase())) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities).then(() => newCity));
  }

  async removeCity(id: string): Promise<void> {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}


export default new HistoryService();
