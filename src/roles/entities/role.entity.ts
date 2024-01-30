import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"roles"})
export class Role {
    @PrimaryGeneratedColumn({type:"bigint"})
    id:number

    @Column({type:"varchar",length:128})
    code:string
    
    @Column({type:"varchar",length:128})
    name:string

    @OneToMany(() => User,user => user.id)
    user_id:number

    @Column({type:"varchar",length:128})
    description:string

    @Column({type:"varchar",length:128})
    dashboard_url:string

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
