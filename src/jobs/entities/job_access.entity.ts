import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Job } from "./job.entity";
import { User } from "src/users/entities/user.entity";

@Entity({name:"job_accesses"})
export class JobAccess{
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number
    
    @ManyToOne(() => User,user => user.id)
    @JoinColumn({name:"userIdId"})
    user_id:number
    
    @Column({type:"int"})
    userIdId:number
    
    @ManyToOne(() => Job,job => job.id)
    @JoinColumn({name:"jobIdId"})
    job_id:number
    
    @Column({type:"int"})
    jobIdId:number


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