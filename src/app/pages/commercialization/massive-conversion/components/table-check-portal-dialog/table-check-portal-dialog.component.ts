import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-table-check-portal-dialog',
  templateUrl: './table-check-portal-dialog.component.html',
  styleUrls: ['./table-check-portal-dialog.component.css'],
})
export class TableCheckPortalDialogComponent implements OnInit {
  constructor(private modalRef: BsModalRef) {}

  list: {
    records: number;
    amount: number;
    createdBy: string;
  }[] = [];

  ngOnInit() {
    console.log(this.list);
  }

  close() {
    this.modalRef.hide();
  }
}
