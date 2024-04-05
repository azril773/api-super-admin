import { BadGatewayException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { decryptJwt } from "functions/decrypt-jwt";
import { Observable } from "rxjs";
import { Job } from "src/jobs/entities/job.entity";
import { JobAccess } from "src/jobs/entities/job_access.entity";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource, In } from "typeorm";

@Injectable()
export class AuthorJob implements CanActivate{
    constructor(private readonly reflector:Reflector,private readonly ds: DataSource){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp()
        const req = http.getRequest<Request>()

        // cek jwt
        const access = req.headers["authorization"] ?? null
        if(!access) throw new UnauthorizedException("You have not access")
        const decrypt = decryptJwt(access)

        // mengambil data dari handler
        const jobs = this.reflector.get(process.env.KEY_METADATA,context.getHandler())
        const role = this.reflector.get(process.env.KEY_METADATA_ROLE,context.getHandler())

        // mengecek role
        let users
        if(role.length > 0){
            // jika role ada maka akan ambil user dengan role tersebut
            const id_role = await this.ds.getRepository(Role).find({where:{name:In(role)},select:["id"]})
            if(id_role.length <= 0) throw new InternalServerErrorException("Role not found")
            const arrIdRole = id_role.map(e => +e.id)
            users = await this.ds.query("SELECT * FROM users WHERE name=? AND roleIdId IN(?)",[decrypt.name,arrIdRole])
        }else{
            // jika role tidak ada maka hanya akan ambil berdasarkan nama saja
            users = await this.ds.query("SELECT * FROM users WHERE name=?",[decrypt.name])
            
        }
        for (const i of users) {
            if(i.roleIdId == 9) return true
        }
        if(users.length <= 0) throw new UnauthorizedException("You have no access")
        if(!jobs || jobs.length <= 0) return true
        const idJobs = await this.ds.getRepository(Job).find({where:{id:In(jobs)},select:["id"]})
        if(idJobs.length <= 0) throw new InternalServerErrorException("Job not found")
        let arrIdJob = idJobs.map(e => e.id)
        let arrIdUser = users.map(e => e.id)
        console.log(arrIdUser)
        const jobAccess = await this.ds.query("SELECT * FROM job_accesses WHERE userIdId IN(?) AND jobIdId IN(?)",[arrIdUser,arrIdJob])
        if(jobAccess.length <= 0) throw new UnauthorizedException("Access Denied access") 
        // if(user.length <= 0) throw new UnauthorizedException("User not found")
        // const jobAccess = await this.ds.getRepository(JobAccess).findBy({user_id:user[0].id})
        return true
    }
}