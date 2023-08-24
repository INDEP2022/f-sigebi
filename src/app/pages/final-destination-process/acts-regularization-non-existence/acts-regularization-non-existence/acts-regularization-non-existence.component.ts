import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';
import { COLUMNS1 } from './columns1';
import { ModalMantenimientoEstatusActComponent } from './modal-mantenimiento-estatus-act/modal-mantenimiento-estatus-act.component';

@Component({
  selector: 'app-acts-regularization-non-existence',
  templateUrl: './acts-regularization-non-existence.component.html',
  styles: [],
})
export class ActsRegularizationNonExistenceComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  formTable1: FormGroup;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  totalItems1: number = 0;
  totalItems2: number = 0;
  settings2: any;
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  dataTabla2: any[] = [];
  bienSelecionado: any = {};
  bienSelecionado2: any = {};
  actaSelected: string = '';
  actaActual: any[] = [];

  listaActas: any[] = [];
  statusActa: String = '';
  expedienteBuscado: number = 0;

  constructor(
    private fb: FormBuilder,
    private proceedingsDelivery: ProceedingsDeliveryReceptionService,
    private goodsService: GoodService,
    private modalService: BsModalService,
    private goodprocessService: GoodProcessService,
    private expedientService: ExpedientService,
    private proceedingsDetailDelivery: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      rowClassFunction: (row: any) => {
        if (row.data.disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-danger text-white';
        }
      },
    };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS1;
  }

  ngOnInit(): void {
    this.initForm();
    this.startCalendars();

    this.params1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      console.log(
        'Dentro del pide de params1, el expediente buscado es: ',
        this.expedienteBuscado
      );
      this.getGoods(this.expedienteBuscado);
    });

    this.data2.load(this.dataTabla2);
  }

  search(event: any) {
    console.log(event);
    this.expedienteBuscado = event;

    this.proceedingsDelivery.getProceeding(event).subscribe({
      next: data => {
        console.log(data);
        this.response = true;
        this.alert(
          'success',
          'Expediente Encontrado',
          'El expediente ha sido encontrado'
        );

        this.listaActas = data.data;
        this.getGoods(event, data.data[0].id);
      },
      error: err => {
        console.log(err);
        this.alert('error', 'Error', 'El expediente ingresado no existe');
        this.response = false;
        return;
      },
    });

    this.expedientService.getById(event).subscribe({
      next: (data: any) => {
        console.log(data);
        this.form.controls['preliminaryAscertainment'].setValue(
          data.preliminaryInquiry
        );
        this.form.controls['causePenal'].setValue(data.criminalCase);
      },
      error: err => console.log(err),
    });
  }

  onCambioActa(event: any) {
    let actaSeleccionada = event.target.value;
    this.actaSelected = event.target.value;
    console.log(event.target.value);

    console.log(this.listaActas);
    const elemento: any = this.listaActas.filter(
      data => data.id == actaSeleccionada
    );

    console.log(elemento);
    this.statusActa = elemento[0].statusProceedings;

    this.form.controls['type'].setValue(elemento[0].typeProceedings);
    this.form.controls['witness1'].setValue(elemento[0].witness1);
    this.form.controls['witness2'].setValue(elemento[0].witness2);
    this.form.controls['folioScan'].setValue(elemento[0].universalFolio);
    this.form.controls['observations'].setValue(elemento[0].observations);
    this.form.controls['caseNumb'].setValue(elemento[0].comptrollerWitness);
    this.form.controls['sessionNumb'].setValue(elemento[0].destructionMethod);
    this.form.controls['del'].setValue(elemento[0].receiveBy);
    this.form.controls['trans'].setValue(elemento[0].numTransfer.key || null);
    this.form.controls['folio'].setValue(elemento[0].numeraryFolio);
    this.form.controls['elabDate'].setValue(elemento[0].elaborationDate);
    this.form.controls['responsible'].setValue(elemento[0].responsible);
    this.form.controls['act'].setValue(elemento[0].id);
  }

  initForm() {
    this.form = this.fb.group({
      preliminaryAscertainment: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      causePenal: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      actSelect: [null, [Validators.required]],
      type: [null],
      del: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      elabDate: [null, [Validators.required]],
      authorization: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      sessionNumb: [null, [Validators.required, Validators.maxLength(200)]],
      caseNumb: [null, [Validators.required, Validators.maxLength(100)]],
      folioScan: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      responsible: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      witness1: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      witness2: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      observations: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
  }

  onSubmit() {
    if (this.statusActa === 'CERRADA') {
      this.alert('warning', 'Atención', 'El acta ya esta cerrada.');
      this.form.reset();
      return;
    } else {
      this.cerrarActa(this.actaSelected);

      this.form.reset();
    }
  }

  expedientChange() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  getDisponible(goodNumber: number) {
    return new Promise((res, _rej) => {
      const model = {
        vcScreen: 'FACTDESACTASRIF',
        goodNumber,
      };
      this.goodprocessService.getDisponible(model).subscribe({
        next: response => {
          res('S');
        },
        error: err => {
          res('N');
        },
      });
    });
  }

  getGoods(id: number, actaRecibida?: any) {
    this.loading = true;

    const params1 = {
      ...this.params1.getValue(),
    };

    console.log(actaRecibida);

    this.goodsService.getByExpedient_(id, params1).subscribe({
      next: async data => {
        let dataTabla1Creada: any[] = [];

        for (let ficha of data.data) {
          let fichaObjeto: any = {};

          fichaObjeto.id = ficha.id;
          fichaObjeto.description = ficha.description.toLowerCase();
          fichaObjeto.quantity = ficha.quantity;
          fichaObjeto.act = actaRecibida;
          fichaObjeto.disponible = await this.getDisponible(ficha.id);
          dataTabla1Creada.push(fichaObjeto);
        }
        this.totalItems1 = data.count;
        this.data1.load(dataTabla1Creada);
        this.data1.refresh();

        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  selectFila1(event: any) {
    console.log(event);

    this.bienSelecionado = {
      id: event.data.id,
      description: event.data.description,
      quantity: event.data.quantity,
      act: event.data.act,
      disponible: event.data.disponible,
    };

    this.formTable1.controls['detail'].setValue(event.data.description);
  }

  agregar() {
    const filtra = this.dataTabla2.filter(
      item => item.id === this.bienSelecionado.id
    );

    if (this.bienSelecionado.disponible === 'N') {
      this.alert(
        'error',
        'ATENCIÓN',
        'El bien tiene un estatus invalido para ser asignado a alguna acta.'
      );
      return;
    }
    if (filtra.length < 1 && this.bienSelecionado.id) {
      this.dataTabla2 = [...this.dataTabla2, this.bienSelecionado];
      this.data2.load(this.dataTabla2);

      this.alert('success', 'AGREGADO', 'El bien ha sido agregado.');
      this.formTable1.controls['detail'].setValue('');
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
    } else {
      this.formTable1.controls['detail'].setValue('');
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
      return;
    }

    this.totalItems2 = this.dataTabla2.length;
  }

  selectFila2(event: any) {
    console.log(event);

    this.bienSelecionado2 = {
      id: event.data.id,
      description: event.data.description,
      quantity: event.data.quantity,
      act: event.data.act,
    };

    this.formTable1.controls['detail'].setValue(event.data.description);
  }

  retirar() {
    if (this.bienSelecionado2.id) {
      const filtra2 = this.dataTabla2.filter(
        item => item.id !== this.bienSelecionado2.id
      );
      this.alert('success', 'ELIMINADO', 'El bien ha sido eliminado.');

      this.dataTabla2 = filtra2;
      this.data2.load(this.dataTabla2);
      this.totalItems2 = this.dataTabla2.length;
      this.formTable1.controls['detail'].setValue('');
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
    } else {
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
      this.formTable1.controls['detail'].setValue('');
      this.alert(
        'warning',
        'ATENCIÓN',
        'Debe seleccionar un bien que forme parte del acta primero.'
      );
    }
  }

  getScreenStatusFinal() {
    this.modalService.show(ModalMantenimientoEstatusActComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cerrarActa(idActa: any) {
    const model: IProccedingsDeliveryReception = {};
    model.closeDate = this.getCurrentDate();
    model.statusProceedings = 'CERRADA';
    model.id = idActa;
    console.log(model);
    this.proceedingsDetailDelivery.update(idActa, model).subscribe({
      next: resp => {
        console.log(resp);
        this.alert('success', 'ACTA CERRADA', 'El acta ha sido cerrada.');
        // this.disableClosedAct = true;
        // this.searchByExp(this.expediente);
      },
      error: err => {
        this.alert('error', 'HUBO UN ERROR', 'No se ha podido cerrar la acta.');
      },
    });
  }
}
