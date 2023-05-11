/** BASE IMPORT */
import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ViewCell } from 'ng2-smart-table';
import { Example } from 'src/app/core/models/catalogs/example';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

/** SERVICE IMPORTS */
import { DatePipe } from '@angular/common';
import { addDays, format } from 'date-fns';
import { BehaviorSubject, from, map, takeUntil } from 'rxjs';
import { DATE_FORMAT } from 'src/app/common/constants/data-formats/date.format';
import { getUser } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EventEmitterService } from './eventEmitter.service';

@Component({
  selector: 'my-row',
  template: `<span>{{ value }}</span>`,
})
export class CustomRender implements ViewCell {
  @Input() value: any; // This hold the cell value
  @Input() rowData: any;

  constructor(
    private eventEmitterService: EventEmitterService,
    private historyGoodService: HistoryGoodService
  ) {}
  @HostListener('click') onclick() {
    // console.log('CELL clicked', this.rowData);
    this.eventEmitterService.onFirstComponentButtonClick(this.rowData);
  }
}

/** CHECK COMPONENT */
@Component({
  selector: 'my-check',
  template: `
    <input type="checkbox" name="check" [checked]="this.isChecked" />
  `,
})
export class CheckboxComponent implements OnInit {
  @Input() value: any; // This hold the cell value
  @Input() rowData: any;
  isChecked: boolean;
  constructor(private eventEmitterService: EventEmitterService) {}
  ngOnInit(): void {
    if (this.value) {
      this.isChecked = true;
    }
  }
  @HostListener('change', ['$event']) changeListener(event: any) {
    // console.log('CELL clicked', this.rowData);
    this.eventEmitterService.onFirstComponentCheckClick({
      event,
      row: this.rowData,
    });
  }
}
@Component({
  selector: 'app-issue-agreements',
  templateUrl: './issue-agreements.component.html',
  styleUrls: ['./issue-agreements.component.scss'],
})
export class IssueAgreementsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  noBien: any;
  mostrarHistoricalSituationGoods: boolean = false;
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa prueba

    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
      }, //*
      description: {
        title: 'Descripción',
        sort: false,
      },
      quantity: {
        title: 'Cantidad',
        sort: false,
      },
      status: {
        title: 'Estatus',
        type: 'custom',
        renderComponent: CustomRender,
        sort: false,
      },
      physicalReceptionDate: {
        title: 'Fecha de Recepción',
        valuePrepareFunction: (cell: any, row: any) => {
          return format(new Date(row.physicalReceptionDate), DATE_FORMAT);
        },
        sort: false,
      },
      initialAgreementDate: {
        title: 'Fecha de Acuerdo Inicial',
        valuePrepareFunction: (cell: any, row: any) => {
          return row.expediente?.initialAgreementDate;
        },
        sort: false,
      },
      diasEmitirResolucion: {
        title: 'Días para Emitir Resolución',
        valuePrepareFunction: (cell: any, row: any) => {
          return format(
            addDays(new Date(row.physicalReceptionDate), 90),
            DATE_FORMAT
          );
        },
        sort: false,
      },
      audienceRevRecDate: {
        title: 'Fecha de Audiencia',
        sort: false,
      },
      revRecObservations: {
        title: 'Observaciones Acuerdo Inicial',
        sort: false,
      },
      aceptaSuspencion: {
        title: 'Acepta Suspención',
        sort: false,
      }, //*
    },
  };
  // Data table
  dataTable: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: Example[] = [];
  totalItems = 0;
  showSearchForm: boolean = false;
  // searchForm: ModelForm<IGood>;
  goodTypes = new DefaultSelect();
  goodDescriptions = new DefaultSelect();
  goodEstatus = new DefaultSelect();

  public form: FormGroup;
  public formDepositario: FormGroup;
  public searchForm: FormGroup;

  get goodId() {
    return this.searchForm.get('goodId');
  }
  get description() {
    return this.searchForm.get('description');
  }
  get statu() {
    return this.searchForm.get('status');
  }
  get physicalReceptionDate() {
    return this.searchForm.get('physicalReceptionDate');
  }

  constructor(
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService,
    private goodService: GoodService,
    private statusGoodService: StatusGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar =
        this.eventEmitterService.invokeFirstComponentFunction.subscribe(
          (name: string) => {
            this.open(name);
          }
        );
    }
    this.prepareForm();
    this.getData();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
    this.loading = true;
  }
  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        this.goodService
          .update({
            id: parseInt(data.row.id),
            goodId: parseInt(data.row.goodId),
            statusResourceReview: 'ACEPTADO RECURSO DE REVISION',
          })
          .subscribe({
            next: datagod => {
              this.createLogs(data.row);
            },
          });
      },
    });
  }
  public createLogs(dataLog: any) {
    console.log(dataLog);

    const params = {
      propertyNum: parseInt(dataLog.id),
      status: dataLog.status ? dataLog.status : '',
      changeDate: new Date(),
      userChange: getUser(),
      statusChangeProgram: 'FACTJUREMISIONACU',
      reasonForChange: 'Automatico',
    };
    // this.historyGoodService.create(params).subscribe(data => { });
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      nombramiento: ['', [Validators.required]], //*
      fecha: ['', [Validators.required]], //*
    });
    this.searchForm = this.fb.group({
      goodId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]], //*
      description: [null],
      status: [null],
      physicalReceptionDate: [null],
    });
    this.formDepositario = this.fb.group({
      idDepositario: ['', [Validators.required]], //*
      depositario: ['', [Validators.required]], //*
      procesar: ['', [Validators.required]], //* SI/NO
      fechaEjecucion: ['', [Validators.required]], //*
    });
  }
  private getData() {
    let data: any[] = [];
    this.loading = true;
    // this.params.value.addFilter('statusResourceReview',"DICTAMINADO RECURSO DE REVISION",SearchFilter.ILIKE);

    const filter = this.params.getValue().getParams();
    const filterdefault = `${filter}&filter.statusResourceReview=$ilike:DICTAMINADO RECURSO DE REVISION`;
    console.log(filterdefault);

    this.goodService.getAllFilter(filterdefault).subscribe({
      next: val => {
        this.totalItems = val.count;
        from(val.data)
          .pipe(
            map(value => {
              if (value.status) {
                this.statusGoodService.getById(value.status).subscribe({
                  next: val => {
                    value.status = val['description'];
                  },
                });
              }
              return value;
            })
          )
          .subscribe({
            next: (value: any) => {
              value.acceptSuspension = false;
              data.push(value);
              if (data.length == val.data.length) {
                setTimeout(() => {
                  this.dataTable = [...data];
                  console.log(this.dataTable);
                  this.loading = false;
                }, 500);
              }
            },
          });
      },
      error: e => {
        this.message('info', 'Error', 'No se encontraron registros');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        // console.log('',this.dataTable)
      },
    });
  }
  getGoodTypeSelect(params: ListParams) {
    let param = `filter.description=$ilike:${params.text}`;
    this.goodService.getAllFilter(param).subscribe({
      next: resp => {
        this.goodDescriptions = new DefaultSelect(resp.data, resp.count);
      },
    });
  }
  getGoodStatusSelect(params?: ListParams) {
    this.statusGoodService.getAll().subscribe({
      next: val => {
        this.goodEstatus = new DefaultSelect(val.data, val.data.length);
      },
    });
  }
  clean() {
    this.dataTable = [];
    this.searchForm.reset();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.getData();
  }
  search() {
    if (
      this.physicalReceptionDate.value != null ||
      this.description.value != null ||
      this.statu.value != null ||
      this.goodId.value != null
    ) {
      this.paginator();
    } else {
      this.message('info', 'Error', 'Debe llenar algun filtro.');
    }
  }
  paginator() {
    this.buildFilters();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }
  buildFilters() {
    var form = this.searchForm.getRawValue();
    this.params.getValue().removeAllFilters();
    for (const key in form) {
      if (form[key] !== null) {
        if (key === 'physicalReceptionDate') {
          form[key] = new DatePipe('en-EN').transform(form[key], 'dd/MM/yyyy');
        }
        this.params.value.addFilter(key, form[key]);
      }
    }
  }

  public open(data: any) {
    if (data) {
      this.noBien = { noBien: data.goodId, descripcion: data.description };
      this.mostrarHistoricalSituationGoods = true;
    }
  }

  public btnClose() {
    this.noBien = '';
    this.mostrarHistoricalSituationGoods = false;
  }

  mostrarInfo(form: FormGroup): any {
    console.log(form.value);
  }
  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  mostrarInfoDepositario(formDepositario: FormGroup): any {
    console.log(formDepositario.value);
  }
}
