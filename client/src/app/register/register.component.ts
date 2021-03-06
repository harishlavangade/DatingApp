import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 // @Input() userFormHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
 model: any = {};
 registerForm!:FormGroup;
 validationErrors:string[]=[];


  constructor(private accountService:AccountService,private toastr:ToastrService,
    private fb:FormBuilder,private router:Router ) { }

  ngOnInit(): void {
    this.initializedForm();
  }

  initializedForm(){
    this.registerForm = this.fb.group({
      Gender:['male'],
      Username:['',Validators.required],
      KnowAs:['',Validators.required],
      DateOfBirth:['',Validators.required],
      City:['',Validators.required],
      Country:['',Validators.required],
      Password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      ConfirmPassword: ['',[Validators.required]]
      //Above is for the form builder pattern
    // this.registerForm = new FormGroup({
    //   username:new FormControl('',Validators.required),
    //   password:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('',[Validators.required])
    })

    //this.registerForm.controls.password.valueChanges.subscribe(() =>{
     // this.registerForm.controls.confirmPassword.updateValueAndValidity();
   // })
  }

//  matchValues(matchTo:string):ValidatorFn {

    // return (control: AbstractControl) =>{
    //   return   control?.value === control?.parent?.controls[matchTo].value  ? null: {isMatching:true}
    // }
  //}

  register(){
    console.log(this.registerForm?.value);
    console.log(this.model);  
    this.accountService.register(this.model).subscribe(response =>{
      console.log(response);
      this.router.navigateByUrl('/members');
      //this.cancel();
    },error =>{
      this.validationErrors = error;
      console.log(error);
      //this.toastr.error(error.error)
    })
   
  }
  cancel(){
    console.log('Cancelled');
    this.cancelRegister.emit(false);
  }
}
