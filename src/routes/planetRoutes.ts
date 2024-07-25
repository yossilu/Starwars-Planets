import express from 'express';
import {
    getStarwarsPlanets,
    deleteStarwarsPlanets,
    createStarwarsPlanet,
    updateStarwarsPlanets,
    getStarwarsPlanet,
} from '../controllers/planetController';

const router = express.Router();

router.get('/', getStarwarsPlanets);
router.get('/:id', getStarwarsPlanet);
router.post('/', createStarwarsPlanet);
router.put('/:id', updateStarwarsPlanets);
router.delete('/:id', deleteStarwarsPlanets);

export default router;
