import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Planet } from '../models/planetsModel';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'postgres',
    synchronize: true,
    logging: false,
    entities: [Planet],
    migrations: [],
    subscribers: [],
});
