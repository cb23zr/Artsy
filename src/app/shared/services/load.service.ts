import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  constructor() { }

  loadingWithPromise(uname: any, psw:any): Promise<boolean>{
    return new Promise((resolve, reject)=>{

      let i = 0
      const interval = setInterval(() =>{
        i++;
        if(i===2){
          clearInterval(interval);
          if(uname === 'pelda' && psw === 'abcd'){
            resolve(true);
          }else {
            reject(false);
          }
        }
      },1000)
    })
  }
}
