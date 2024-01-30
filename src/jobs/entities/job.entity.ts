import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"jobs"})
export class Job {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @Column({type:"varchar",length:128})
    name:string

    @Column({type:'varchar',length:128})
    description:string

    @Column({type:'varchar',length:50})
    icon:string

    @Column({type:'varchar',length:128})
    url:string

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
