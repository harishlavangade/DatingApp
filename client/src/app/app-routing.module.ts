import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsaveChanges2Guard } from './_guards/prevent-unsave-changes2.guard';

const routes: Routes = [
  {path:'',component:HomeComponent},
{
  path: '',
  runGuardsAndResolvers:'always',
  canActivate:[AuthGuard],
  children:[
    {path:'members',component:MemberListComponent , canActivate:[AuthGuard]},
    {path:'members/:username',component:MemberDetailComponent},
    {path:'member/edit',component:MemberEditComponent , canDeactivate:[PreventUnsaveChanges2Guard]},
    {path:'lists',component:ListsComponent},
    {path:'message',component:MessagesComponent},
  ]
}, 
{path: 'error',component:TestErrorsComponent},
{path: 'not-found',component:NotFoundComponent},
{path:'**',component:HomeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
