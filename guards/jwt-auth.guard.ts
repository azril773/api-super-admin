import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { decryptJwt } from "functions/decrypt-jwt";
import { Observable } from "rxjs";
import { Job } from "src/jobs/entities/job.entity";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource } from "typeorm";

@Injectable()
export class JwtAuth implements CanActivate{
    constructor(private readonly ds:DataSource,private readonly refelector:Reflector){}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const http = context.switchToHttp()
        const auth = this.refelector.get(process.env.KEY_METADATA_SUPER_ADMIN,context.getHandler())
        const req = http.getRequest<Request>()
        const jwt = req.headers["authorization"] ?? null
        const decrypt = decryptJwt(jwt)
        if(!decrypt) throw new UnauthorizedException("Token expired")
        const data = await this.ds.query('SELECT * FROM users WHERE name="'+decrypt.name+'"')
        if(data.length <= 0) throw new UnauthorizedException("Access denied")
        let arrRoleId = []
        for (const i of data) {
            arrRoleId.push(i.roleIdId)  
        }
        const split = arrRoleId.join("','")
        const role = await this.ds.query(`SELECT name FROM roles WHERE id IN('${split}')`)
        if(role.length <= 0) throw new UnauthorizedException("Access denied")
        for (const i of role) {
            if(i.name == auth) return true
        }
     throw new UnauthorizedException("Access denied")
    
    }
}