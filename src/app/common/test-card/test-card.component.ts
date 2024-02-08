import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PermissionsItem } from 'src/app/perm/permissions/permissions';

@Component({
  selector: 'app-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss']
})
export class TestCardComponent {
  @Input() busy: boolean = false;
  @Input() consoleOutput: string = '';
  @Input() resultMessage: string = '';
  @Input() permission?: PermissionsItem;
  @Input() title: string = '';
  @Output() clickStartBtn: EventEmitter<any> = new EventEmitter();

  onClickButton() {
    this.clickStartBtn.emit();
  }
}
