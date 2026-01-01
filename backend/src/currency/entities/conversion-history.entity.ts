import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ConversionHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sourceCurrency: string;

    @Column()
    targetCurrency: string;

    @Column('decimal')
    amount: number;

    @Column('decimal')
    convertedAmount: number;

    @Column('decimal')
    exchangeRate: number;

    @CreateDateColumn()
    date: Date;
}
