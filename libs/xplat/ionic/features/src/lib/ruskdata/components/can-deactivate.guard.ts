import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { IDeactivatableComponent } from '@compvid/xplat/features';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<IDeactivatableComponent> {
  canDeactivate(
    component: IDeactivatableComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
