import { HttpClient } from '@angular/common/http';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl=environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient) { }

  login(model:any)
  {
    //return this.http.post(this.baseUrl+'account/login',model);
    return this.http.post(this.baseUrl+'account/login',model).pipe(
      map(( response: any)  => {
        const user = response;
        if(user)
        {
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }        
      })
    )
  }

register(model:any){
return this.http.post(this.baseUrl +'account/register',model).pipe(
  map((user: any) => {
    if(user)
    {
      localStorage.setItem('user',JSON.stringify(user));
      this.currentUserSource.next(user);
    }
    return user;
  })
)
}
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  // below is simple map function
  // login(model:any)
  // {
  //   //return this.http.post(this.baseUrl+'account/login',model);
  //   return this.http.post(this.baseUrl+'account/login',model).pipe(
  //     map((response: any) =>{
  //       const user = response;
  //       if(user)
  //       {
  //         localStorage.setItem('user',JSON.stringify(user));
  //       }
  //     } )
  //   )
  // }
  logout(){
    console.log('logout');
    localStorage.removeItem('user');
    //this.currentUserSource.next(null);
  }
}
