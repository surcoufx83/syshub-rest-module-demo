import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ConfirmDialog } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { PermissionsItem, permissions } from 'src/app/perm/permissions/permissions';
import { environment } from 'src/environments/environment';
import { RestService, StatusNotExpectedError, SyshubBackupMeta, SyshubBackupTypesEnum } from 'syshub-rest-module';

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.scss']
})
export class BackupRestoreComponent implements OnDestroy {

  env = environment;
  sub?: Subscription;
  perminfo: PermissionsItem = permissions['PERM_IEPOSSERVER_SAVEDATABASE+PERM_IEPOSSERVER_RESTOREDATABASE'];
  permMetainfo: PermissionsItem = permissions['PERM_IEPOSSERVER_RESTOREDATABASE+PERM_IEPOSSERVER_EXISTSSERVERFILE'];

  loggedin: boolean = false;
  enumOptions = Object.keys(SyshubBackupTypesEnum).filter((item) => isNaN(Number(item))).sort((a, b) => a > b ? 1 : -1);

  testBackupBusy: boolean = false;
  testBackupOutput: string = '';
  testBackupData = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    description: new FormControl(''),
    folder: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    options: new FormControl([...this.enumOptions]),
  });

  getBackMetaBusy: boolean = false;
  getBackMetaOutput: string = '';
  getBackMetaData = new FormGroup({
    folder: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
  });
  getBackupMeta?: SyshubBackupMeta;

  restoreBusy: boolean = false;
  restoreOutput: string = '';
  restoreData = new FormGroup({
    folder: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    options: new FormControl([...this.enumOptions]),
  });

  constructor(private restService: RestService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.sub = this.restService.isLoggedIn.subscribe((state) => this.loggedin = state);
  }

  copyFolderToGetMeta(): void {
    this.getBackMetaData.controls['folder'].setValue(this.testBackupData.controls['folder'].value);
  }

  copyFolderToRestore(): void {
    if (this.getBackMetaData.controls['folder'].value != '')
      this.restoreData.controls['folder'].setValue(this.getBackMetaData.controls['folder'].value);
    else
      this.restoreData.controls['folder'].setValue(this.testBackupData.controls['folder'].value);
  }

  copyOptionsFromBackup(): void {
    this.restoreData.controls['options'].setValue(this.testBackupData.controls['options'].value);
  }

  copyOptionsFromMeta(): void {
    if (!this.getBackupMeta)
      return;
    this.restoreData.controls['options'].setValue(Object.values(this.getBackupMeta.backupTypes).filter((item) => item.state == true).map(a => a.name));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onGetBackupInfo(): void {
    if (this.getBackMetaBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.getBackMetaData.valid) {
      this.snackBar.open('Bitte Eingabefelder prüfen.', 'OK');
      return;
    }
    this.getBackMetaBusy = true;
    let folder = this.getBackMetaData.controls['folder'].value!.replace('\\', '/');
    this.getBackMetaOutput = 'Starte Abruf\r\n';
    this.getBackMetaOutput += `> restService.getBackupMetadata(${folder})\r\n`;
    try {
      this.restService.getBackupMetadata(folder).subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.getBackMetaOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.getBackMetaOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else if (response instanceof Error) {
          this.getBackMetaOutput += `Fehler ${response.message}\r\n`;
        } else {
          this.getBackMetaOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
        }
        this.getBackMetaBusy = false;
      });
    } catch (error) {
      this.getBackMetaOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.getBackMetaBusy = false;
    }

  }

  onRunServerBackup(): void {
    if (this.testBackupBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.testBackupData.valid) {
      this.snackBar.open('Bitte Eingabefelder prüfen.', 'OK');
      return;
    }
    this.testBackupBusy = true;
    let name = this.testBackupData.controls['name'].value!;
    let description = this.testBackupData.controls['description'].value!;
    let folder = this.testBackupData.controls['folder'].value!.replace('\\', '/');
    let options = this.testBackupData.controls['options'].value!;
    this.testBackupOutput = 'Starte Backup\r\n';
    try {
      this.restService.backupSyshub(name, description, folder, options).subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.testBackupOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.testBackupOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else if (response instanceof Error) {
          this.testBackupOutput += `Fehler ${response.message}\r\n`;
        } else {
          this.testBackupOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
        }
        this.testBackupBusy = false;
      });
    } catch (error) {
      this.testBackupOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.testBackupBusy = false;
    }

  }

  onPrepareRestoreDialog(): void {
    if (this.restoreBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.restoreData.valid) {
      this.snackBar.open('Bitte Eingabefelder prüfen.', 'OK');
      return;
    }
    let folder = this.restoreData.controls['folder'].value!.replace('\\', '/');
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Bestätigung erforderlich',
        description: `Das Wiederherstellen aus einem Backup ist unumkehrbar. Bitte bestätigen, dass das Backup "${folder}" wirklich wiederhergestellt werden soll.`,
        button1: 'Ausführen',
        button1Result: 'ACCEPT',
        button1Color: 'warn',
        button2: 'Abbrechen',
        button2Result: 'CANCEL',
        button2Color: '',
      },
      maxWidth: '480px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ACCEPT')
        this.onRunServerRestore();
    });
  }

  onRunServerRestore(): void {
    if (this.restoreBusy) {
      this.snackBar.open('Test läuft bereits, bitte warten.', 'OK');
      return;
    }
    if (!this.loggedin) {
      this.snackBar.open('Bitte zuerst einloggen (siehe Login testen)', 'OK');
      return;
    }
    if (!this.restoreData.valid) {
      this.snackBar.open('Bitte Eingabefelder prüfen.', 'OK');
      return;
    }
    this.restoreBusy = true;
    let folder = this.restoreData.controls['folder'].value!.replace('\\', '/');
    let options = this.restoreData.controls['options'].value!;
    this.restoreOutput = 'Starte Restore\r\n';
    this.restoreOutput += `> restService.restoreSyshub(${folder}, ${options})\r\n`;
    try {
      this.restService.restoreSyshub(folder, options).subscribe((response) => {
        if (response instanceof StatusNotExpectedError) {
          this.restoreOutput += `Fehler ${response.response.status}: ${response.message}\r\n`;
          this.restoreOutput += `Antwort:\r\n${JSON.stringify(response.response, null, 2)}\r\n`;
        } else if (response instanceof Error) {
          this.restoreOutput += `Fehler ${response.message}\r\n`;
        } else {
          this.restoreOutput += `Antwort:\r\n${JSON.stringify(response, null, 2)}\r\n`;
        }
        this.restoreBusy = false;
      });
    } catch (error) {
      this.restoreOutput += `> Fehler: ${(<Error>error).message}\r\n`;
      this.restoreBusy = false;
    }

  }

}
