import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";
import { User } from "src/users/entities/user.entity";

@Entity({name:"job_accesses"})
export class JobAccess{
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number
    
    @ManyToOne(() => User,user => user.id)
    user_id:number

    @ManyToOne(() => Job,job => job.id)
    job_id:number

    @Column({type:"varchar",length:128})
    created_by:string

    @Column({type:"varchar",length:128})
    updated_by:string

    @Column({type:"timestamp", default: () => "current_timestamp()"})
    created_at:Date

    @Column({type:"timestamp", default: () => "current_timestamp()"})
    updated_at:Date
    
    @Column({type:"timestamp", default: () => "current_timestamp()"})
    deleted_at:Date
}