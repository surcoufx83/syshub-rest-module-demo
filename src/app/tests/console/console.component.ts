import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, map, startWith } from 'rxjs';
import { PermissionsItem, permissions } from 'src/app/perm/permissions/permissions';
import { environment } from 'src/environments/environment';
import { RestService, StatusNotExpectedError } from 'syshub-rest-module';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnDestroy {

  env = environment;
  sub?: Subscription;
  perm: PermissionsItem = permissions['PERM_IEPOSSERVER_RUNCONSOLECOMMAND'];

  hideConsoleHint: boolean = false;
  loggedin: boolean = false;

  availableCommands?: { [key: string]: string };
  availableCommandKeys: string[] = [];

  genericCmdBusy: boolean = false;
  genericCmdFilteredKeys: string[] = [];
  genericCmdOutput: string = '';
  genericCmdResult: string = '';
  genericCmdData = new FormGroup({
    command: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    args: new FormControl(''),
  });

  helpCmdBusy: boolean = false;
  helpCmdOutput: string = '';
  helpCmdResult: string = '';

  memCmdBusy: boolean = false;
  memCmdOutput: string = '';
  memCmdResult: string = '';

  pCmdBusy: boolean = false;
  pCmdOutput: string = '';
  pCmdResult: string = '';

  constructor(private restService: RestService, private snackBar: MatSnackBar) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.loggedin = state);
    const storage = sessionStorage.getItem('commands');
    if (storage != null) {
      this.availableCommands = JSON.parse(storage);
      this.availableCommandKeys = Object.keys(this.availableCommands!);
      this.filter();
    }
  }

  filter(): void {
    const filter = this.genericCmdData.controls['command'].value || '';
    this.genericCmdFilteredKeys = this.availableCommandKeys.filter((key) => filter == '' || key.toLocaleUpperCase().startsWith(filter.toLocaleUpperCase()));

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onRunGenericCmd(): void {
    if (this.genericCmdBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.genericCmdData.valid) {
      this.snackBar.open('Bitte Kommando eingeben.', 'OK');
      return;
    }
    this.genericCmdBusy = true;
    this.genericCmdOutput = 'Bitte warten...'
    this.genericCmdOutput = 'Starte Test\r\n';
    let cmd: string = this.genericCmdData.controls['command'].value!;
    let args: string[] = this.genericCmdData.controls['args'].value!.split('\n');
    this.genericCmdOutput += `> restService.runConsoleCommand(${cmd}, ${args})\r\n`;
    this.restService.runConsoleCommand(cmd, args).subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.genericCmdOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.genericCmdOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else if (response instanceof Error) {
        this.genericCmdOutput += `Fehler ${response.message}\r\n`;
      } else {
        this.genericCmdOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;

      }
      this.genericCmdBusy = false;
    });
  }

  onRunHelpCmd(): void {
    if (this.helpCmdBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    this.helpCmdBusy = true;
    this.helpCmdOutput = 'Bitte warten...'
    this.helpCmdOutput = 'Starte Test\r\n';
    this.helpCmdOutput += `> restService.runConsoleCommandHelp()\r\n`;
    this.restService.runConsoleCommandHelp().subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.helpCmdOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.helpCmdOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else if (response instanceof Error) {
        this.helpCmdOutput += `Fehler ${response.message}\r\n`;
      } else {
        this.helpCmdOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
        const responseObj = <{ [key: string]: string }>response;
        this.availableCommands = Object.keys(response).sort().reduce((result: { [key: string]: string }, key) => (result[key] = responseObj[key], result), {});
        this.availableCommandKeys = Object.keys(this.availableCommands);
        sessionStorage.setItem('commands', JSON.stringify(this.availableCommands));
        this.filter();
        this.helpCmdResult = `${this.availableCommandKeys.length} Kommandos erhalten`;
      }
      this.helpCmdBusy = false;
    });
  }

  onRunMemCmd(): void {
    if (this.memCmdBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    this.memCmdBusy = true;
    this.memCmdOutput = 'Bitte warten...'
    this.memCmdOutput = 'Starte Test\r\n';
    this.memCmdOutput += `> restService.runConsoleCommandMem()\r\n`;
    this.restService.runConsoleCommandMem().subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.memCmdOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.memCmdOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else if (response instanceof Error) {
        this.memCmdOutput += `Fehler ${response.message}\r\n`;
      } else {
        this.memCmdOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;

      }
      this.memCmdBusy = false;
    });
  }

  onRunPCmd(): void {
    if (this.pCmdBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    this.pCmdBusy = true;
    this.pCmdOutput = 'Bitte warten...'
    this.pCmdOutput = 'Starte Test\r\n';
    this.pCmdOutput += `> restService.runConsoleCommandP()\r\n`;
    this.restService.runConsoleCommandP().subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.pCmdOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.pCmdOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else if (response instanceof Error) {
        this.pCmdOutput += `Fehler ${response.message}\r\n`;
      } else {
        this.pCmdOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;

      }
      this.pCmdBusy = false;
    });
  }

}
