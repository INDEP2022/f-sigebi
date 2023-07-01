import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared';
import { clearGoodCheck, goodCheck, REQUESTS_COLUMNS_MODAL } from './columns';

@Component({
  selector: 'app-modal-request',
  templateUrl: './modal-request.component.html',
  styles: [],
})
export class ModalRequestComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private modalRef: BsModalRef,
    private readonly numeraryService: NumeraryService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUESTS_COLUMNS_MODAL,
    };
    //this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeEnc());
  }

  getRequestNumeEnc() {
    this.loading = true;
    this.numeraryService
      .getNumeraryRequestNumeEnc(this.params.getValue())
      .subscribe({
        next: resp => {
          console.log(resp.data);
          this.data1 = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
        },
      });
  }

  close() {
    clearGoodCheck();
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.alert('success', 'Registro de inventario', `${message} correctamente`);
    this.loading = false;
    this.modalRef.content.callback(goodCheck);
    clearGoodCheck();
    this.modalRef.hide();
  }

  confirm() {
    this.modalRef.content.callback(goodCheck);
    clearGoodCheck();
    this.modalRef.hide();
  }
}
