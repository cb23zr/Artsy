import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Input() currentPage: string = '';
  @Output() kivalasztottOldal: EventEmitter<string> = new EventEmitter();
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();

  menuSwitch(){
    this.kivalasztottOldal.emit(this.currentPage);
  }

  close(){
    this.onCloseSidenav.emit(true);
  }

}
