import { Component, Inject, OnInit } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/User';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from 'src/app/shared/services/user.service';



@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {

  imgSrc : string = 'assets/placeholder.jpg';
  selectedImage:any = null;
  isSubmitted: boolean = false;
  storage = getStorage();
  user!: User;
  name!: string;
  
  formTemplate = new FormGroup({
    id: new FormControl(""),
    userId: new FormControl(""),
    caption: new FormControl("", Validators.required),
    category: new FormControl("",Validators.required), 
    imageUrl: new FormControl("",Validators.required),
    username: new FormControl(""),
    favCount: new FormControl("0"),
    favUsers: new FormControl(''),
    date: new FormControl(""),

});


  constructor(
    private fb: FormBuilder, 
    private service: UploadService,
     private userService: UserService,
   ) {}

   ngOnInit(){
    this.resetForm();
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.userService.getByIdObservable(user.uid).subscribe(data => {
      console.log(data);
      if (data) {
        this.user = data;
        this.formTemplate.get('username')?.setValue(this.user.username);
        this.formTemplate.get('userId')?.setValue(user.uid);
      }
      },error =>{
        console.error(error);
      });
  }

  showPreview(event: any){
    if(event.target.files && event. target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }else if(!event.target.files && this.selectedImage) {
      this.imgSrc = 'assets/plchldr.jpg';
      this.selectedImage = null;
    }
  }
  
  onSubmit(formValue: any){
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.isSubmitted = true;
    if(this.formTemplate.valid){
      const filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const storageRef = ref(this.storage,filePath);
      uploadBytesResumable(storageRef,this.selectedImage).then((snapshot) =>{
        console.log('Fájl feltöltve:', snapshot);
        getDownloadURL(storageRef).then((url)=>{
          const randomId = this.generateUniqueId(formValue.caption);
          formValue['imageurl'] = url;
          formValue['id'] = randomId;
          formValue['favCount'] = 0;
          formValue['favUsers'] = [];
          formValue['date'] = new Date();
          this.service.insertImageDetails(formValue);
          this.service.addToUploads(randomId,this.user.username);
          this.resetForm(); 
        });
      }).catch((error) => {
        console.error("Hiba a fájl feltöltésekor:", error);
      });
  
    }
  }
  
  get formControls(){
    return this.formTemplate['controls'];
  }
  
  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      id:'',
      userId:'',
      caption:'',
      imageUrl:'',
      category:'Person',
      username: '',
      favCount: '',
      favUsers: '',
      date: '',
    })

    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.userService.getByIdObservable(user.uid).subscribe(data => {
      console.log(data);
      if (data) {
        this.user = data;
        this.formTemplate.get('username')?.setValue(this.user.username);
        this.formTemplate.get('userId')?.setValue(user.uid);
      }
      },error =>{
        console.error(error);
      });
    this.imgSrc= 'assets/placeholder.jpg';
    this.selectedImage= null;
    this.isSubmitted = false;
  }
  
  generateUniqueId(caption: string): string {
    const randomNum = Math.floor(Math.random() * 1000000); 
    const sanitizedCaption = caption.replace(/\s+/g, '_').toLowerCase();
    return `${sanitizedCaption}_${randomNum}`;
  }


}
