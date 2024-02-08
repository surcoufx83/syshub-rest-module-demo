import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent {
  @Input() title!: string;
  @Input() permissionSets!: string[];
  @Input() roles!: string[];
}
