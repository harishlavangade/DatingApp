import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { parse } from 'path';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';

const httpOptions = {
  headers: new HttpHeaders({
   
    Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJyYW0iLCJuYmYiOjE2MjcxMzAyNzAsImV4cCI6MTYyNzczNTA3MCwiaWF0IjoxNjI3MTMwMjcwfQ.vCJj0hpRjnCubycIoNwwdt0or_7Lf61AFe6R5cfsEpG3q3yf97QtDOiqrePeA0EkWXfW3xW2P84A6O1zOzP1uQ'
  })
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members:Member[] =[];


  constructor(private http:HttpClient) { }

 
  getMembers(){
    //return this.http.get<Member[]>(this.baseUrl+'users',httpOptions);
    if(this.members.length > 0 ) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl+'users',httpOptions).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  } 

  getMember(username: string){
    const member = this.members.find(x=>x.username ===username);
    if(member !== undefined ) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username,httpOptions);
   // return this.http.get<Member>(this.baseUrl+'users/'+ username);
  }

  updateMember(member:Member){

    return this.http.put(this.baseUrl+'users',member,httpOptions).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members= this.members;
      })
    );
  }
}

