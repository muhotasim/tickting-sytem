import { GridTypes } from "src/utils/custome.datatypes";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class FilterGrid{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    placeholder: string;

    @Column()
    label: string;

    @Column()
    order:number;
    
    @Column()
    for_route: string

    @Column()
    effect_on: string

    @Column()
    condition: string
    
    @Column({type: 'enum',enum: GridTypes, default: GridTypes.string})
    type: GridTypes

    @Column()
    is_active: boolean

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
}