import { Component, Inject } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Collection } from 'src/app/shared/models/Collection';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  userId: string;
  imgId: string
}

@Component({
  selector: 'app-collection-popup',
  templateUrl: './collection-popup.component.html',
  styleUrls: ['./collection-popup.component.scss']
})
export class CollectionPopupComponent {
  collections: Collection[] = [];

  constructor(public dialogRef: MatDialogRef<CollectionPopupComponent>, private router: Router,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData, private userService: UserService,
    private collectionService: CollectionService
  ){}

  ngOnInit(){
    this.loadCollections();
   }

  loadCollections(){
    this.userService.getByIdObservable(this.data.userId).subscribe(userData => {
      if (userData) {
        userData.collections.forEach(id => {
          this.collectionService.getCollectionById(id).subscribe(coll => {
            if (coll) {
              this.collections.push(coll);
            }
          })
        });
      }
    })
  }

  saveIntoColl(collId: string){
    try{
    this.collectionService.saveImg(collId, this.data.imgId);
    console.log("Kép elmentve");
    this.onNoClick();
    }catch(error){
      console.log("Hiba mentés közben");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

}
