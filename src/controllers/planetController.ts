import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { AppDataSource } from '../db/postgres';
import { Planet } from '../models/planetsModel';

const baseUrl = 'https://swapi-graphql.netlify.app/.netlify/functions/index';

export const getStarwarsPlanets = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await axios.post(baseUrl, {
            query: `
            query {
              allPlanets {
                planets {
                  name
                  population
                  terrains
                  climates
                }
              }
            }`,
        });

        const starWarsPlanetsResp = response.data.data.allPlanets.planets;

        const planetRepository = AppDataSource.getRepository(Planet);

        for (const planetData of starWarsPlanetsResp) {
            const population = planetData.population === 'unknown' || planetData.population === null
                ? null
                : parseInt(planetData.population as string, 10);

            const planet = new Planet();
            planet.name = planetData.name;
            planet.population = population;
            planet.terrains = planetData.terrains;
            planet.climates = planetData.climates;

            await planetRepository.save(planet);
        }

        if (res) {
            res.status(201).json({ starWarsPlanets: starWarsPlanetsResp });
        } else {
            console.log('Star Wars planets data has been initialized');
        }
    } catch (err) {
        if (res) {
            res.status(404).json({ msg: 'Error loading Data, might be not found.' });
        } else {
            console.error('Error loading Data, might be not found.');
        }
    }
});

export const deleteStarwarsPlanets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const planetRepository = AppDataSource.getRepository(Planet);
    await planetRepository.delete(id);
    res.status(200).json({ message: 'Planet deleted successfully' });
});

export const createStarwarsPlanet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, population, terrains, climates } = req.body as Planet;
    const planetRepository = AppDataSource.getRepository(Planet);

    const planet = new Planet();
    planet.name = name;
    planet.population = population;
    planet.terrains = terrains;
    planet.climates = climates;

    const result = await planetRepository.save(planet);
    res.status(201).json(result);
});

export const updateStarwarsPlanets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, population, terrains, climates } = req.body as Planet;
    const planetRepository = AppDataSource.getRepository(Planet);

    const planet = await planetRepository.findOneBy({ id: parseInt(id) });
    if (!planet) {
        res.status(404).json({ error: 'Planet not found' });
        return;
    }

    planet.name = name;
    planet.population = population;
    planet.terrains = terrains;
    planet.climates = climates;

    const result = await planetRepository.save(planet);
    res.status(200).json(result);
});

export const getStarwarsPlanet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const planetRepository = AppDataSource.getRepository(Planet);

    const planet = await planetRepository.findOneBy({ id: parseInt(id) });
    if (!planet) {
        res.status(404).json({ error: 'Planet not found' });
        return;
    }

    res.status(200).json(planet);
});
