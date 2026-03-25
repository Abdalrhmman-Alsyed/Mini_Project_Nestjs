import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";






export class LoggerInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        console.log("before route handler ");

        return next.handle().pipe(map((dataResponseFromRouteHandler)=>{
            const {password, ...otherData}=dataResponseFromRouteHandler;
            return {...otherData}
        }) );

    }
}