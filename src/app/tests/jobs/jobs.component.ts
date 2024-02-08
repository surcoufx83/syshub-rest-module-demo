import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PermissionsItem, permissions } from 'src/app/perm/permissions/permissions';
import { environment } from 'src/environments/environment';
import { JobResponse, JobsResponse, RestService, SearchParams, StatusNotExpectedError, SyshubJob, SyshubJobStatus, SyshubJobType } from 'syshub-rest-module';

export const limitCountValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const limit = control.get('limit');
  const offset = control.get('offset');
  if (limit && offset) {
    if ((limit.value === null && offset.value === null) || (limit.value !== null && offset.value !== null)) {
      limit.setErrors(null);
      offset.setErrors(null);
      return null;
    }
    const e = { 'limitCount': true };
    limit.setErrors(e);
    offset.setErrors(e);
    return e;
  }
  return null;
}

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnDestroy, OnInit {

  env = environment;
  sub?: Subscription;
  addPerm: PermissionsItem = permissions['PERM_IJOBSERVICE_ADDJOB'];
  getPerm: PermissionsItem = permissions['PERM_IJOBSERVICE_GETJOBS'];

  hideConsoleHint: boolean = false;
  loggedin: boolean = false;
  jobtypes: SyshubJobType[] = [];
  jobstatuses: JobStatusHelper[] = [];

  addFileBusy: boolean = false;
  addFileOutput: string = '';
  addFilesResult: string = '';
  addFileData = new FormGroup({
    jobId: new FormControl(null, { validators: [Validators.required] }),
    file: new FormControl(null, { validators: [Validators.required] }),
    filename: new FormControl({ value: '', disabled: true }),
    filetype: new FormControl(null, { validators: [Validators.required, Validators.pattern('^ticket|source$')] }),
  });

  addJobBusy: boolean = false;
  addJobOutput: string = '';
  addJobResult: string = '';
  addJobData = new FormGroup({
    categoryName: new FormControl(''),
    client: new FormControl(''),
    customField: new FormControl(''),
    customField1: new FormControl(''),
    customField2: new FormControl(''),
    customField3: new FormControl(''),
    customField4: new FormControl(''),
    dataType: new FormControl(''),
    delDays: new FormControl(null),
    inputChannel: new FormControl(''),
    jobTypeName: new FormControl(''),
    jobTypeUuid: new FormControl(''),
    pages: new FormControl(0),
    parentId: new FormControl(null),
    priority: new FormControl(50, { validators: [Validators.min(0), Validators.max(100)] }),
    procCount: new FormControl(0),
    processingHost: new FormControl(''),
    sourceFile: new FormControl(''),
    startPoint: new FormControl(''),
    status: new FormControl(0, { validators: [Validators.min(0), Validators.max(18), Validators.required] }),
    textStatus: new FormControl(''),
    ticketFile: new FormControl(''),
    title: new FormControl(''),
    xid: new FormControl(''),
  });

  getJobsBusy: boolean = false;
  getJobsOutput: string = '';
  getJobsResult: string = '';
  getJobsData = new FormGroup({
    limit: new FormControl(null),
    offset: new FormControl(null),
    orderby: new FormControl(''),
    search: new FormControl(''),
  }, { validators: [limitCountValidator] });

  constructor(private restService: RestService, private snackBar: MatSnackBar) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.loggedin = state);
  }

  formDataToJob(form: FormGroup): SyshubJob {
    let job: SyshubJob = {
      categoryName: form.controls['categoryName']?.value ?? null,
      client: form.controls['client']?.value ?? null,
      customField: form.controls['customField']?.value ?? null,
      customField1: form.controls['customField1']?.value ?? null,
      customField2: form.controls['customField2']?.value ?? null,
      customField3: form.controls['customField3']?.value ?? null,
      customField4: form.controls['customField4']?.value ?? null,
      dataType: form.controls['dataType']?.value ?? null,
      del: form.controls['del']?.value ?? 0,
      delDate: form.controls['delDate']?.value ?? null,
      delDays: form.controls['delDays']?.value ?? 0,
      id: form.controls['id']?.value ?? 0,
      inputChannel: form.controls['inputChannel']?.value ?? null,
      jobTypeName: form.controls['jobTypeName']?.value ?? null,
      jobTypeUuid: form.controls['jobTypeUuid']?.value ?? null,
      pages: form.controls['pages']?.value ?? 0,
      parentId: form.controls['parentId']?.value ?? 0,
      priority: form.controls['priority']?.value ?? 0,
      procCount: form.controls['procCount']?.value ?? 0,
      processingHost: form.controls['processingHost']?.value ?? null,
      senderHost: form.controls['senderHost']?.value ?? null,
      sourceFile: form.controls['sourceFile']?.value ?? null,
      startDate: form.controls['startDate']?.value ?? null,
      startPoint: form.controls['startPoint']?.value ?? null,
      status: form.controls['status']?.value ?? 0,
      submission: form.controls['submission']?.value ?? null,
      textStatus: form.controls['textStatus']?.value ?? null,
      ticketFile: form.controls['ticketFile']?.value ?? null,
      title: form.controls['title']?.value ?? null,
      userName: form.controls['userName']?.value ?? null,
      xid: form.controls['xid']?.value ?? null
    };
    return job;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    if (environment.syshub.basic?.enabled || (environment.syshub.oauth?.scope !== undefined && environment.syshub.oauth?.scope.indexOf('private') > -1)) {
      this.restService.get('jobtype/list').subscribe((response) => {
        if (response.status == HttpStatusCode.Ok) {
          this.jobtypes = (<SyshubJobType[]>response.content['children']).sort((a, b) => a.name > b.name ? 1 : -1);
        }
      });
    }
    Object.values(SyshubJobStatus).filter((val) => !isNaN(Number(val))).forEach((val) => {
      this.jobstatuses.push({
        status: <number>val,
        name: SyshubJobStatus[<number>val],
      });
    });
  }

  onCreateJob(): void {
    if (this.addJobBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.addJobData.valid) {
      this.snackBar.open('Das Formular enthält noch Fehler. Bitte die Eingaben prüfen.', 'OK');
      return;
    }

    let job = this.formDataToJob(this.addJobData);

    this.addJobBusy = true;
    this.addJobOutput = 'Bitte warten...'
    this.addJobOutput = 'Starte Test\r\n';
    this.addJobOutput += `> restService.createJob(${JSON.stringify(job)})\r\n`;
    this.restService.createJob(job).subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.addJobOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.addJobOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else {
        this.addJobOutput += `Header:\r\n${JSON.stringify((<JobResponse>response).header, null, 2)}\r\n`;
        this.addJobOutput += `Antwort:\r\n${JSON.stringify((<JobResponse>response).content, null, 2)}\r\n`;
        this.addJobResult = `Der Job wurde mit Id ${(<JobResponse>response).content.id} angelegt.`;
      }
      this.addJobBusy = false;
    });
  }

  onFileSelected(): void {
    const inputNode: any = document.querySelector('#fileUpload');
    if (inputNode.files[0] == undefined || typeof (FileReader) == 'undefined')
      return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.addFileData.controls.file.patchValue(inputNode.files[0]);
      this.addFileData.controls.filename.patchValue(inputNode.files[0].name);
    };
    reader.readAsArrayBuffer(inputNode.files[0]);
  }

  onGetJobs(): void {
    if (this.getJobsBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.getJobsData.valid) {
      this.snackBar.open('Das Formular enthält noch Fehler. Bitte die Eingaben prüfen.', 'OK');
      return;
    }
    let params: SearchParams = {};
    if (this.getJobsData.controls.limit.value != null && this.getJobsData.controls.limit.value > 0)
      params.limit = this.getJobsData.controls.limit.value;
    if (this.getJobsData.controls.offset.value != null && this.getJobsData.controls.offset.value >= 0)
      params.offset = this.getJobsData.controls.offset.value;
    if (this.getJobsData.controls.orderby.value != null && this.getJobsData.controls.orderby.value != '')
      params.orderby = this.getJobsData.controls.orderby.value;
    if (this.getJobsData.controls.search.value != null && this.getJobsData.controls.search.value != '')
      params.search = this.getJobsData.controls.search.value;

    this.getJobsBusy = true;
    this.getJobsOutput = 'Bitte warten...'
    this.getJobsOutput = 'Starte Test\r\n';
    this.getJobsOutput += `> restService.getJobs(${JSON.stringify(params)})\r\n`;
    this.restService.getJobs(params).subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.getJobsOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.getJobsOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else {
        this.getJobsOutput += `Header:\r\n${JSON.stringify((<JobsResponse>response).header, null, 2)}\r\n`;
        this.getJobsOutput += `Antwort:\r\n${JSON.stringify((<JobsResponse>response).content, null, 2)}\r\n`;
        this.getJobsResult = `Es wurden ${(<JobsResponse>response).content.length} Jobs gefunden die den Kriterien entsprechen.`;
      }
      this.getJobsBusy = false;
    });
  }

  onJobtypeChanged(uuidfield: HTMLInputElement) {
    const uuid = uuidfield.value;
    let found = false;
    this.jobtypes.forEach((jobtype) => {
      if (jobtype.uuid == uuid) {
        found = true;
        this.addJobData.controls.jobTypeName.patchValue(jobtype.name);
        this.addJobData.controls.jobTypeName.disable();
      }
    });
    if (!found) {
      this.addJobData.controls.jobTypeName.patchValue('');
      this.addJobData.controls.jobTypeName.enable();
    }
  }

  onUploadFile() {
    if (this.addFileBusy) {
      this.snackBar.open('Upload läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.addFileData.valid) {
      this.snackBar.open('Das Formular enthält noch Fehler. Bitte die Eingaben prüfen.', 'OK');
      return;
    }
    this.addFileBusy = true;
    this.addFileOutput = 'Bitte warten...'
    this.addFileOutput = 'Starte Test\r\n';
    this.addFileOutput += `> restService.uploadFileToJob(${this.addFileData.controls.jobId.value}, ${this.addFileData.controls.filetype.value}, ..., ${this.addFileData.controls.filename.value})\r\n`;
    this.restService.uploadFileToJob(
      this.addFileData.controls.jobId.value!,
      this.addFileData.controls.filetype.value!,
      this.addFileData.controls.file.value!,
      this.addFileData.controls.filename.value!
    ).subscribe((response) => {
      if (response instanceof StatusNotExpectedError) {
        this.addFileOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
        this.addFileOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
      } else {
        this.addFileOutput += `Datei wurde hochgeladen.`;
      }
      this.addFileBusy = false;
    });
  }

}

export interface JobStatusHelper {
  status: number;
  name: string;
}
