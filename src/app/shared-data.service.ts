import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private hideOpenConsoleHint$ = new BehaviorSubject<boolean>(false);
  public hideOpenConsoleHint = this.hideOpenConsoleHint$.asObservable();

  constructor() {
    let oldstate: string | null | SharedData = sessionStorage.getItem("@shareddata");
    if (oldstate != null) {
      oldstate = <SharedData>JSON.parse(oldstate);
      this.hideOpenConsoleHint$.next(oldstate.toggleHideOpenConsoleHint);
    }
    this.hideOpenConsoleHint.subscribe(() => this.save());
  }

  private save(): void {
    sessionStorage.setItem("@shareddata", JSON.stringify({
      toggleHideOpenConsoleHint: this.hideOpenConsoleHint$.value
    }));
  }

  public toggleHideOpenConsoleHint(): void {
    this.hideOpenConsoleHint$.next(!this.hideOpenConsoleHint$.value);
  }

}

export interface SharedData {
  toggleHideOpenConsoleHint: boolean;
}
