import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"absents"})
export class Absent {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    // @OneToOne(() => User,user => user.id)
    // @JoinColumn({name:"userIdId"})
    // user_id:number

    @Column({type:"int"})
    userIdId:number

    @Column({type:"enum", enum:["tidak hadir","hadir"]})
    status:string

    @Column({type:"varchar", length:255})
    keterangan:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

    @DeleteDateColumn()
    deleted_at:Date
}
