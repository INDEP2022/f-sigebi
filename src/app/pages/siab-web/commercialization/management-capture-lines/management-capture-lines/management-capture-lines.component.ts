import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFC_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { managementCaptureLinesModalComponent } from '../management-capture-lines-modal/management-capture-lines-modal.component';
import { CAPTURA_LINES_COLUMNS } from './capture-lines-columns';

@Component({
  selector: 'app-management-capture-lines',
  templateUrl: './management-capture-lines.component.html',
  styles: [],
})
export class managementCaptureLinesComponent
  extends BasePage
  implements OnInit
{
  formSearch: FormGroup = new FormGroup({});
  formAdm: FormGroup = new FormGroup({});

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  eventList = new DefaultSelect<any>();
  idClient: number;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private capturelineService: CapturelineService,
    private comerClientsService: ComerClientsService
  ) {
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
    this.getPagination();
    this.getAdminCaptureLine(new ListParams());
  }

  private prepareFormSearch() {
    this.formSearch = this.fb.group({
      idEvent: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
      idClient: [null],
      rfc: [null, [Validators.pattern(RFC_PATTERN)]],
    });
  }

  private prepareFormAdm() {
    this.formAdm = this.fb.group({
      typeReference: [null, [Validators.required]],
      dateValidity: [null, [Validators.required, maxDate(new Date())]],
      allotment: [null, [Validators.required]],
      client: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      event: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      amountPenality: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  openModal(context?: Partial<managementCaptureLinesModalComponent>) {
    const modalRef = this.modalService.show(
      managementCaptureLinesModalComponent,
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
  getAdminCaptureLine(params: ListParams) {
    this.capturelineService.getAllAdminCaptureLine(params).subscribe({
      next: response => {
        this.eventList = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.eventList = new DefaultSelect([], 0, true);
      },
    });
  }
  searchLC() {
    if (
      this.formSearch.controls['idClient'].value != null ||
      this.formSearch.controls['rfc'].value != null
    ) {
      if (this.formSearch.controls['rfc'].value != null) {
        let idClients: any;
        idClients = Number(
          this.getClient(this.formSearch.controls['rfc'].value)
        );
        if (idClients.length > 0 && idClients.count > 1) {
          this.idClient = idClients.data[0].id;
          let data: any;
          data = this.getLC(
            this.formSearch.controls['idEvent'].value,
            this.formSearch.controls['allotment'].value,
            this.idClient
          );
          console.log(data);
        }
      } else if (this.formSearch.controls['idClient'].value != null) {
        let data: any;
        data = this.getLC(
          this.formSearch.controls['idEvent'].value,
          this.formSearch.controls['allotment'].value,
          this.formSearch.controls['idClient'].value
        );
        console.log(data);
      } else {
        this.alert(
          'warning',
          'Líneas de Captura',
          'El RFC que Ingreso tiene más de un Registro, no es Posible Realizar la Búsqueda'
        );
      }
    } else {
      this.alert(
        'warning',
        'Líneas de Captura',
        'Debe ingresar ID Cliente o RFC'
      );
    }
  }
  async getLC(idEvent: string, allotment: string, idClient: number) {
    return new Promise(async (res, rej) => {});
  }
  async getClient(rfc: string) {
    return new Promise(async (res, rej) => {
      let params = new ListParams();
      params['filter.rfc'] = rfc;
      this.comerClientsService.getAll(params).subscribe({
        next: resp => {
          res(resp);
        },
        error: eror => {
          res('0');
        },
      });
    });
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
