import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-content">
      <div class="modal-header mb-3">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="modal-body">
        <ng-content select="[body]"></ng-content>
      </div>
      <div>
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
})
export class ModalComponent {}
