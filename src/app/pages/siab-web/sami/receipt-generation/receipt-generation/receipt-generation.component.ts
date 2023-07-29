import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  IReceiptExceltem,
  IReceiptGoodItem,
  IReceiptItem,
} from '../../receipt-generation-sami/receipt-table-goods/ireceipt';
import {
  RECEIPTGENERATION_COLUMNS,
  WISTNESS_COLUMNS,
} from './receipt-generation-columns';

@Component({
  selector: 'app-receipt-generation',
  templateUrl: './receipt-generation.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }
    `,
  ],
})
export class ReceiptGenerationComponent extends BasePage implements OnInit {
  receiptGenerationForm: FormGroup;
  receiptGenerationFirmForm: FormGroup;
  receiptForm: FormGroup;
  settings2 = { ...this.settings, actions: false };
  goodsList = new DefaultSelect();
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  programmingForm: FormGroup;
  fileProgrammingForm: FormGroup;
  folio: string;
  count = 0;

  cancellationList = new DefaultSelect();
  reprogramingList = new DefaultSelect();
  unitsList = new DefaultSelect();
  physicalStateList = new DefaultSelect();
  stateConservationList = new DefaultSelect();
  detinationList = new DefaultSelect();
  recepiptGood: IReceiptItem;
  indepForm: FormGroup;
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
  fileName: string;
  dataExcel: IReceiptExceltem[];
  goodsTable: IReceiptGoodItem;
  constructor(
    private fb: FormBuilder,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private genericService: GenericService,
    private excelService: ExcelService,
    private receptionGoodService: ReceptionGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: RECEIPTGENERATION_COLUMNS,
    };
    this.settings2.columns = WISTNESS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.programmingForm = this.fb.group({
      programmingId: [null, Validators.required],
      managementId: [null],
    });
    this.fileProgrammingForm = this.fb.group({
      file: [null, Validators.required],
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

    this.receiptGenerationForm = this.fb.group({
      operation: [null, Validators.required],
    });
    this.receiptGenerationFirmForm = this.fb.group({
      management: [null, Validators.required],
      uniqueKey: [null, Validators.required],
      proceedings: [null, Validators.required],
      descriptionTransferee: [null, Validators.required],
      descriptionIn: [null, Validators.required],
      transferAmount: [null, Validators.required],
      amountIn: [null, Validators.required],
      transferUnitMeasure: [null, Validators.required],
      unitMeasureIn: [null, Validators.required],
      transferringPhysicalState: [null, Validators.required],
      physicalStateIn: [null, Validators.required],
      transferringStateConservation: [null, Validators.required],
      stateConservationIn: [null, Validators.required],
      fateBinds: [null, Validators.required],
      destinyIn: [null, Validators.required],
      transferDestination: [null, Validators.required],
      cancellation: [null, Validators.required],
      reprogramming: [null, Validators.required],
    });
    this.receiptForm = this.fb.group({
      nameDelivery: [null, Validators.required],
      deliveryType: [null, Validators.required],
      chargeDelivers: [null, Validators.required],
      plateNumber: [null, Validators.required],
      seal: [null, Validators.required],
      nameReceives: [null, Validators.required],
      observations: [null, Validators.required],
      firmElectronic: [null, Validators.required],
    });
    this.programmingForm.controls['managementId'].disable();
    this.getGenericC(new ListParams());
    this.getGenericR(new ListParams());
    this.unitsQuery(new ListParams());
    this.getGenericE(new ListParams());
  }
  chargeFile(event: any) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    this.fileName = files[0].name;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    this.dataExcel = [];
    let data = this.excelService.getData(binaryExcel);
    data.forEach(element => {
      this.dataExcel.push({
        ID: element.ID,
        ID_BIEN: element.ID_BIEN,
        CLAVE_UNICA: element.CLAVE_UNICA,
        NO_EXPEDIENTE: element.NO_EXPEDIENTE,
        DESCRIPCION_BIEN_TASFERENTE: element.DESCRIPCION_BIEN_TASFERENTE,
        DESCRIPCION_BIEN_SAE: element.DESCRIPCION_BIEN_SAE,
        CANTIDAD_TRASFERENTE: element.CANTIDAD_TRASFERENTE,
        CANTIDAD_SAE: element.CANTIDAD_SAE,
        UNIDAD_MEDIDA_TRASFERENTE: element.UNIDAD_MEDIDA_TRASFERENTE,
        UNIDAD_MEDIDA_SAE: element.UNIDAD_MEDIDA_SAE,
        ESTADO_FISICO_TRASFERENTE: element.ESTADO_FISICO_TRASFERENTE,
        ESTADO_FISICO_SAE: element.ESTADO_FISICO_SAE,
        ESTADO_CONSERVACION_TRASFERENTE:
          element.ESTADO_CONSERVACION_TRASFERENTE,
        ESTADO_CONSERVACION_SAE: element.ESTADO_CONSERVACION_SAE,
        DESTINO: element.DESTINO,
        DESTINO_TRASFERENTE: element.DESTINO_TRASFERENTE,
        DESTINO_SAE: element.DESTINO_SAE,
        ID_PROGRAMACION: element.ID_PROGRAMACION,
        OBSERVACIONES: element.OBSERVACIONES,
      });
    });
    console.log(this.dataExcel);
  }
  searchPrograming() {
    this.loader.load = true;
    this.programmingGoodReceipt(new ListParams());
  }
  programmingGoodReceipt(params: ListParams) {
    if (this.programmingForm.controls['programmingId'].value) {
      let data = {
        programmingId: this.programmingForm.controls['programmingId'].value,
      };
      this.programmingGoodReceiptService.getProgrammingGoods(data).subscribe({
        next: resp => {
          console.log(resp);
          this.goodsList = new DefaultSelect(resp.data, resp.count);
          this.count = resp.count ?? 0;
          this.programmingForm.controls['managementId'].enable();
          this.loader.load = false;
        },
        error: eror => {
          this.loader.load = false;
          this.count = 0;
          this.goodsList = new DefaultSelect([], 0, true);
          this.alert(
            'warning',
            'Generación de Recibos',
            'Esta Programación no tienes Bienes'
          );
        },
      });
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Ingresa una Programación'
      );
      this.loader.load = false;
      return;
    }
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
  upload() {
    if (this.dataExcel != undefined && this.dataExcel.length > 0) {
      console.log(this.receiptGenerationForm.value);
      let IdReceipt: number = 0;
      if (
        this.receiptGenerationForm.controls['operation'].value == 'ACTUALIZA'
      ) {
        this.alertQuestion(
          'question',
          'Solo se Actualizará la Información de los Bienes.',
          '¿Desea continuar?',
          'Continuar'
        ).then(q => {
          if (q.isConfirmed) {
            console.log('data');
            this.acceptMassive();
          }
        });
      } else if (
        this.receiptGenerationForm.controls['operation'].value == 'RECIBO'
      ) {
        this.receiptOpen('RECIBO', new ListParams())
          .then(result => {
            console.log(result);
            IdReceipt = result;
            let message: string = '';
            if (IdReceipt > 0) {
              message =
                'Se Actualizará la Información de los Bienes y se Guardaran en el Recibo' +
                IdReceipt;
            } else {
              message =
                'Se Actualizará la Información de los Bienes y se Creara un Recibo Nuevo';
            }
            this.alertQuestion(
              'question',
              message,
              '¿Desea continuar?',
              'Continuar'
            ).then(q => {
              if (q.isConfirmed) {
                this.acceptMassive();
              }
            });
          })
          .catch(error => {});
      } else if (
        this.receiptGenerationForm.controls['operation'].value == 'ALMACEN'
      ) {
        this.receiptOpen('ALMACEN', new ListParams())
          .then(result => {
            console.log(result);
            IdReceipt = result;
            let message: string = '';
            if (IdReceipt > 0) {
              message =
                'Se Actualizará la Información de los Bienes y se Guardaran en el Recibo Almacén' +
                IdReceipt;
            } else {
              message =
                'Se Actualizará la Información de los Bienes y se Creara un Recibo Almacén Nuevo';
            }
            this.alertQuestion(
              'question',
              message,
              '¿Desea continuar?',
              'Continuar'
            ).then(q => {
              if (q.isConfirmed) {
                this.acceptMassive();
              }
            });
          })
          .catch(error => {});
      } else if (
        this.receiptGenerationForm.controls['operation'].value == 'RESGUARDO'
      ) {
        this.receiptOpen('RESGUARDO', new ListParams())
          .then(result => {
            console.log(result);
            IdReceipt = result;
            let message: string = '';
            if (IdReceipt > 0) {
              message =
                'Se Actualizará la Información de los Bienes y se Guardaran en el Recibo Resguardo' +
                IdReceipt;
            } else {
              message =
                'Se Actualizará la Información de los Bienes y se Creara un Recibo Resguardo Nuevo';
            }
            this.alertQuestion(
              'question',
              message,
              '¿Desea continuar?',
              'Continuar'
            ).then(q => {
              if (q.isConfirmed) {
                this.acceptMassive();
              }
            });
          })
          .catch(error => {});
      } else if (
        this.receiptGenerationForm.controls['operation'].value ==
        'REPROGRAMACION'
      ) {
        if (this.indepForm.controls['reprogramming'].value != null) {
          this.alertQuestion(
            'question',
            'Se Reprogramaran los Bienes',
            '¿Desea continuar?',
            'Continuar'
          ).then(q => {
            if (q.isConfirmed) {
              this.acceptMassive();
            }
          });
        } else {
          this.alert(
            'warning',
            'Debes Seleccionar el Motivo, de la Reprogramación',
            ''
          );
        }
      } else if (
        this.receiptGenerationForm.controls['operation'].value == 'CANCELACION'
      ) {
        if (this.indepForm.controls['cancellation'].value != null) {
          this.alertQuestion(
            'question',
            'Se Cancelaran los Bienes',
            '¿Desea continuar?',
            'Continuar'
          ).then(q => {
            if (q.isConfirmed) {
              this.acceptMassive();
            }
          });
        } else {
          this.alert(
            'warning',
            'Debes Seleccionar el Motivo, de la Cancelación',
            ''
          );
        }
      } else {
        console.log(this.receiptGenerationForm.value);
        this.alert('warning', 'Seleccione una Opción', '');
      }
    } else {
      this.alert('warning', 'Seleccione Algun Archivo', '');
    }
  }
  acceptMassive() {
    if (this.dataExcel.length > 0) {
      console.log(this.dataExcel.length);
      let idProgramacion: number = 0;
      idProgramacion = this.programmingForm.controls['programmingId'].value;
      this.dataExcel.forEach(element => {
        this.loader.load = true;
        this.comeBackGoodExcel(element)
          .then(result => {
            this.loader.load = false;
            this.goodsTable = result;
            try {
              if (this.goodsTable.observaciones == null) {
                if (idProgramacion == this.goodsTable.id_programacion) {
                  this.performValidationsFor(this.goodsTable)
                    .then(result => {
                      this.goodsTable.observaciones = result;
                      if (this.goodsTable.observaciones != '') {
                        element.OBSERVACIONES =
                          'Error: ' + this.goodsTable.observaciones;
                      } else {
                        if (
                          this.receiptGenerationForm.controls['operation']
                            .value != 'ACTUALIZA'
                        ) {
                        } else {
                        }
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                } else {
                  element.OBSERVACIONES =
                    element.OBSERVACIONES + 'Programacion diferente';
                }
              } else {
                element.OBSERVACIONES =
                  element.OBSERVACIONES +
                  ' ' +
                  this.goodsTable.observaciones.substring(
                    1,
                    this.goodsTable.observaciones.length - 1
                  );
              }
            } catch (error) {
              element.OBSERVACIONES = element.OBSERVACIONES + '' + error;
            }

            console.log(this.goodsTable);
          })
          .catch(error => {
            console.log(error);
            this.loader.load = false;
          });
      });
    } else {
      this.alert('warning', 'El Archivo no tiene Bienes', '');
    }
  }
  async comeBackGoodExcel(data: IReceiptExceltem) {
    let good: IReceiptGoodItem = {};
    good.id_recorrido = data.ID.toString();
    good.id_bien = data.ID_BIEN.toString();
    good.clave_unica = data.CLAVE_UNICA;
    good.no_expediente = data.NO_EXPEDIENTE;
    good.descripcion_bien = data.DESCRIPCION_BIEN_TASFERENTE;
    good.descripcion_bien_sae = data.DESCRIPCION_BIEN_SAE;
    if (data.CANTIDAD_TRASFERENTE) {
      try {
        good.cantidad = Number(data.CANTIDAD_TRASFERENTE);
      } catch (error) {
        good.cantidad = 0;
      }
    }
    if (data.CANTIDAD_SAE) {
      try {
        good.cantidad_sae = Number(data.CANTIDAD_SAE);
      } catch (error) {
        good.cantidad_sae = 0;
        good.observaciones =
          good.observaciones + ',No se puede convertir la cantidad INDEP';
      }
    } else {
      good.cantidad_sae = 0;
    }
    if (data.UNIDAD_MEDIDA_TRASFERENTE) {
      this.unitMeasures(data.UNIDAD_MEDIDA_TRASFERENTE)
        .then(result => {
          good.unidad_medida = result;
        })
        .catch(error => {});

      // unidad =
    } else {
      good.unidad_medida = '';
    }
    if (data.UNIDAD_MEDIDA_SAE) {
      this.unitMeasures(data.UNIDAD_MEDIDA_SAE)
        .then(result => {
          if (result == '0') {
            good.unidad_medida_sae = '';
            good.observaciones =
              good.observaciones + ', Se Necesita una unidad de Medida SAE';
          } else {
            good.unidad_medida_sae = result;
          }
        })
        .catch(error => {});
    } else {
      good.unidad_medida_sae = '';
    }
    if (data.ESTADO_FISICO_TRASFERENTE) {
      this.obtCat('Estado Fisico', data.ESTADO_FISICO_TRASFERENTE)
        .then(result => {
          good.estado_fisico = result;
        })
        .catch(error => {});
    }
    if (data.ESTADO_FISICO_SAE) {
      this.obtCat('Estado Fisico', data.ESTADO_FISICO_SAE)
        .then(result => {
          good.estado_fisico_sae = result;
        })
        .catch(error => {});
    } else {
      good.estado_fisico_sae = 0;
    }
    if (data.ESTADO_CONSERVACION_TRASFERENTE) {
      this.obtCat('Estado Conservacion', data.ESTADO_CONSERVACION_TRASFERENTE)
        .then(result => {
          good.estado_conservacion = result;
        })
        .catch(error => {});
    }
    if (data.ESTADO_CONSERVACION_SAE) {
      this.obtCat('Estado Conservacion', data.ESTADO_CONSERVACION_SAE)
        .then(result => {
          if (result > 0) {
            good.estado_conservacion_sae = result;
          } else {
            good.observaciones =
              good.observaciones +
              ', No se encuentra el estado de conservación SAE';
            good.estado_conservacion_sae = 0;
          }
        })
        .catch(error => {});
    } else {
      good.estado_conservacion_sae = 0;
    }
    if (data.DESTINO) {
      this.obtCat('Destino', data.DESTINO)
        .then(result => {
          good.destino = result;
        })
        .catch(error => {});
    }
    if (data.DESTINO_TRASFERENTE) {
      this.obtCat('Destino', data.DESTINO_TRASFERENTE)
        .then(result => {
          good.destino_transferente = result;
        })
        .catch(error => {});
    }
    if (data.DESTINO_SAE) {
      this.obtCat('Destino', data.DESTINO_SAE)
        .then(result => {
          if (result > 0) {
            good.destino_sae = result;
          } else {
            good.observaciones =
              good.observaciones + ', No se encuentra destino SAE';
            good.destino_sae = 0;
          }
        })
        .catch(error => {});
    } else {
      good.destino_sae = 0;
    }
    if (data.ID_PROGRAMACION) {
      good.id_programacion = data.ID_PROGRAMACION;
    }
    good.destino_letra = data.DESTINO;
    good.destino_sae_letra = data.DESTINO_SAE;
    good.destino_transferente_letra = data.DESTINO_TRASFERENTE;
    good.estado_conservacion_letra = data.ESTADO_CONSERVACION_TRASFERENTE;
    good.estado_conservacion_sae_letra = data.ESTADO_CONSERVACION_SAE;
    good.estado_fisico_letra = data.ESTADO_FISICO_TRASFERENTE;
    good.estado_fisico_sae_letra = data.ESTADO_FISICO_SAE;
    good.unidad_medida_letra = data.UNIDAD_MEDIDA_TRASFERENTE;
    good.unidad_medida_sae_letra = data.UNIDAD_MEDIDA_SAE;
    return good;
  }
  async performValidationsFor(data: IReceiptGoodItem) {
    let result: string = '';
    let coma: string = '';
    if (
      data.unidad_medida_sae.toUpperCase() != 'KG' ||
      data.unidad_medida_sae.toUpperCase() != 'LT'
    ) {
      let cantidasae: number = 0;
      cantidasae = parseInt(data.cantidad_sae.toString(), 10);
      if (isNaN(cantidasae)) {
        if (result) {
          coma = ', ';
        } else {
          coma = '';
        }
        result = result + coma + 'La cantidad debe ser enteros';
      }
      let unitMeasureSaeLetter: string = '';
      if (data.unidad_medida_letra) {
        unitMeasureSaeLetter = data.unidad_medida_letra.toUpperCase();
      } else {
        unitMeasureSaeLetter = data.unidad_medida_sae_letra.toUpperCase();
      }
      if (data.unidad_medida_letra.toUpperCase() == unitMeasureSaeLetter) {
        if (data.cantidad < data.cantidad_sae) {
          if (result) {
            coma = ', ';
          } else {
            coma = '';
          }
          result =
            result +
            coma +
            'La cantidad debe ser menor o igual que a la trasferente';
        }
      }
    }
    return result;
  }
  async unitMeasures(type: string) {
    const params = new ListParams();
    params['filter.unit_of_measure_tl'] = `$eq:${type}`;
    let unit: string = '';
    this.applicationGoodsQueryService.getAllUnitsQ(params).subscribe({
      next: resp => {
        unit = resp.data[0].uom_code;
      },
      error: eror => {
        unit = '0';
        console.log(eror);
      },
    });
    return unit;
  }
  async obtCat(name: string, description: string) {
    const params = new ListParams();
    params['filter.name'] = name;
    params['filter.description'] = description;
    let keyId: number = 0;
    this.genericService.getAll(params).subscribe({
      next: resp => {
        keyId = resp.data[0].keyId;
      },
      error: eror => {
        keyId = 0;
      },
    });
    return keyId;
  }

  async receiptOpen(operationType: string, params: ListParams) {
    let result: number = 0;
    params['filter.tipo_recibo'] = `$eq:${operationType}`;
    params['filter.estatus_recibo'] = `$eq:ABIERTO`;
    this.receptionGoodService
      .getqueryAllTicketsInt(
        this.programmingForm.controls['programmingId'].value,
        params
      )
      .subscribe({
        next: resp => {
          result = resp.data.id_recibo;
        },
        error: eror => {
          result = 0;
        },
      });
    return result;
  }
  value(data: any) {
    console.log(this.receiptGenerationForm.controls['operation'].value);
    if (
      this.receiptGenerationForm.controls['operation'].value == 'ACTUALIZA' ||
      this.receiptGenerationForm.controls['operation'].value == 'RECIBO' ||
      this.receiptGenerationForm.controls['operation'].value == 'ALMACEN' ||
      this.receiptGenerationForm.controls['operation'].value == 'RESGUARDO'
    ) {
      this.cancellationView = false;
      this.reprogramingView = false;
    } else if (
      this.receiptGenerationForm.controls['operation'].value == 'REPROGRAMACION'
    ) {
      this.indepForm.controls['cancellation'].setValue(null);
      this.reprogramingView = true;
      this.cancellationView = false;
    } else if (
      this.receiptGenerationForm.controls['operation'].value == 'CANCELACION'
    ) {
      this.indepForm.controls['reprogramming'].setValue(null);
      this.cancellationView = true;
      this.reprogramingView = false;
    }
  }
}
