import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Menu } from "./menu.entity";

@Entity({name:"submenus"})
export class SubMenu{
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @ManyToOne(() => Menu,(menu) => menu.id)
    @JoinColumn({name:"menuIdId"})
    menu_id:number

    @Column({nullable:false})
    menuIdId:number

    @Column({type:"varchar",length:128})
    name:string

    @Column({type:"varchar",length:128})
    url:string

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