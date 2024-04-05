import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"periodes"})
export class Periode {
    @PrimaryGeneratedColumn({type:"int"})
    id:number

    @Column({type:"varchar",length:180})
    periode:string

    @Column({type:"varchar",length:128})
    created_by:string

    @Column({type:"varchar",length:128})
    updated_by:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn({})
    updated_at:Date
    
    @DeleteDateColumn()
    deleted_at:Date
}
