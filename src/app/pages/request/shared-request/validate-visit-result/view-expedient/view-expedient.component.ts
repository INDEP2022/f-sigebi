import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-expedient',
  templateUrl: './view-expedient.component.html',
  styles: [],
})
export class ViewExpedientComponent implements OnInit {
  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
