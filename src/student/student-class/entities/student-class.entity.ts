import { Periode } from "src/periode/entities/periode.entity";
import { Class } from "src/student/class/entities/class.entity";
import { MasterClass } from "src/student/master-class/entities/master-class.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class StudentClass {
    @PrimaryGeneratedColumn({type:"int"})
    id:number

    @ManyToOne(() => Class,classes => classes.id)
    @JoinColumn({name:"classIdId"})
    class_id:number

    @ManyToOne(() => MasterClass,masterClass => masterClass.id)
    @JoinColumn({name:"masterClassIdId"})
    masterClass_id:number

    @ManyToOne(() => Periode,periode => periode.id)
    @JoinColumn({name:"periodeIdId"})
    periode_id:number

    @Column({type:"int"})
    classIdId:number

    @Column({type:"int"})
    masterClassIdId:number

    @Column({type:"int"})
    periodeIdId:number

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
