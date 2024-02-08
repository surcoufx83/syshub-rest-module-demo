import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RestService, RestSettings, Settings, SyshubInterceptor } from 'syshub-rest-module';
import { AlertComponent } from './alert/alert.component';
import { NotLoggedInComponent } from './alert/not-logged-in/not-logged-in.component';
import { OpenConsoleHintComponent } from './alert/open-console-hint/open-console-hint.component';
import { AppComponent } from './app.component';
import { TestCardComponent } from './common/test-card/test-card.component';
import { ConfirmDialog } from './dialogs/confirm-dialog/confirm-dialog.component';
import { H2Component } from './h2/h2.component';
import { HomeComponent } from './home/home.component';
import { PermissionsComponent } from './perm/permissions/permissions.component';
import { SharedDataService } from './shared-data.service';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';
import { BackupRestoreComponent } from './tests/backup-restore/backup-restore.component';
import { ConsoleComponent } from './tests/console/console.component';
import { GetServerInformationComponent } from './tests/get-server-information/get-server-information.component';
import { JobsComponent } from './tests/jobs/jobs.component';
import { LoginMinComponent } from './tests/login-min/login-min.component';
import { LoginComponent } from './tests/login/login.component';
import { WorkflowExecutionsComponent } from './tests/workflow-executions/workflow-executions.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tests/backupRestore', component: BackupRestoreComponent },
  { path: 'tests/consoleCommands', component: ConsoleComponent },
  { path: 'tests/getServerInformation', component: GetServerInformationComponent },
  { path: 'tests/jobs', component: JobsComponent },
  { path: 'tests/login', component: LoginComponent },
  { path: 'tests/workflowExecutions', component: WorkflowExecutionsComponent },
  { path: 'login-min', component: LoginMinComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    BackupRestoreComponent,
    ConsoleComponent,
    GetServerInformationComponent,
    H2Component,
    HomeComponent,
    JobsComponent,
    LoginComponent,
    NotLoggedInComponent,
    OpenConsoleHintComponent,
    PermissionsComponent,
    SideDrawerComponent,
    TestCardComponent,
    WorkflowExecutionsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ConfirmDialog,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: Settings, multi: false, useValue: new Settings(<RestSettings>(environment.syshub)) },
    { provide: RestService, multi: false, deps: [Settings, HttpClient] },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: SyshubInterceptor, deps: [Settings, RestService] },
    { provide: SharedDataService, multi: false },
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
