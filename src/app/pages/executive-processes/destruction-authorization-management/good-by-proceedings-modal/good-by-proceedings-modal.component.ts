import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-good-by-proceedings-modal',
  templateUrl: './good-by-proceedings-modal.component.html',
  styles: [],
})
export class GoodByProceedingsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'BIENES POR ACTA';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
  }

  update() {
    this.loading = true;
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
