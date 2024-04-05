import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"classes"})
export class Class {
    @PrimaryGeneratedColumn({type:"int"})
    id:number

    @Column({type:"varchar" , length:180})
    class:string

    @Column({type:"varchar",length:180})
    created_by:string

    @Column({type:"varchar",length:180})
    updated_by:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn({})
    updated_at:Date
    
    @DeleteDateColumn()
    deleted_at:Date
}
