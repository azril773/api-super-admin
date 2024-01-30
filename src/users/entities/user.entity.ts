import { Role } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"users"})
export class User {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @ManyToOne(() => Role,role => role.id)
    role_id:number

    @Column({type:"varchar",length:128})
    name:string

    @Column({type:"varchar",length:255,nullable:true,default:""})
    picture:string

    @Column({type:"varchar",length:128,nullable:false})
    username:string

    @Column({type:"varchar",length:255,nullable:false})
    password:string

    @Column({type:"enum",enum:["active","deactive"]})
    status:string
    
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
