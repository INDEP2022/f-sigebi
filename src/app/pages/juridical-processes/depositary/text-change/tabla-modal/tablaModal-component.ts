import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TEXT_CHANGE_COLUMNS } from './tablaModalColumns';

@Component({
  selector: 'app-textModal-table',
  templateUrl: './tablaModal-component.html',
})
export class tablaModalComponent extends BasePage implements OnInit {
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;
  filterParams: BehaviorSubject<FilterParams>;
  form: FormGroup = new FormGroup({});
  title: string;
  data: any[] = [];
  totalItems: number;

  @ViewChild('table') table: Ng2SmartTableComponent;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private dictationService: DictationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: TEXT_CHANGE_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.title = '  Seleccione el número de expediente ';
    this.lookDictamenesByDictamens();
  }

  close() {
    this.modalRef.hide();
  }

  getDataColumn(event: any) {
    this.handleSuccess(event);
    this.modalRef.hide();
  }

  lookDictamenesByDictamens() {
    this.dictationService
      .findByIdsOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('lookDictamenesByDictamens this.data => ' + this.data);
          this.data = resp.data;
        },
        error: err => {
          console.log(
            'lookDictamenesByDictamens this.data => ' + err.error.message
          );
          this.onLoadToast('error', 'error', 'No existen registros ');
        },
      });
  }

  handleSuccess(datos: []) {
    this.modalRef.content.callback(datos);
    this.modalRef.hide();
  }
}
