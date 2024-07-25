import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Planet {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column({ type: 'bigint', nullable: true })
    population!: number | null;

    @Column('text', { array: true })
    terrains!: string[];

    @Column('text', { array: true })
    climates!: string[];
}
