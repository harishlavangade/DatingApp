import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

 members:Member[]=[];
 pagination:Pagination | undefined;
 pageNumber =1;
 pageSize=2;
 userParams!:UserParams;
 user!:User;


 genderList = [{value:'male',display:'Male'},{value:'female',display:'Female'}]

  constructor(private memberService:MembersService,private accountService:AccountService) { 
this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
  this.user = user;
  this.userParams = new UserParams(user);
})

  }

  ngOnInit(): void {
    //console.log('MemberList');
    //this.members$ = this.memberService.getMembers(); 
    //console.log(this.members$);
    //loadMembers();

    this.loadMembers();
  }

loadMembers()
{
  this.memberService.getMembers(this.userParams).subscribe(response =>{
    this.members = response.result ||[];
    this.pagination = response.pagination;
  })
}

pageChanged(event:any)
{
  this.userParams.pageNumber = event.page;
  this.loadMembers();
}

 resetFilters()
 {
   this.userParams = new UserParams(this.user);
   this.loadMembers();
 }

}
