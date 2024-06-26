import { Mapel } from "src/mapel/entity/mapel.entity";
import { StudentClass } from "src/student/student-class/entities/student-class.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"tasks"})
export class Task {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number 

    @Column({type:"varchar", length:128,nullable:false})
    title:string

    @Column({type:"varchar", length:255,nullable:false})
    task:string

    @Column({type:"enum",enum:["essay"]})
    type:string

    @Column({type:"varchar", length:100,nullable:true})
    kode:string 

    @OneToOne(() => StudentClass,studentClass => studentClass.id)
    @JoinColumn({name:"studentClassIdId"})
    studentClass_id:number

    @Column({type:"int"})
    studentClassIdId:number

    @OneToOne(() => Mapel,mapel => mapel.id)
    @JoinColumn({name:"mapelIdId"})
    mapel_id:number

    @Column({type:"int"})
    mapelIdId:number


    @Column({type:"timestamp"})
    deadline:Date

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
