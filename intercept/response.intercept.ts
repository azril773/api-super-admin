import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { Observable, map } from "rxjs";

export class ResponseIntercept implements NestInterceptor{
    constructor(private readonly reflector:Reflector){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(map(value => {
            // const res = context.switchToHttp().getResponse<Response>()
            // const req = context.switchToHttp().getRequest<Request>()
            const msg = this.reflector.get("msg",context.getHandler())
            // res.header("authorization",req.headers['authorization'])
            console.log(value)
            return {
                message:msg ?? null,
                data:value
            }
        }))
    }
}