import { Pipe, PipeTransform } from '@angular/core';
import { merge } from 'rxjs';

@Pipe({
  name: 'orderFormat'
})
export class OrderFormatPipe implements PipeTransform {

  /*transform(array: any[], field: string): any[] {
    if (!array || array.length === 0) return [];
    return array.sort((a, b) => {
      const alfa = new Date(a[field]).getTime();
      const beta = new Date(b[field]).getTime();
      return beta-alfa;
    });
  }*/

    transform(array: any[], sortBy: string): any[] {
      if (!array) return [];
  
      switch (sortBy) {
        
        default:
          const following = array.filter((a) => a.onTheList === true);
          const followingByDate = following.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const other = array.filter((a) => a.onTheList === false);
          const otherByDate = other.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          return [...followingByDate, ...otherByDate];
        case 'datenew':
          return array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        case 'dateold':
          return array.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'mostLikes':
          return array.sort((a, b) => b.favCount - a.favCount);
        case 'leastLikes':
          return array.sort((a, b) => a.favCount - b.favCount);
        case 'following':
          return array.filter((a) => a.onTheList === true);
       
      }
    }

}
