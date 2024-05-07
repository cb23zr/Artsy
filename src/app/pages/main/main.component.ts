import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Post} from "../../shared/models/Post";
import {Router} from "@angular/router";
import { UploadService } from 'src/app/shared/services/upload.service';
import { DocumentData, Firestore, collection, collectionSnapshots, doc, getCountFromServer, getDoc, getDocs, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  [x: string]: any;
  unsub: any;

  imageList!: any[];
  rowIndexArray!: any[];

  posts: Array<any> = [];
  postForm = this.createForm({
    uname: '',
    tweet:'',
    date:new Date(),
  });



  constructor(private fb: FormBuilder, private router: Router, private service: UploadService) {
  }

  async ngOnInit(){

    try {
      const documents = await this.service.getDocuments();
      this.imageList = [];
      documents.forEach((doc)=>{
        const url= doc.get("imageurl"); 
        if(url){
          this.imageList.push(url);
        }
        console.log(url);
      })
      } catch (error) {
      console.error('Error fetching Firestore documents:', error);
    }
    

  }

  createForm(model: Post){
    let formGroup = this.fb.group(model);
    formGroup.get('uname')?.addValidators([Validators.required]);
    formGroup.get('tweet')?.addValidators([Validators.required, Validators.minLength(5) ]);

    return formGroup;
  }

  addPost(){
    if(this.postForm.valid) {
      if (this.postForm.get('uname') && this.postForm.get('tweet')) {
        this.postForm.get('date')?.setValue(new Date);
        this.posts.push({...this.postForm.value});
        this.router.navigateByUrl('/main/success/' + this.postForm.get('uname')?.value);
      }
    }
  }
}
