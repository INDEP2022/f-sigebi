import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-new-can-relusu',
  templateUrl: './new-can-relusu.component.html',
  styleUrls: [],
})
export class NewCanRelusuComponent extends BasePage implements OnInit {
  constructor(private bsModal: BsModalRef) {
    super();
  }

  ngOnInit(): void {}

  close() {
    this.bsModal.hide();
  }
}
