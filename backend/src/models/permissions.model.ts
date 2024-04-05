import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Role } from "./role.model";
@Entity()
@Unique(['name', 'permission_key'])
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    permission_key: string

    @Column()
    is_active: boolean
    @ManyToMany(() => Role, role => role.permissions, {onDelete: 'CASCADE'})
    @JoinTable({
        name: 'role_permission',
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        joinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    roles: Role[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}