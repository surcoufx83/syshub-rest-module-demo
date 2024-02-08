import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestService } from 'syshub-rest-module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'syshub-rest-api-module-test';
  env = environment;
  loggedin: boolean = false;

  constructor(private restService: RestService) {
    this.restService.isLoggedIn.subscribe((state) => this.loggedin = state);
  }

}
