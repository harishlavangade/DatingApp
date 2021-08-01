import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   let currentUser!: User;
   let tempToken:any;
   this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{ 
    //console.log(user.token); 
    tempToken = user.token;
    //console.log(tempToken);
    currentUser = user}); 
   //console.log(currentUser.token);
   if(currentUser){
     request = request.clone({
       setHeaders:{
         //Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJiYWtlciIsIm5iZiI6MTYyNzgxMzA5NCwiZXhwIjoxNjI4NDE3ODk0LCJpYXQiOjE2Mjc4MTMwOTR9.7_lXjUw61vbnGDsoWPgL_5sGFcviQJ4Dfc125vJZTxgCtia80aRFcQ9kP32YMJdLdcG0GAAEwm5Ts-x3C6fn9w'
         Authorization: `Bearer ${tempToken}`
       }
     })
   }
   request =request.clone({
     setHeaders:{
       Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJiYWtlciIsIm5iZiI6MTYyNzgxMzA5NCwiZXhwIjoxNjI4NDE3ODk0LCJpYXQiOjE2Mjc4MTMwOTR9.7_lXjUw61vbnGDsoWPgL_5sGFcviQJ4Dfc125vJZTxgCtia80aRFcQ9kP32YMJdLdcG0GAAEwm5Ts-x3C6fn9w`
       //Authorization: `Bearer ${tempToken}`
     }
   })
    return next.handle(request);
  }
}
