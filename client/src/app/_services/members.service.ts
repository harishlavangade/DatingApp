import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { parse } from 'path';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

const httpOptions = {
  headers: new HttpHeaders({

    Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJnYXJjaWEiLCJuYmYiOjE2Mjg2MDA5NTQsImV4cCI6MTYyOTIwNTc1NCwiaWF0IjoxNjI4NjAwOTU0fQ.YL_Odzltq88GKWMPTVzG0qXM33t2X0wwY26e6bpvK_P7TmviaoMoii4mNLKjPHZW16QHxE1X9rsE_EVzvur2iw`
  })
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  token: any;
  members: Member[] = [];
  memberCache = new Map();
  user!: import("c:/Harish/VisualStudio_Projects/DatingApp/client/src/app/_models/user").User;
  userParams: UserParams |undefined;



  constructor(private http: HttpClient,private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
  })
   }

   getUserParams()
   {
     return this.userParams;
   }
   setUserParams(params:UserParams | undefined)
   {
     this.userParams =params;
   }

   retSetUserParams(){
     this.userParams = new UserParams(this.user);
     return this.userParams;
   }

  getMembers(userParm: UserParams) {

    console.log(Object.values(userParm).join('-'));

    var response = this.memberCache.get(Object.values(userParm).join('-'));

    if(response) 
    {
      return of(response);
    }
     
    let params = this.getPaginationHeader(userParm.pageNumber, userParm.pageSize);

    params = params.append('minAge', userParm.minAge.toString());
    params = params.append('maxAge', userParm.maxAge.toString());
    params = params.append('gender', userParm.gender.toString());
    params = params.append('orderBy', userParm.orderBy.toString());

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
    .pipe(map(response =>{
      this.memberCache.set(Object.values(userParm).join('-'),response);
      return response;
    }))
  }


  getMember(username: string) {
  //console.log(this.memberCache);
  const member = [...this.memberCache.values()]
        .reduce((arr,elem)=> arr.concat(elem.result),[])
        .find((member:Member)=>member.username === username);
  //console.log(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username, httpOptions);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member, httpOptions).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members = this.members;
      })
    );
  }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body || undefined;
        if (response.headers.get('pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination') || '{}');
        }
        return paginatedResult;
      }));
  }

  private getPaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageNumber', pageSize.toString());
    return params;
  }

}

