import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerLotService } from 'src/app/core/services/ms-prepareevent/comer-lot.service';
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
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  maxDate = new Date();
  eventList = new DefaultSelect<any>();
  idClient: number;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private capturelineService: CapturelineService,
    private comerClientsService: ComerClientsService,
    private comerLotService: ComerLotService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...CAPTURA_LINES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //this.resetTable2();
          this.getData();
        }
      });
    this.prepareFormSearch();
    this.prepareFormAdm();
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
      dateValidity: [null, [Validators.required, minDate(new Date())]],
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
    let data = {
      idEventIn: this.formSearch.controls['idEvent'].value,
      publicLotIn: this.formSearch.controls['allotment'].value,
      idClientIn:
        this.idClient == 0
          ? this.formSearch.controls['idClient'].value
          : this.idClient,
    };
    this.capturelineService.getPaConsultLc(data).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: eror => {
        this.alert(
          'warning',
          'No se encontraron registros con ese filtrado',
          ''
        );
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  getAdminCaptureLine(params: ListParams) {
    if (params.text != null && params.text != '') {
      delete params['search'];
      params['filter.id_evento'] = `$eq:${params.text}`;
    }
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
    this.idClient = 0;
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
          this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
            this.getData();
          });
        }
      } else if (this.formSearch.controls['idClient'].value != null) {
        this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
          this.getData();
        });
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
  async accept() {
    if (this.formAdm.controls['typeReference'].value == 'GSE') {
      this.alert(
        'warning',
        'Atención',
        'No es posible generar lineas de captura de Garantias de Seriedad'
      );
      return;
    }
    let idLot: any = await this.getLotId(
      this.formAdm.controls['event'].value,
      this.formAdm.controls['allotment'].value
    );
    this.registerLC(idLot);
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
  async getLotId(event: string, lot: string) {
    return new Promise(async (res, rej) => {
      let params = new ListParams();
      params['filter.eventId'] = event;
      params['filter.publicLot'] = lot;
      this.comerLotService.getAllFilter(params).subscribe({
        next: resp => {
          console.log(resp.data[0].id);
          res(resp.data[0].id);
        },
        error: eror => {
          res('0');
        },
      });
    });
  }
  registerLC(idLot: string) {
    let data = {
      P_ID_LOTE: idLot,
      P_ID_CLIENTE: this.formAdm.controls['client'].value,
      P_PARAMETRO: this.formAdm.controls['typeReference'].value,
      P_MONTO: this.formAdm.controls['amount'].value,
      P_IND_MOV: 'C',
      P_FECVIGENCIA: this.formAdm.controls['dateValidity'].value,
      P_MONTO_PENA: this.formAdm.controls['amountPenality'].value,
    };
    this.capturelineService.postSpGenIc2(data).subscribe({
      next: resp => {
        this.alert('success', 'Datos Registrados', '');
        this.formAdm.reset();
        this.searchLC();
      },
      error: eror => {
        this.alert(
          'warning',
          'No se Registraron los datos volver a intentarlo',
          ''
        );
      },
    });
  }
}
