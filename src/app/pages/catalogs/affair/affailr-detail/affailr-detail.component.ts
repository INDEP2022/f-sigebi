import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-affailr-detail',
  templateUrl: './affailr-detail.component.html',
  styles: [],
})
export class AffailrDetailComponent implements OnInit {
  title: string = 'Asunto';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
