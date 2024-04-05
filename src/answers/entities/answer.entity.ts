import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"answers"})
export class Answer {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @Column({type:"enum",enum:["pg","essay"],nullable:false})
    type:string

    @ManyToOne(() => User,user => user.id)
    @JoinColumn({name:"userIdId"})
    user_id:number

    @Column({type:"int",nullable:false})
    taskIdId:number

    @Column({type:"int",nullable:false})
    userIdId:number

    @Column({type:"varchar",length:255})
    answer:string

    @Column({type:"int"})
    score:number

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
