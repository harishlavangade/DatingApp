import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
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

  constructor(private accountService:AccountService ) { }

  ngOnInit() {
  }

  login()
  {
    this.accountService.login(this.model);
    console.log(this.model);
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
  }

}
