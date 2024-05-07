import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage,getStorage,ref } from '@angular/fire/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { UploadService } from 'src/app/shared/services/upload.service';



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


constructor(private service: UploadService) {}

ngOnInit(){
  this.resetForm();
}

formTemplate = new FormGroup({
  caption: new FormControl("", Validators.required),
  category: new FormControl(""),
  imageUrl: new FormControl("",Validators.required),

});


showPreview(event: any){
  if(event.target.files && event. target.files[0]){
    const reader = new FileReader();
    reader.onload = (e:any) => this.imgSrc = e.target.result;
    reader.readAsDataURL(event. target.files[0]);
    this.selectedImage = event. target.files[0];
  }else{
    this.imgSrc = 'assets/img/plchldr.jpg';
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
        formValue['imageurl'] = url;
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
    caption:'',
    imageUrl:'',
    category:'Person',
  })
  this.imgSrc= 'assets/placeholder.jpg';
  this.selectedImage= null;
  this.isSubmitted = false;
}

}