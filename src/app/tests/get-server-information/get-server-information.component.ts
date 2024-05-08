import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PermissionsItem, permissions } from 'src/app/perm/permissions/permissions';
import { environment } from 'src/environments/environment';
import { MissingScopeError, RestService, StatusNotExpectedError } from 'syshub-rest-module';

@Component({
  selector: 'app-get-server-information',
  templateUrl: './get-server-information.component.html',
  styleUrls: ['./get-server-information.component.scss']
})
export class GetServerInformationComponent implements OnDestroy {

  env = environment;
  sub?: Subscription;
  perminfo: PermissionsItem = permissions['PERM_IEPOSSERVER_GETINFORMATIONLIST'];
  permProps: PermissionsItem = permissions['PERM_IADMINSERVICE_GETSERVERINFOS'];

  loggedin: boolean = false;

  testServerInfoBusy: boolean = false;
  testServerInfoOutput: string = '';

  testServerPropsBusy: boolean = false;
  testServerPropsOutput: string = '';

  constructor(private restService: RestService, private snackBar: MatSnackBar) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.loggedin = state);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onRunTestGetServerInfo(): void {
    if (this.testServerInfoBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    this.testServerInfoBusy = true;
    this.testServerInfoOutput = 'Starte Abruf\r\n';
    this.testServerInfoOutput += `> restService.getServerInformation()\r\n`;
    this.restService.getServerInformation().subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.testServerInfoOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.testServerInfoOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else if (response instanceof Error) {
        this.testServerInfoOutput += `Fehler ${response.message}\r\n`;
      } else {
        this.testServerInfoOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
      }
      this.testServerInfoBusy = false;
    });
  }

  onRunTestGetServerProperties(): void {
    if (this.testServerPropsBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    this.testServerPropsBusy = true;
    this.testServerPropsOutput = 'Starte Abruf\r\n';
    this.testServerPropsOutput += `> restService.getServerProperties()\r\n`;
    this.restService.getServerProperties().subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.testServerPropsOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.testServerPropsOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else if (response instanceof Error) {
        this.testServerPropsOutput += `Fehler ${response.message}\r\n`;
      } else {
        this.testServerPropsOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
      }
      this.testServerPropsBusy = false;
    });
  }

}
