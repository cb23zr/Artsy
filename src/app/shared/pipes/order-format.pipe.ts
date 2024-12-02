import { Pipe, PipeTransform } from '@angular/core';
import { merge } from 'rxjs';

@Pipe({
  name: 'orderFormat'
})
export class OrderFormatPipe implements PipeTransform {

    transform(array: any[], sortBy: string): any[] {
      if (!array) return [];
      const oneWeek = new Date();
      oneWeek.setDate(oneWeek.getDate() - 7);
  
      switch (sortBy) {
        
        default:
          const following = array.filter((a) => a.onTheList === true  && new Date(a.date) >= oneWeek);
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
          const follow = array.filter((a) => a.onTheList === true);
          return follow.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
       
      }
    }

}
