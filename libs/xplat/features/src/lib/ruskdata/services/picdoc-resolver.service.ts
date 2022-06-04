import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY} from 'rxjs';
import { catchError, mergeMap, take, tap } from 'rxjs/operators';
import { PicDoc } from '../models';

import { PicdocService } from './picdoc.service';
@Injectable({
  providedIn: 'root',
})
export class PicdocResolverService implements Resolve<PicDoc> {
  constructor(private picdocService: PicdocService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<PicDoc> | Observable<never> {
    const ibname = route.paramMap.get('img_basename')
    return this.picdocService.getPicDocByImgBasename(ibname).pipe(
      mergeMap(picdoc => {
        if (picdoc) {
          return of(picdoc);
        } else { // img_basename not found
          this.router.navigate(['/piclist']);
          return EMPTY;
        }
      }),
      take(1)
    )
 }
}
