import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IReceiptItem } from '../receipt-table-goods/ireceipt';

@Component({
  selector: 'app-receipt-generation-sami',
  templateUrl: './receipt-generation-sami.component.html',
  styles: [
    `
      /* .label {
        color: black;
        font-weight: 900;
      }

      label,
      span {
        color: black;
        font-size: 0.8em;
        font-weight: 400;
      } */
    `,
  ],
})
export class ReceiptGenerationSamiComponent extends BasePage implements OnInit {
  programmingForm: FormGroup;
  indepForm: FormGroup;
  cancellationList = new DefaultSelect();
  reprogramingList = new DefaultSelect();
  goodsList = new DefaultSelect();
  unitsList = new DefaultSelect();
  physicalStateList = new DefaultSelect();
  stateConservationList = new DefaultSelect();
  detinationList = new DefaultSelect();
  recepiptGood: IReceiptItem;
  goodID: string;
  uniqueKey: string;
  noFile: string;
  descriptionGood: string;
  quantity: string;
  unitMeasure: string;
  physicalStateLetter: string;
  letterConservationStatus: string;
  destinationLetter: string;
  destinoTransferenteLetra: string;
  cancellationView: boolean = false;
  reprogramingView: boolean = false;
  count = 0;
  folio: string;
  id_programacion: string;
  constructor(
    private fb: FormBuilder,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private genericService: GenericService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.programmingForm = this.fb.group({
      programmingId: [null, Validators.required],
      managementId: [null],
    });
    this.indepForm = this.fb.group({
      descripcion_bien_sae: [null, Validators.required],
      cantidad_sae: [null, Validators.required],
      unidad_medida_sae: [null, Validators.required],
      estado_fisico_sae: [null, Validators.required],
      estado_conservacion_sae: [null, Validators.required],
      destino_sae: [null, Validators.required],
      cancellation: [null],
      reprogramming: [null],
    });
    this.programmingForm.controls['managementId'].disable();
  }
  programmingGoodReceipt(params: ListParams) {
    if (this.programmingForm.controls['programmingId'].value) {
      params['filter.folio'] =
        this.programmingForm.controls['programmingId'].value.trim();
      this.folio = this.programmingForm.controls['programmingId'].value.trim();
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Ingresa una Programación'
      );
      this.loader.load = false;
      return;
    }
    this.programmingGoodReceiptService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        if (resp) {
          this.id_programacion = resp.data[0].id_programacion;
        } else {
          this.id_programacion = null;
        }
        this.goodsList = new DefaultSelect(resp.data, resp.count);
        this.count = resp.count ?? 0;
        this.programmingForm.controls['managementId'].enable();
        this.loader.load = false;
      },
      error: eror => {
        this.loader.load = false;
        this.count = 0;
        this.id_programacion = null;
        this.goodsList = new DefaultSelect([], 0, true);
        this.alert(
          'warning',
          'Generación de Recibos',
          'Esta Programación no tienes Bienes'
        );
      },
    });
  }
  searchPrograming() {
    // this.clean();
    this.loader.load = true;
    this.programmingGoodReceipt(new ListParams());
  }
  searchManagement(data: IReceiptItem) {
    if (data.guardado == '0') {
      this.unitsQuery(new ListParams());
      this.getGenericD(new ListParams());
      this.getGenericE(new ListParams());
      this.getGenericEC(new ListParams());
      this.recepiptGood = data;
      this.indepForm.patchValue(data);
      console.log(this.indepForm.value);
      this.goodID = this.recepiptGood.id_bien;
      this.uniqueKey = this.recepiptGood.clave_unica;
      this.noFile = this.recepiptGood.no_expediente;
      this.descriptionGood = this.recepiptGood.descripcion_bien;
      this.quantity = this.recepiptGood.cantidad;
      this.unitMeasure = this.recepiptGood.unidad_medida_letra;
      this.physicalStateLetter = this.recepiptGood.estado_fisico_letra;
      this.letterConservationStatus =
        this.recepiptGood.estado_conservacion_letra;
      this.destinationLetter = this.recepiptGood.destino_letra;
      this.destinoTransferenteLetra =
        this.recepiptGood.destino_transferente_letra;
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Este Bien ya fue Guardado Anteriormente'
      );
    }
  }
  unitsQuery(params: ListParams) {
    this.applicationGoodsQueryService.getAllUnitsQ(params).subscribe({
      next: resp => {
        console.log(resp);
        this.unitsList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.unitsList = new DefaultSelect([], 0, true);
      },
    });
  }
  getGenericD(params: ListParams) {
    params['filter.name'] = 'Destino';
    this.genericService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.detinationList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.detinationList = new DefaultSelect([], 0, true);
      },
    });
  }
  getGenericE(params: ListParams) {
    params['filter.name'] = 'Estado Fisico';
    this.genericService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.physicalStateList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.physicalStateList = new DefaultSelect([], 0, true);
      },
    });
  }
  getGenericEC(params: ListParams) {
    params['filter.name'] = 'Estado Conservacion';
    this.genericService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.stateConservationList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.stateConservationList = new DefaultSelect([], 0, true);
      },
    });
  }
  getGenericC(params: ListParams) {
    params['filter.name'] = 'Cancelacion';
    this.genericService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.cancellationList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.cancellationList = new DefaultSelect([], 0, true);
      },
    });
  }
  getGenericR(params: ListParams) {
    params['filter.name'] = 'Reprogramacion';
    this.genericService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.reprogramingList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.reprogramingList = new DefaultSelect([], 0, true);
      },
    });
  }

  assignReceiptOne(sender: number) {
    if (
      this.indepForm.controls['unidad_medida_sae'].value != 'KG' ||
      this.indepForm.controls['unidad_medida_sae'].value != 'LT'
    ) {
      let cantidasae: number = 0;
      cantidasae = parseInt(this.indepForm.controls['cantidad_sae'].value, 10);
      if (isNaN(cantidasae)) {
        this.alert(
          'warning',
          'Generación de Recibos',
          'La Cantidad debe ser Enteros'
        );
        return;
      }
    }
    this.cancellationView = false;
    this.reprogramingView = false;
    if (sender == 0) {
      this.alertQuestion(
        'question',
        '¿Desea Registrar los Bienes con tipo Recibo?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.performOperation('UNO', 'Recibo', 0);
        }
      });
    } else if (sender == 1) {
      this.alertQuestion(
        'question',
        '¿Desea Registrar los Bienes con tipo Resguardo?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.performOperation('UNO', 'Resguardo', 0);
        }
      });
    } else if (sender == 2) {
      this.alertQuestion(
        'question',
        '¿Desea Registrar los Bienes con tipo Almacén?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.performOperation('UNO', 'Almacen', 0);
        }
      });
    }
  }
  performOperation(type: string, operation: string, reasonCanRep: number) {
    let data = {
      P_TIPO_OPERACION: operation.toUpperCase(),
      P_MOTIVOCAN: reasonCanRep,
      P_CANTIDAD_SAE: this.indepForm.controls['cantidad_sae'].value,
      P_DESTINO_SAE: this.indepForm.controls['destino_sae'].value,
      P_ESTADO_CONSERVACION_SAE:
        this.indepForm.controls['estado_conservacion_sae'].value,
      P_ESTADO_FISICO_SAE: this.indepForm.controls['estado_fisico_sae'].value,
      P_UNIDAD_MEDIDA_SAE: this.indepForm.controls['unidad_medida_sae'].value,
      P_DESCRIPCION_BIEN_SAE:
        this.indepForm.controls['descripcion_bien_sae'].value,
      P_ID_BIEN: this.recepiptGood.id_bien,
      P_ID_PROGRAMACION: this.recepiptGood.id_programacion,
      P_USUARIO_CREACION: localStorage.getItem('username'),
    };
    console.log(data);
    this.programmingGoodReceiptService
      .postGoodsProgramingReceipts(data)
      .subscribe({
        next: resp => {
          console.log(resp);
          if (operation === 'Almacen') {
            operation = 'Almacén';
          }
          this.alert('success', `Bien Agregado a ${operation}`, '');
          this.cleanInsert();
        },
        error: eror => {
          this.alert(
            'warning',
            'Generación de Recibos',
            'No se pudo Agregar el Bien al Recibo'
          );
        },
      });
  }
  reprogrammingOne() {
    this.getGenericR(new ListParams());
    this.cancellationView = false;
    this.reprogramingView = true;
  }
  cancellationOne() {
    this.getGenericC(new ListParams());
    this.cancellationView = true;
    this.reprogramingView = false;
  }
  acceptCancellation() {
    if (this.indepForm.controls['cancellation'].value != null) {
      this.alertQuestion(
        'question',
        'Se Cancelará la programación',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          if (
            this.indepForm.controls['unidad_medida_sae'].value != 'KG' ||
            this.indepForm.controls['unidad_medida_sae'].value != 'LT'
          ) {
            let cantidasae: number = 0;
            cantidasae = parseInt(
              this.indepForm.controls['cantidad_sae'].value,
              10
            );
            if (isNaN(cantidasae)) {
              this.alert(
                'warning',
                'Generación de Recibos',
                'La Cantidad debe ser Enteros'
              );
              return;
            }
          }
          this.performOperation(
            'UNO',
            'CANCELACION',
            this.indepForm.controls['cancellation'].value
          );
        }
      });
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Debes Seleccionar el Motivo, de la Cancelación'
      );
      return;
    }
  }
  acceptReprogramming() {
    if (this.indepForm.controls['reprogramming'].value != null) {
      this.alertQuestion(
        'question',
        'Se hará una Reprogramación',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          if (
            this.indepForm.controls['unidad_medida_sae'].value != 'KG' ||
            this.indepForm.controls['unidad_medida_sae'].value != 'LT'
          ) {
            let cantidasae: number = 0;
            cantidasae = parseInt(
              this.indepForm.controls['cantidad_sae'].value,
              10
            );
            if (isNaN(cantidasae)) {
              this.alert(
                'warning',
                'Generación de Recibos',
                'La Cantidad debe ser Enteros'
              );
              return;
            }
          }
          this.performOperation(
            'UNO',
            'REPROGRAMACION',
            this.indepForm.controls['reprogramming'].value
          );
        }
      });
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Debes Seleccionar el Motivo de la Reprogramación'
      );
      return;
    }
  }
  cleanInsert() {
    this.programmingForm.controls['managementId'].setValue('');
    this.goodID = '';
    this.uniqueKey = '';
    this.noFile = '';
    this.descriptionGood = '';
    this.quantity = '';
    this.unitMeasure = '';
    this.physicalStateLetter = '';
    this.letterConservationStatus = '';
    this.destinationLetter = '';
    this.destinoTransferenteLetra = '';
    this.indepForm.reset();
  }
  clean() {
    this.programmingForm.reset();
    this.indepForm.reset();
  }
}
