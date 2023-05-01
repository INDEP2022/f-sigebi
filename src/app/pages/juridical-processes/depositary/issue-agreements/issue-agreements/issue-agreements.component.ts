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

/** SERVICE IMPORTS */
import { addDays, format } from 'date-fns';
import { BehaviorSubject, from, map, takeUntil } from 'rxjs';
import { DATE_FORMAT } from 'src/app/common/constants/data-formats/date.format';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { EventEmitterService } from './eventEmitter.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

/** CELL COMPONENT */
@Component({
  selector: 'my-row',
  template: `<span>{{ value }}</span>`,
})
export class CustomRender implements ViewCell {
  @Input() value: any; // This hold the cell value
  @Input() rowData: any;

  constructor(private eventEmitterService: EventEmitterService) {}
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
      acceptSuspension: {
        title: 'Acepta Suspención',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxComponent,
      }, //*
    },
  };
  // Data table
  dataTable: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: Example[] = [];
  totalItems = 0;
  public form: FormGroup;
  public formDepositario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService,
    private goodService: GoodService,
    private statusGoodService: StatusGoodService,
    private historicGoodService: HistoryGoodService,
    private authService: AuthService
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
    if (this.eventEmitterService.subsCheck == undefined) {
      this.eventEmitterService.subsCheck =
        this.eventEmitterService.invokeSecondComponentFunction.subscribe({
          next: ({ event, row }: any) => {
            if (
              event.target.checked &&
              row.statusResourceReview == 'DICTAMINADO RECURSO DE REVISION'
            ) {
              let document: IHistoryGood = {
                changeDate: new Date(),
                propertyNum: row.goodId,
                reasonForChange: 'Automatico',
                statusChangeProgram: 'FACTJUREMISIONACU',
                status: row.status,
                userChange: this.authService.decodeToken().sub,
                extDomProcess: '',
                registryNum: '',
              };
              this.historicGoodService.create(document).subscribe({
                next: () => {
                  this.alert(
                    'success',
                    'Registrado Correctamente.',
                    'El registro fue exitoso.'
                  );
                },
              });
            }
          },
        });
    }
    this.prepareForm();
    this.getData();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
    this.loading = true;
  }

  private getData() {
    let data: any[] = [];
    this.loading = true;
    let params = `limit=${this.params.value.limit}&page=${this.params.value.page}`;
    this.goodService.getAllFilter(params).subscribe({
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
                  console.log(data);
                  this.dataTable = [...data];
                  this.loading = false;
                }, 500);
              }
            },
          });
      },
      complete: () => {},
    });
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

  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      nombramiento: ['', [Validators.required]], //*
      fecha: ['', [Validators.required]], //*
    });
    this.formDepositario = this.fb.group({
      idDepositario: ['', [Validators.required]], //*
      depositario: ['', [Validators.required]], //*
      procesar: ['', [Validators.required]], //* SI/NO
      fechaEjecucion: ['', [Validators.required]], //*
    });
  }

  mostrarInfo(form: FormGroup): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: FormGroup): any {
    console.log(formDepositario.value);
  }
}
