import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
 model: any = {}
 loggedIn: boolean =false;
 currentUser$!: Observable<User>;

  constructor(public accountService:AccountService,private router: Router,private toastr:ToastrService ) { }

  ngOnInit() {
  }

  login()
  {
    this.accountService.login(this.model).subscribe(response => {
     //console.log('NavCompentTS');
      //console.log(response);
     
      this.router.navigateByUrl('/members');
    });
    this.loggedIn=true;
    //console.log(this.model);
  }

  getCurrentUser(){
    this.accountService.currentUser$.subscribe(user => {
      this.loggedIn = !!user;
    },error =>
    {
      console.log(error);
    })
  }

  logout()
  {
    this.loggedIn=false;
    //console.log('logout');
    localStorage.removeItem('user');
    this.router.navigateByUrl('./');

  }

}
