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
@Component({
  selector: 'app-pj-d-ea-c-issue-agreements',
  templateUrl: './pj-d-ea-c-issue-agreements.component.html',
  styleUrls: ['./pj-d-ea-c-issue-agreements.component.scss'],
})
export class PJDEAIssueAgreementsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  noBien: string = '';
  mostrarHistoricalSituationGoods: boolean = false;
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: {
        title: 'No. Bien',
      }, //*
      descripcion: {
        title: 'Descripción',
      },
      cantidad: {
        title: 'Cantidad',
      },
      estatus: {
        title: 'Estatus',
        type: 'custom',
        renderComponent: CustomRender,
      },
      fechaRecepcion: {
        title: 'Fecha de Recepción',
      },
      fechaAcuerdoInicial: {
        title: 'Fecha de Acuerdo Inicial',
      },
      diasEmitirResolucion: {
        title: 'Días para Emitir Resolución',
      },
      fechaAudiencia: {
        title: 'Fecha de Audiencia',
      },
      observacionesAcuerdoInicial: {
        title: 'Observaciones Acuerdo Inicial',
      },
      aceptaSuspencion: {
        title: 'Acepta Suspención',
      }, //*
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
      cantidad: 'Cantidad',
      estatus: 'Estatus',
      fechaRecepcion: 'Fecha de Recepción',
      fechaAcuerdoInicial: 'Fecha de Acuerdo Inicial',
      diasEmitirResolucion: 'Días para Emitir Resolución',
      fechaAudiencia: 'Fecha de Audiencia',
      observacionesAcuerdoInicial: 'Observaciones Acuerdo Inicial',
      aceptaSuspencion: 'Acepta Suspención',
    },
  ];

  paragraphs: Example[] = [];

  public form: FormGroup;
  public formDepositario: FormGroup;

  constructor(
    private fb?: FormBuilder,
    private eventEmitterService?: EventEmitterService
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
    this.loading = true;
  }

  public open(data: any) {
    if (data) {
      this.noBien = data.noBien;
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
