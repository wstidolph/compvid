import { Component } from '@angular/core';
import { installTwicPics } from "@twicpics/components/angular13";
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}

installTwicPics( {
  "domain": environment.twicpics.domain, // "https://sbwirzwd.twic.pics.twic.pics",
  "anticipation": 0.5,
  "step": 100,
} );
