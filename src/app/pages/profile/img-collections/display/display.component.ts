import { Component } from '@angular/core';
import { DocumentData, Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopupComponent } from 'src/app/pages/main/popup/popup.component';

import { Collection } from 'src/app/shared/models/Collection';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent {
  imageList: Array<any> = [];
  collectionTitle!: any;
  collectionId!: any;
  collectionDetails: string[] =[];
  routeParamsSub!: Subscription;
  data!: DocumentData | undefined;
  username: string ="";
  collDate!: Date;
  collCount!: number;

  constructor(private uploadService: UploadService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private collectionService: CollectionService
  ){}

  async ngOnInit(){
    this.routeParamsSub=this.route.params.subscribe(async (params) => {
      this.collectionTitle = params['title'];
      console.log("Collection ID:", this.collectionTitle);
  
      this.collectionId = await this.collectionService.getId(this.collectionTitle);
    
    try {
      this.collectionService.getCollectionById(this.collectionId).subscribe(async data =>{
        if(data){
          const actualDate = data.date as unknown as Timestamp;
          this.collDate =  actualDate.toDate();
          this.collCount = data.imgCount;
          for(const d of data.images){
            this.collectionDetails.push(d);
          }
        }else{
          console.error("Hiba");
        }

        
      for(const id of this.collectionDetails){
         this.data = await this.uploadService.getImgDoc(id);
        
            if(this.data !== undefined){
              const url = this.data.imageurl;
              this.username = this.data.username;
              const date = this.data.date;
              const caption = this.data.caption;

              if(url !== undefined){
                const uname = this.username;
                this.imageList.push({ id, url, date, caption, uname});
              }else{
                console.log("Hiba");
              }
            }else{
              console.log("Hiba");
            }
      }

      });
    
      } catch (error) {
        console.error('Hiba: ', error);
      }
    });
  }


  openDialog(id: string, imageurl:string, date: Timestamp, caption: string, username: string): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if(user){
      const actualDate =date.toDate();
      const dialogRef = this.dialog.open(PopupComponent, {
        data: {id: id ,name: this.username, imageUrl: imageurl, date: actualDate, caption: caption, username: username},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('A dialog bezárult', result);
    });
    }
  }



}
