import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage,getStorage,ref } from '@angular/fire/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  imgSrc : string = 'assets/placeholder.jpg';
  selectedImage:any = null;
  isSubmitted: boolean = false;
  storage = getStorage();
  user!: User;
  
  formTemplate = new FormGroup({
    id: new FormControl(""),
    caption: new FormControl("", Validators.required),
    category: new FormControl(""),
    imageUrl: new FormControl("",Validators.required),
    username: new FormControl("")

});


constructor(private service: UploadService, private userService: UserService) {}

ngOnInit(){
  this.resetForm();

  const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  this.userService.getByIdObservable(user.uid).subscribe(data => {
    console.log(data);
    if (data) {
      this.user = data;
      this.formTemplate.get('username')?.setValue(this.user.username);
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
  this.isSubmitted = true;
  if(this.formTemplate.valid){
    var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
    var storageRef = ref(this.storage,filePath);
    var uploadTask = uploadBytesResumable(storageRef,this.selectedImage).then((snapshot) =>{
      console.log('Fájl feltöltve:', snapshot);
      getDownloadURL(storageRef).then((url)=>{
        const randomId = this.generateUniqueId(formValue.caption);
        formValue['imageurl'] = url;
        formValue['id'] = randomId;
        this.service.insertImageDetails(formValue);
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
    caption:'',
    imageUrl:'',
    category:'Person',
    username: ''
  })
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


