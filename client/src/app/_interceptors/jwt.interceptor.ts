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

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   let currentUser!: User;
   this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user); 
   //console.log(currentUser);
   if(currentUser){
     request = request.clone({
       setHeaders:{
         Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJyYW0iLCJuYmYiOjE2MjcxMzAyNzAsImV4cCI6MTYyNzczNTA3MCwiaWF0IjoxNjI3MTMwMjcwfQ.vCJj0hpRjnCubycIoNwwdt0or_7Lf61AFe6R5cfsEpG3q3yf97QtDOiqrePeA0EkWXfW3xW2P84A6O1zOzP1uQ'
        // Authorization: `Bearer ${currentUser.token}`
       }
     })
   }
   request =request.clone({
     setHeaders:{
       Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJyYW0iLCJuYmYiOjE2MjcxMzAyNzAsImV4cCI6MTYyNzczNTA3MCwiaWF0IjoxNjI3MTMwMjcwfQ.vCJj0hpRjnCubycIoNwwdt0or_7Lf61AFe6R5cfsEpG3q3yf97QtDOiqrePeA0EkWXfW3xW2P84A6O1zOzP1uQ`
     }
   })
    return next.handle(request);
  }
}
