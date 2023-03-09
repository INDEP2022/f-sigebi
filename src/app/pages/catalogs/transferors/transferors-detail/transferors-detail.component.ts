import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-transferors-detail',
  templateUrl: './transferors-detail.component.html',
  styles: [],
})
export class TransferorsDetailComponent implements OnInit {
  title: string = 'Transferente por estado';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
