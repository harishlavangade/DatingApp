import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'members',component:MemberListComponent},
  {path:'members/:id',component:MemberDetailComponent},
  {path:'lists',component:ListsComponent},
  {path:'Messages',component:Message},
  {path:'**',component:HomeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
