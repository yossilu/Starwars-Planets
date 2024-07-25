import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import planetRoutes from './routes/planetRoutes';
import { AppDataSource } from './db/postgres';
import { getStarwarsPlanets } from './controllers/planetController';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/planets', planetRoutes);

const initializeServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Connected to PostgreSQL with TypeORM');

        await getStarwarsPlanets({} as any, {} as any, () => {});
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    } catch (err) {
        console.error('Failed to initialize the server', err);
        process.exit(1);
    }
};

initializeServer();
