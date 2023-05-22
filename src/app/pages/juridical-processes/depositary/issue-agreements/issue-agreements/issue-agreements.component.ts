/** BASE IMPORT */
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
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
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Estatus } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
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
  @ViewChild('df', { static: false }) histo: ElementRef<HTMLElement>;
  noBien: any;
  mostrarHistoricalSituationGoods: boolean = false;

  tableSettings = {
    actions: {
      columnTitle: 'Acciones',
      add: false,
      edit: true,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa prueba
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
    private statusGoodService: StatusGoodService,
    private historyService: HistoryGoodService,
    private user: AuthService,
    private screenServ: StatusXScreenService
  ) {
    super();

    this.settings.columns = {
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
          return row.physicalReceptionDate
            ? row.physicalReceptionDate
                .split('T')[0]
                .split('-')
                .reverse()
                .join('-')
            : ''; //format(new Date(row.physicalReceptionDate), 'yyyy-MM-dd');
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
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            data.row.aceptaSuspencion = data.toggle ? 'SI' : 'NO';
          });
        },
      }, //*
    };
    this.settings.actions = {
      add: false,
      edit: true,
      delete: false,
      columnTitle: 'Acciones',
    };
  }

  async updateHistory(data: any) {
    if (
      data.aceptaSuspencion == 'SI' &&
      data.statusResourceReview == 'DICTAMINADO RECURSO DE REVISION'
    ) {
      const stateFinally = await new Promise((resolve, reject) => {
        const params = new FilterParams();
        params.addFilter('screenKey', 'FACTJUREMISIONACU', SearchFilter.EQ);
        params.addFilter('status', data.status, SearchFilter.EQ);

        this.screenServ.getList(params.getParams()).subscribe({
          next: data => {
            resolve(data.data[0]);
          },
          error: () => {
            resolve(null);
          },
        });
      });

      if (!stateFinally) return;

      const user = this.user.decodeToken();
      const params = {
        propertyNum: parseInt(data.id),
        status: data.status,
        changeDate: new Date(),
        userChange: user.name.toUpperCase(),
        statusChangeProgram: 'FACTJUREMISIONACU',
        reasonForChange: 'Automatico',
      };

      this.historyService.create(params).subscribe({
        next: () => {
          this.onLoadToast('success', 'Ha sido actualizado', '');
        },
      });
    } else {
      this.onLoadToast(
        'info',
        'Estatus recurso revisión no es "Dictaminado recurso de revisión"'
      );
    }
  }

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar =
        this.eventEmitterService.invokeFirstComponentFunction.subscribe(
          (name: string) => {
            this.mostrarHistoricalSituationGoods = false;
            this.open(name);
          }
        );
    }
    this.prepareForm();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.dataTable.length > 0 ? this.getData() : '';
    });
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
    const table = document.getElementById('table').children[0].children[1];
    // this.params.value.addFilter('statusResourceReview',"DICTAMINADO RECURSO DE REVISION",SearchFilter.ILIKE);
    // const filterdefault = `${filter}&filter.statusResourceReview=$ilike:DICTAMINADO RECURSO DE REVISION`;

    this.goodService
      .getAllFilter(this.params.getValue().getParams())
      .subscribe({
        next: val => {
          this.totalItems = val.count;
          this.dataTable = [...val.data];
          this.loading = false;

          from(val.data)
            .pipe(
              map(value => {
                if (value.status) {
                  this.statusGoodService.getById(value.status).subscribe({
                    next: val => {
                      value.estatus = {} as Estatus;
                      value.estatus.descriptionStatus = val['description'];
                    },
                  });
                }
                return value;
              })
            )
            .subscribe({
              next: (value: any) => {
                value.di_disponible =
                  value.statusResourceReview ==
                  'DICTAMINADO RECURSO DE REVISION'
                    ? 'S'
                    : 'N';
                value.aceptaSuspencion = '';
                data.push(value);
                if (data.length == val.data.length) {
                  setTimeout(() => {
                    this.dataTable = [...data];
                    this.loading = false;

                    const time2 = setTimeout(() => {
                      this.dataTable.map((amp, i) => {
                        amp.di_disponible == 'S'
                          ? table.children[i].classList.add(
                              'bg-success',
                              'text-white'
                            )
                          : '';
                      });
                      clearTimeout(time2);
                    }, 500);
                  }, 500);
                }
              },
            });
        },
        error: e => {
          this.message('info', 'No se encontraron registros', '');
          this.loading = false;
          this.dataTable = [];
          this.totalItems = 0;
        },
        complete: () => {
          this.loading = false;
          // console.log('',this.dataTable)
        },
      });
  }

  checkDate(date: Date) {
    if (date) {
      const time1 = date.valueOf();
      const now = new Date().valueOf();

      console.log(date.valueOf());
    }

    // if ()
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
    this.mostrarHistoricalSituationGoods = false;
    this.searchForm.reset();
    this.params.getValue().removeAllFilters();
    this.params.getValue().page = 1;
    this.totalItems = 0;
  }
  search() {
    if (
      this.physicalReceptionDate.value != null ||
      this.description.value != null ||
      this.statu.value != null ||
      this.goodId.value != null
    ) {
      this.mostrarHistoricalSituationGoods = false;
      this.paginator();
    } else {
      this.message('info', 'Debe llenar algun filtro.', '');
    }
  }
  paginator() {
    this.buildFilters();
    this.params.getValue().page = 1;
    this.getData();
  }
  buildFilters() {
    var form = this.searchForm.getRawValue();
    this.params.getValue().removeAllFilters();
    for (const key in form) {
      if (form[key]) {
        if (key === 'physicalReceptionDate') {
          form[key] = new DatePipe('en-EN').transform(form[key], 'yyyy-MM-dd');
          this.params.value.addFilter(key, form[key]);
        } else if (key === 'description') {
          this.params.value.addFilter(key, form[key], SearchFilter.ILIKE);
        } else {
          this.params.value.addFilter(key, form[key]);
        }
      }
    }
  }

  public open(data: any) {
    if (data) {
      this.noBien = { noBien: data.goodId, descripcion: data.description };
      const time = setTimeout(() => {
        this.mostrarHistoricalSituationGoods = true;
        this.histo.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        clearTimeout(time);
      }, 500);
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

  render(ev: any) {
    if (this.dataTable.length > 0) {
      setTimeout(() => {
        const table = document.getElementById('table').children[0].children[1];
        this.dataTable.map((amp, i) => {
          amp.di_disponible == 'S'
            ? table.children[i].classList.add('bg-success', 'text-white')
            : '';
        });
      }, 100);
    }
  }
}
