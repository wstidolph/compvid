import { Component } from '@angular/core';
import { AppRouteChangeService } from '@compvid/xplat/core';
import { installTwicPics } from "@twicpics/components/angular13";
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    //public routeMonitor: AppRouteChangeService
    ) {}
}

installTwicPics( {
  "domain": environment.twicpics.domain, // "https://sbwirzwd.twic.pics.twic.pics",
  "anticipation": 0.5,
  "step": 100,
} );
