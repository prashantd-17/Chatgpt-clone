import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateServiceService {

  constructor() { }

   collapsed = signal(false);

  toggleCollapse() {
    this.collapsed.update(v => !v);
  }

  setCollapse(val: boolean) {
    this.collapsed.set(val);
  }
}
