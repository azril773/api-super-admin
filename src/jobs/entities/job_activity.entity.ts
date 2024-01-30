import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Job } from "./job.entity";
import { SubMenu } from "src/menus/entities/submenu.entity";

@Entity({name:"job_activities"})
export class JobActivity{
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @ManyToOne(() => Job,job => job.id)
    job_id:number

    @ManyToOne(() => SubMenu,submenu => submenu.id)
    submenu_id:number

    @Column({type:"varchar",length:128})
    created_by:string

    @Column({type:"varchar",length:128})
    updated_by:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date
    
    @DeleteDateColumn()
    deleted_at:Date
}