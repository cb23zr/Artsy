import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Post} from "../../shared/models/Post";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  //postObject: any ={};
  posts: Array<any> = [];
  postForm = this.createForm({
    uname: '',
    tweet:'',
    date:new Date(),
  });

  constructor(private fb: FormBuilder, private router: Router) {
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
