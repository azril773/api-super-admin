import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";

export class ResponseIntercept implements NestInterceptor{
    constructor(private readonly reflector:Reflector){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(map(value => {
            const msg = this.reflector.get("msg",context.getHandler())
            return {
                message:msg,
                data:value ?? null
            }
        }))
    }
}