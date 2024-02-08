import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  @Input() closable: boolean = false;
  @Input() icon?: string;
  @Input() variant: string = 'info';
  @Output() close = new EventEmitter<null>();

  onCloseClicked(): void {
    this.close.emit();
  }

}
