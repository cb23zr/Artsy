import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Collection } from 'src/app/shared/models/Collection';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-img-collections',
  templateUrl: './img-collections.component.html',
  styleUrls: ['./img-collections.component.scss']
})
export class ImgCollectionsComponent {
  newCollection: boolean =false;
  username!: string;
  userId!: string;
  collections: Array<Collection> = [];

  collectionForm = this.fb.group({
    title: ['', [Validators.required]],
    date: [''],
  })

  constructor(private fb: FormBuilder, private router: Router,
    private userService: UserService, private collectionService: CollectionService
  ){}

  ngOnInit(){
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.userService.getByIdObservable(user.uid).subscribe(data =>{
        if(data){
          this.username = data.username;
          this.userId = data.id;
          console.log(this.userId);

          if(this.username !== undefined){
            this.collectionService.getCollection(this.username).subscribe(collections =>{
              this.collections = collections;
            });
          }
        }
    })
    
    
  }

  newClicked(){
    this.newCollection = true;
  }

  newImgCollection(){
    if(this.collectionForm.valid){
      const titleOfColl = this.collectionForm.get('title')?.value;
      if(titleOfColl !== undefined && titleOfColl !== null){
        const coll : Collection = {
          id: this.generateId(),
          username: this.username,
          title: titleOfColl,
          date: new Date(),
          images: [],
          imgCount: 0,
        }
        this.collectionService.create(coll,this.userId);
        this.newCollection= false;
      }
  }else{
    console.error("Hibás űrlap!");
  }   
    
  }

  navigateTo(title:string){
    this.router.navigate(['/display', title]);

  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 20);
  }

}
