import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'open-console-hint',
  templateUrl: './open-console-hint.component.html',
  styleUrls: ['./open-console-hint.component.scss']
})
export class OpenConsoleHintComponent implements OnDestroy {

  closed: boolean = false;
  sub?: Subscription;

  constructor(private dataservice: SharedDataService) {
    this.sub = this.dataservice.hideOpenConsoleHint.subscribe((state) => this.closed = state);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onCloseClicked(): void {
    this.dataservice.toggleHideOpenConsoleHint();
  }

}
