import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { parse } from 'path';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';

const httpOptions = {
  headers: new HttpHeaders({
   
    Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJiYWtlciIsIm5iZiI6MTYyODQxOTQ3MiwiZXhwIjoxNjI5MDI0MjcyLCJpYXQiOjE2Mjg0MTk0NzJ9.NBtQ3GKmk8v28WmHtOxdKo3jNqkCDcfnsB6eKGjJrBvgsGHcf5zT1u3xe7dEFZp5M4UGEhc0SSiv1KLuNCw6Fw`
  })
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
token:any;
members:Member[] =[];


  constructor(private http:HttpClient) { }

 
  getMembers(){
    //console.log(httpOptions);
   // return this.http.get<Member[]>(this.baseUrl+'users',httpOptions);
   // if(this.members.length > 0 ) return of(this.members);
   //console.log('d');
   //console.log('getMember');
    return this.http.get<Member[]>(this.baseUrl+'users',httpOptions).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  } 

  getMember(username: string){
    const member = this.members.find(x=>x.username ===username);
    
    //console.log(member);
    if(member !== undefined ) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username,httpOptions);
   // return this.http.get<Member>(this.baseUrl+'users/'+ username);
  }

  updateMember(member:Member){
    //console.log(member);
    return this.http.put(this.baseUrl+'users',member,httpOptions).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        //console.log(index);
        this.members= this.members;
      })
    );
  }
  setMainPhoto(photoId:number){
    return this.http.put(this.baseUrl+'users/set-main-photo/' + photoId,{});
  }

  deletePhoto(photoId:number){
    return this.http.delete(this.baseUrl +'users/delete-photo/' +photoId);
  }

}

