import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
//Models
//Services

@Component({
  selector: 'app-representatives-modal',
  templateUrl: './representatives-modal.component.html',
  styles: [],
})
export class RepresentativesModalComponent implements OnInit {
  title: string = 'Representante';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
