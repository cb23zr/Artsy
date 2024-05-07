import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit{
  userId: string = '';

  constructor(private actRoute: ActivatedRoute) {
  }
  ngOnInit(): void{
    this.actRoute.params.subscribe((param:any)=>{
      this.userId = param.userId as string;
    })
  }
}
