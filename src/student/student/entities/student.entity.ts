import { StudentClass } from "src/student/student-class/entities/student-class.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"students"})
export class Student {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @OneToOne(() => User,user => user.id)
    @JoinColumn({name:"userIdId"})
    user_id:number

    @ManyToOne(() => StudentClass,studentClass => studentClass.id)
    @JoinColumn({name:"studentClassIdId"})
    studentClass_id:number

    @Column({type:"int"})
    userIdId:number

    @Column({type:"int"})
    studentClassIdId:number

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
