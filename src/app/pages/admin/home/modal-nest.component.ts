import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  template: `
    <div class="modal-header">
      <h4 id="dialog-nested-name3" class="modal-title pull-left">
        {{ dataChild }}
      </h4>
      <button
        type="button"
        class="btn-close close pull-right"
        aria-label="Close"
        (click)="childModal.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      This is third modal <br />
      Click <b>&times;</b> to close modal.
    </div>
  `,
})
export class ModalNestedComponent {
  dataChild: string;
  constructor(public childModal: BsModalRef) {}
}
