import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PermissionsItem, permissions } from 'src/app/perm/permissions/permissions';
import { environment } from 'src/environments/environment';
import { RestService, StatusNotExpectedError, SyshubWorkflowExecution } from 'syshub-rest-module';

export function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
};

@Component({
  selector: 'app-workflow-executions',
  templateUrl: './workflow-executions.component.html',
  styleUrls: ['./workflow-executions.component.scss']
})
export class WorkflowExecutionsComponent implements OnDestroy {

  env = environment;
  sub?: Subscription;
  getExecutionsperm: PermissionsItem = permissions['PERM_IADMINSERVICE_GETLIST'];
  getExecutionperm: PermissionsItem = permissions['PERM_IADMINSERVICE_GETOBJECT'];
  postperm: PermissionsItem = permissions['PERM_IADMINSERVICE_GETWORKFLOWITEM'];

  hideConsoleHint: boolean = false;
  loggedin: boolean = false;

  getExecutionsTestBusy: boolean = false;
  getExecutionsTestOutput: string = '';
  getExecutionsTestResult: string = '';

  postTestBusy: boolean = false;
  postTestOutput: string = '';
  postTestResult: string = '';
  postTestRunUuid: string = '';
  postData = new FormGroup({
    asyncSwitch: new FormControl(true),
    jobId: new FormControl(''),
    workflowUuid: new FormControl('', { validators: [Validators.pattern(/^[0-9a-z]{32}$/i), Validators.required] }),
  });

  getExecutionTestBusy: boolean = false;
  getExecutionTestOutput: string = '';
  getExecutionTestResult: string = '';
  getExecutionData = new FormGroup({
    uuid: new FormControl('', { validators: [Validators.pattern(/^([0-9a-zA-Z]{8}(?:\-[0-9a-zA-Z]{4}){3}\-[0-9a-zA-Z]{12}|[0-9a-z]{32})$/i), Validators.required] }),
  });

  executeAliasTestBusy: boolean = false;
  executeAliasTestOutput: string = '';
  executeAliasData = new FormGroup({
    alias: new FormControl('', { validators: [Validators.required] }),
    method: new FormControl('POST', { validators: [Validators.required] }),
    payload: new FormControl('{ }', { validators: [jsonValidator] }),
  });

  constructor(private restService: RestService, private snackBar: MatSnackBar) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.loggedin = state);
  }

  readonlyAliasPayload(): boolean {
    return this.executeAliasData.controls['method'].value! == 'GET' || this.executeAliasData.controls['method'].value! == 'DELETE';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onExecuteAliasTest(): void {
    if (this.executeAliasTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.executeAliasData.valid) {
      this.snackBar.open('Bitte Eingabefelder prüfen.', 'OK');
      return;
    }
    let method = this.executeAliasData.controls['method'].value!;
    if (method !== 'DELETE' && method != 'GET' && method != 'POST' && method != 'PUT') {
      this.snackBar.open('Ungültige Methode.', 'OK');
      return;
    }
    this.executeAliasTestBusy = true;
    this.executeAliasTestOutput = 'Starte Test\r\n';
    this.executeAliasTestOutput += `> restService.runWorkflowAlias(${this.executeAliasData.controls['alias'].value}, ${method})\r\n`;
    try {
      this.restService.runWorkflowAlias(this.executeAliasData.controls['alias'].value!, JSON.parse(this.executeAliasData.controls['payload'].value!), method).subscribe((response) => {
        this.executeAliasTestOutput += `Ergebnis: HTTP Status ${response.status}\r\nAntwort:\r\n${JSON.stringify(response.content, null, 2)}\r\n`;
        this.executeAliasTestBusy = false;
      });
    } catch (error) {
      this.executeAliasTestOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.executeAliasTestBusy = false;
    }

  }

  onRunGetExecutionsTest(): void {
    if (this.getExecutionsTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    this.getExecutionsTestBusy = true;
    this.getExecutionsTestResult = 'Bitte warten...'
    this.getExecutionsTestOutput = 'Starte Test\r\n';
    this.getExecutionsTestOutput += `> restService.getWorkflowExecutions()\r\n`;
    try {
      this.restService.getWorkflowExecutions().subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.getExecutionsTestOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.getExecutionsTestOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else if (response instanceof Error) {
          this.getExecutionsTestOutput += `Fehler ${response.message}\r\n`;
        } else {
          this.getExecutionsTestOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
          response = <SyshubWorkflowExecution[]>response;
          let count = {
            'COMPLETED': 0,
            'EXCEPTION': 0,
            'PENDING': 0,
            'RUNNING': 0,
          };
          response.forEach((item) => count[item.status]++);
          this.getExecutionsTestResult = `Der Server hat ${response.length} Ausführungen zurückgemeldet, davon ${count['COMPLETED']} abgeschlossen, ${count['EXCEPTION']} mit Fehler, ${count['PENDING']} warten auf Ausführung, ${count['RUNNING']} laufen noch.`;
        }
        this.getExecutionsTestBusy = false;
      });
    } catch (error) {
      this.getExecutionsTestOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.getExecutionsTestBusy = false;
    }

  }

  onRunGetExecutionTest(): void {
    if (this.getExecutionTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.getExecutionData.valid) {
      this.snackBar.open('Bitte Uuid eingeben.', 'OK');
      return;
    }
    this.getExecutionTestBusy = true;
    this.getExecutionTestResult = 'Bitte warten...'
    this.getExecutionTestOutput = 'Starte Test\r\n';
    this.getExecutionTestOutput += `> restService.getWorkflowExecution(${this.getExecutionData.controls['uuid'].value})\r\n`;
    try {
      this.restService.getWorkflowExecution(this.getExecutionData.controls['uuid'].value!).subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.getExecutionTestOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.getExecutionTestOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else if (response instanceof Error) {
          this.getExecutionTestOutput += `Fehler ${response.message}\r\n`;
        } else {
          this.getExecutionTestOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
          response = <SyshubWorkflowExecution>response;
          this.getExecutionTestResult = `Status: ${response.status}`;
        }
        this.getExecutionTestBusy = false;
      });
    } catch (error) {
      this.getExecutionTestOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.getExecutionTestBusy = false;
    }

  }

  onRunPostExecutionsTest(): void {
    if (this.postTestBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.postData.valid) {
      this.snackBar.open('Bitte Workflow Uuid eingeben.', 'OK');
      return;
    }
    this.postTestBusy = true;
    this.postTestOutput = 'Starte Test\r\n';
    this.postTestResult = 'Bitte warten...'
    const uuid = this.postData.controls.workflowUuid.value!;
    const async = this.postData.controls.asyncSwitch.value!;
    let jobid = undefined;
    if (this.postData.controls.jobId.value != null && this.postData.controls.jobId.value != '')
      jobid = +(this.postData.controls.jobId.value)
    this.postTestOutput += `> restService.runWorkflowExecution(${uuid}, ${async}, ${jobid})\r\n`;
    try {
      this.restService.runWorkflow(uuid, async, jobid).subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.postTestOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.postTestOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else if (response instanceof Error) {
          this.postTestOutput += `Fehler ${response.message}\r\n`;
        } else {
          this.postTestOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
          response = <[string, number]>response;
          if (response[0].length > 0) {
            this.postTestRunUuid = response[0].substring(22);
            if (response[1] == HttpStatusCode.Accepted) {
              this.postTestResult = `Ausführung gestartet mit Id ${this.postTestRunUuid}`;
            }
          }
        }
        this.postTestBusy = false;
      });
    } catch (error) {
      this.postTestOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.postTestBusy = false;
    }

  }

}
