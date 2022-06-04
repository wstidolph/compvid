import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PicDoc } from '../models';

import { PicdocService } from './picdoc.service';
@Injectable({
  providedIn: 'root',
})
export class PicdocResolverService implements Resolve<PicDoc> {
  constructor(private picdocService: PicdocService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PicDoc> {
    const ibname = route.paramMap.get('img_basename')

    const result =  this.picdocService.getPicDocByImgBasename(ibname)
    console.log('Called Get PicDoc in resolver...', ibname, result);
    return result;
  }
}
