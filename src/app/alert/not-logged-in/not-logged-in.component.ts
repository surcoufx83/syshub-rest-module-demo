import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'not-logged-in-alert',
  templateUrl: './not-logged-in.component.html',
  styleUrls: ['./not-logged-in.component.scss']
})
export class NotLoggedInComponent {
  env = environment;
}
