import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RestService } from 'syshub-rest-module';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent {

  activeRoute: string = '';
  loggedin: boolean = false;

  draweritems: DrawerItem[] = [
    { title: 'Startseite', icon: 'home', route: ['/home'] },
    { title: 'Login', icon: 'password', route: ['/tests/login'] },
    { title: 'Serverinfos abrufen', icon: 'download', route: ['/tests/getServerInformation'] },
    { title: 'Jobhandling', icon: 'developer_board', route: ['/tests/jobs'] },
    { title: 'Workflow ausführen', icon: 'play_circle', route: ['/tests/workflowExecutions'] },
    { title: 'Konsolenkommandos', icon: 'terminal', route: ['/tests/consoleCommands'] },
    { title: 'Backup & Restore', icon: 'cloud_sync', route: ['/tests/backupRestore'] },
  ];

  constructor(private restService: RestService, router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
    restService.isLoggedIn.subscribe((state) => this.loggedin = state);
  }

}

export interface DrawerItem {
  route: string[];
  title: string;
  icon: string;
}
