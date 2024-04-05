import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class Menu{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string

    @Column({default: 1})
    order:number

    @Column()
    link: string

    @Column()
    is_active: boolean

    @ManyToOne(type => Menu, menu => menu.childrens, { nullable: true })
    @JoinColumn({ name: "parent_menu_id" })
    parent: Menu;
  
    @Column({ nullable: true })
    parent_menu_id: number;

    @OneToMany(type => Menu, menu => menu.parent)
    childrens: Menu[];


    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
}