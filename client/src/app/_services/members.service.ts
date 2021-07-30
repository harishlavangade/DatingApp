import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { parse } from 'path';
import { Observable } from 'rxjs';
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
parsedJson:any; // =   JSON.parse(localStorage.getItem('user')).token;;  
  constructor(private http:HttpClient) { }

  // getMembers():Observable<Member[]> {
  //   return this.http.get<Member[]>(this.baseUrl+'users',httpOptions);
  // }
// Return the Member type array in specify in request http
  getMembers(){
    //return this.http.get<Member[]>(this.baseUrl+'users',httpOptions);
    return this.http.get<Member[]>(this.baseUrl+'users');
  }

  getMember(username: string){
    return this.http.get<Member>(this.baseUrl+'users/'+username,httpOptions);
   // return this.http.get<Member>(this.baseUrl+'users/'+ username);
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl+'users',member);
  }
}

