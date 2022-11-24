import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { SwComerCManagementCaptureLinesModalComponent } from '../sw-comer-c-management-capture-lines-modal/sw-comer-c-management-capture-lines-modal.component';
import { CAPTURA_LINES_COLUMNS } from './capture-lines-columns';

@Component({
  selector: 'app-sw-comer-c-management-capture-lines',
  templateUrl: './sw-comer-c-management-capture-lines.component.html',
  styles: [],
})
export class SwComerCManagementCaptureLinesComponent
  extends BasePage
  implements OnInit
{
  formSearch: FormGroup = new FormGroup({});
  formAdm: FormGroup = new FormGroup({});

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...CAPTURA_LINES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareFormSearch();
    this.prepareFormAdm();
  }

  private prepareFormSearch() {
    this.formSearch = this.fb.group({
      idEvent: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
      idClient: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
    });
  }

  private prepareFormAdm() {
    this.formAdm = this.fb.group({
      typeReference: [null, [Validators.required]],
      dateValidity: [null, [Validators.required, maxDate(new Date())]],
      allotment: [null, [Validators.required]],
      client: [null, [Validators.required]],
      event: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      amountPenality: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<SwComerCManagementCaptureLinesModalComponent>) {
    const modalRef = this.modalService.show(
      SwComerCManagementCaptureLinesModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      id: 1,
      allotment: '1651',
      amount: '$100,000.00',
      status: 'Disponible',
      type: 'Venta',
      reference: 'Referencia 01',
      dateValidity: '10/10/2022',
      rfc: 'xxxx0000',
      idClient: '15',
      client: 'Marío',
      penalty: 'No',
      note: 'Sin observaciones',
    },
  ];
}
