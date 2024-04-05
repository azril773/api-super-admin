import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { decryptJwt } from "functions/decrypt-jwt";
import { generateJwt } from "functions/generate-jwt";
import { Observable, generate } from "rxjs";
import { Job } from "src/jobs/entities/job.entity";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource } from "typeorm";

@Injectable()
export class JwtAuth implements CanActivate {
    constructor(private readonly ds: DataSource, private readonly refelector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp()
        const auth = this.refelector.get(process.env.KEY_METADATA_ROLE, context.getHandler())
        const req = http.getRequest<Request>()
        const res = http.getResponse<Response>()
        // cek jika jwt tidak ada
        const jwt = req.headers["x-authorization"] ?? null
        const jwtRefresh = req.headers["authorization"] ?? null
        if(!jwtRefresh) throw new UnauthorizedException("Access denied")
        if(!jwt) throw new UnauthorizedException("Jwt not foun")     
        // decrypt jwt
        let decrypt = decryptJwt(jwt)
        // cek jika decrypt terdapat error
        if (Object.keys(decrypt).includes("expiredAt")) {

            // jika token expired
            if (decrypt.message == "jwt expired") {
                const refresh = req.headers["authorization"] ?? null
                if (!refresh) throw new UnauthorizedException("You must login")
                const decRefresh = decryptJwt(refresh)
                if (!Object.keys(decRefresh).includes("name") || Object.keys(decRefresh).includes("message")) throw new UnauthorizedException("Access denied (response)")

                // generate token baru jika semuanya sesuai
                const newAccess = generateJwt({ name: decRefresh.name,role_id:decRefresh.role_id }, +process.env.EXPIRED_ACCESS_JWT)
                req.headers["x-authorization"] = newAccess
                res.cookie("x-authorization",newAccess,{
                    path:'/'
                })
                decrypt = decryptJwt(newAccess)
            }else {
            // jika error bukan expired
            throw new UnauthorizedException(decrypt)
        }
        } 

        // mengambil data sesuai dijwt
        const data = await this.ds.query('SELECT * FROM users WHERE name="' + decrypt.name + '"')
        // req.headers["x-authorization"] = decrypt
        // cek jika usernya tidak ada
        if (data.length <= 0) throw new UnauthorizedException("Users not found")
        let id
    
        // mengumpulkan id role jika user terdapat lebih dari 1
        if (data.length > 1) {
            let arrRoleId = []
            for (const i of data) {
                arrRoleId.push(i.roleIdId)
            }
            id = arrRoleId.join("','")
        } else {
            id = data[0].roleIdId

        }

        // mengambil hanya name dari table role sesuai dengan id user dan cek jika role itu ada
        const role = await this.ds.query(`SELECT name FROM roles WHERE id IN('${id}')`)
        if (role.length <= 0) throw new UnauthorizedException("Access denied")
        
        // cek jika role sesuait dengan handler
        console.log(role,auth)
        for (const i of role) {
            if (auth.includes(i.name.toLowerCase())) return true
        }
        if(auth.length <= 0) return true
        throw new UnauthorizedException("Access denied")

    }
}