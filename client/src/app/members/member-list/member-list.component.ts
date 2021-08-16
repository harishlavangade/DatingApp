import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/Member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
 // members$!: Observable<Member[]>;
 members:Member[]=[];
 pagination:Pagination | undefined;
 pageNumber =1;
 pageSize=2;

  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
    //console.log('MemberList');
    //this.members$ = this.memberService.getMembers(); 
    //console.log(this.members$);
    //loadMembers();

    this.loadMembers();
  }

loadMembers()
{
  this.memberService.getMembers(this.pageNumber,this.pageSize).subscribe(response =>{
    this.members = response.result ||[];
    this.pagination = response.pagination;
  })
}

pageChanged(event:any)
{
  this.pageNumber = event.page;
  this.loadMembers();
}

  // loadMembers(){
  //   this.memberService.getMembers().subscribe(member =>{
  //     this.members =member
  //   })
  //}

}
