import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PermissionsItem, permissions } from 'src/app/perm/permissions/permissions';
import { environment } from 'src/environments/environment';
import { RestService, StatusNotExpectedError, BasicRestSettings, OAuthRestSettings } from 'syshub-rest-module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  env = environment;
  sub?: Subscription;
  perm: PermissionsItem = permissions['PERM_IADMINSERVICE_GETUSERDATABYNAME'];

  apikeyEnabled = Object.keys(this.env.syshub).includes('apiKey');
  apikeyTestBusy: boolean = false;
  apikeyTestOutput: string = '';

  basicEnabled = Object.keys(this.env.syshub).includes('basic');
  basicLoginRequired: boolean;
  basicLoginTestBusy: boolean = false;
  basicLoginTestOutput: string = '';
  basicUsername: string = '';
  basicPassword: string = '';
  basicKeepSession: boolean = true;

  oauthEnabled = Object.keys(this.env.syshub).includes('oauth');
  oauthLoggedin: boolean = false;
  oauthLoginTestBusy: boolean = false;
  oauthLoginTestOutput: string = '';
  oauthUsername: string = '';
  oauthPassword: string = '';
  oauthKeepSession: boolean = true;

  constructor(private restService: RestService, private snackBar: MatSnackBar) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.oauthLoggedin = state);
    if (Object.keys(this.env.syshub).includes('basic'))
      this.basicLoginRequired = (<BasicRestSettings>this.env.syshub).basic.requiresLogin == true;
    else
      this.basicLoginRequired = false;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onTestApiKey(): void {
    if (this.apikeyTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.apikeyEnabled) {
      this.snackBar.open('API Key Authentifizierung ist nicht aktiviert in der ' + this.env.variant, 'OK');
      return;
    }
    this.apikeyTestBusy = true;
    this.apikeyTestOutput = 'Starte Test Basic Login\r\n';
    this.apikeyTestOutput += `> restService.getCurrentUser()\r\n`;
    this.restService.getCurrentUser(true).subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.apikeyTestOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.apikeyTestOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else {
        this.apikeyTestOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
      }
      this.apikeyTestBusy = false;
    });

  }

  onTestBasicLogin(): void {
    if (this.basicLoginTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.basicEnabled) {
      this.snackBar.open('Basic Authentifizierung ist nicht aktiviert in der ' + this.env.variant, 'OK');
      return;
    }
    this.basicLoginTestBusy = true;
    this.basicLoginTestOutput = 'Starte Test Basic Login\r\n';

    if (this.basicLoginRequired) {
      this.basicLoginTestOutput += `> restService.login(${this.basicUsername}, **********)\r\n`;
      this.restService.login(this.basicUsername, this.basicPassword, this.basicKeepSession).subscribe((response) => {
        if (response == null)
          return;
        if (response instanceof StatusNotExpectedError) {
          this.basicLoginTestOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.basicLoginTestOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else {
          this.basicLoginTestOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
        }
        this.basicLoginTestBusy = false;
      });
    }
    else {
      this.basicLoginTestOutput += `> restService.getCurrentUser()\r\n`;
      this.restService.getCurrentUser(true).subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.basicLoginTestOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.basicLoginTestOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else {
          this.basicLoginTestOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
        }
        this.basicLoginTestBusy = false;
      });
    }

  }

  onBasicLogout(): void {
    this.restService.logout();
    // location.reload();
  }

  onOauthLogout(): void {
    this.restService.logout();
    // location.reload();
  }

  onTestOauthLogin(): void {
    if (this.oauthLoginTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.oauthEnabled) {
      this.snackBar.open('OAuth2 Authentifizierung ist nicht aktiviert in der ' + this.env.variant, 'OK');
      return;
    }
    this.oauthLoginTestBusy = true;
    this.oauthLoginTestOutput = 'Starte OAuth2 Login\r\n';
    this.oauthLoginTestOutput += `> restService.login(${this.oauthUsername}, **********)\r\n`;
    this.restService.login(this.oauthUsername, this.oauthPassword, this.oauthKeepSession).subscribe((response) => {
      if (response === null)
        this.oauthLoginTestOutput += `> Initialisiert\r\n`;
      else if (response === true) {
        this.oauthLoginTestOutput += `> Erfolgreich eingeloggt:\r\n${JSON.stringify(JSON.parse(this.oauthKeepSession ? localStorage.getItem((<OAuthRestSettings>this.env.syshub).oauth.storeKey!)! : sessionStorage.getItem((<OAuthRestSettings>this.env.syshub).oauth.storeKey!)!), null, 2)}`;
        this.oauthLoginTestBusy = false;
      }
      else {
        this.oauthLoginTestOutput += `> Fehler:\r\n${JSON.stringify(response, null, 2)}`;
        this.oauthLoginTestBusy = false;
      }
    });
  }

}
