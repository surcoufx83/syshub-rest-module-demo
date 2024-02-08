import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'syshub-rest-module';

@Component({
  selector: 'app-login-min',
  templateUrl: './login-min.component.html',
  styleUrls: ['./login-min.component.scss']
})
export class LoginMinComponent implements OnDestroy {

  username: string = 'foo';
  password: string = '<foobar!>';

  loggedIn: boolean = false;
  sub?: Subscription;

  constructor(private restService: RestService) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.loggedIn = state);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmitBtnClicked(): void {
    this.restService.login(this.username, this.password).subscribe((response) => {
      if (response === null) // Initial status, not yet any response from server
        return;
      if (response === true) // Login successfull
        console.log(`User ${this.username} logged in`);
      else // Error while logging in, see details in response
        console.log(response);
    });
  }

}
