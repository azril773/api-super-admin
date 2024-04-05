import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"menus"})
export class Menu {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @Column({type:"varchar",length:128})
    name:string
    
    @Column({type:"varchar",length:255})
    icon:string

    @Column({type:"varchar",length:128})
    url:string

    @Column({type:"varchar",length:128})
    type:string

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
