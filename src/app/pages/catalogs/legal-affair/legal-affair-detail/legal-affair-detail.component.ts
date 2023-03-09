import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-legal-affair-detail',
  templateUrl: './legal-affair-detail.component.html',
  styles: [],
})
export class LegalAffairDetailComponent implements OnInit {
  title: string = 'Asunto Jurídico';
  edit: boolean = false;
  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
