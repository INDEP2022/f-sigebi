import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-good-table-detail-button',
  templateUrl: './good-table-detail-button.component.html',
  styleUrls: ['./good-table-detail-button.component.scss'],
})
export class GoodTableDetailButtonComponent implements OnInit {
  constructor(private modalRef: BsModalRef) {}

  ngOnInit() {}

  confirm() {
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
