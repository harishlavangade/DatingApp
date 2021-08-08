import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/Member';
import { MembersService } from 'src/app/_services/members.service';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member!: Member;
  galleryOptions?: NgxGalleryOptions[];
  galleryImages?: NgxGalleryImage[];
  userName?:string;


  constructor(private memberService:MembersService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions =[{
      width:'500px',
      height:'500px',
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview:false
    }]
    
  }

  loadMember(){
   //console.log('Load memeber');
    console.log(JSON.stringify(this.route.snapshot.paramMap.get('username')));
    this.userName = JSON.stringify(this.route.snapshot.paramMap.get('username'));
    //this.memberService.getMember(JSON.stringify(this.route.snapshot.paramMap.get('username'))).subscribe(member =>{
      this.memberService.getMember('garcia').subscribe(member =>{
      this.member= member;
      this.galleryImages = this.getImages();
    })
  }
  getImages(): NgxGalleryImage[]{
    const imageUrls=[];
    for(const photo of this.member?.photos){
      imageUrls?.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      })
    }
    return imageUrls;
  }
}
