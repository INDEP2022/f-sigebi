import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
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
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  programmingForm: FormGroup;
  fileProgrammingForm: FormGroup;
  folio: string;
  id_programacion: string;
  count = 0;

  cancellationList = new DefaultSelect();
  reprogramingList = new DefaultSelect();
  unitsList = new DefaultSelect();
  physicalStateList = new DefaultSelect();
  stateConservationList = new DefaultSelect();
  detinationList = new DefaultSelect();
  recepiptGood: IReceiptItem;
  indepForm: FormGroup;
  indepForm1: FormGroup;
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
  cancellationView1: boolean = false;
  reprogramingView1: boolean = false;
  fileName: string;
  dataExcel: IReceiptExceltem[];
  goodsTable: IReceiptGoodItem;
  // goodsDownload: IReceiptGoodItem[];
  goodsDownloadExcel: IReceiptExceltem[];
  goodsDownloadPrograming: IReceiptExceltem[];
  goods: any = [];
  downloadResults: boolean = false;
  downloadResultsGoods: boolean = false;

  constructor(
    private fb: FormBuilder,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private genericService: GenericService,
    private excelService: ExcelService,
    private receptionGoodService: ReceptionGoodService,
    private massiveGoodService: MassiveGoodService
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
    this.indepForm1 = this.fb.group({
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
        DESCRIPCION_BIEN_SAE:
          element.DESCRIPCION_BIEN_SAE != undefined
            ? element.DESCRIPCION_BIEN_SAE
            : '',
        CANTIDAD_TRASFERENTE: element.CANTIDAD_TRASFERENTE,
        CANTIDAD_SAE:
          element.CANTIDAD_SAE != undefined ? element.CANTIDAD_SAE : '',
        UNIDAD_MEDIDA_TRASFERENTE: element.UNIDAD_MEDIDA_TRASFERENTE,
        UNIDAD_MEDIDA_SAE:
          element.UNIDAD_MEDIDA_SAE != undefined
            ? element.UNIDAD_MEDIDA_SAE
            : '',
        ESTADO_FISICO_TRASFERENTE: element.ESTADO_FISICO_TRASFERENTE,
        ESTADO_FISICO_SAE: element.ESTADO_FISICO_SAE,
        ESTADO_CONSERVACION_TRASFERENTE:
          element.ESTADO_CONSERVACION_TRASFERENTE,
        ESTADO_CONSERVACION_SAE: element.ESTADO_CONSERVACION_SAE,
        DESTINO: element.DESTINO,
        DESTINO_TRASFERENTE: element.DESTINO_TRASFERENTE,
        DESTINO_SAE: element.DESTINO_SAE,
        ID_PROGRAMACION: element.ID_PROGRAMACION,
        OBSERVACIONES:
          element.OBSERVACIONES != undefined ? element.OBSERVACIONES : '',
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
      this.folio = this.programmingForm.controls['programmingId'].value.trim();
      this.programmingGoodReceiptService
        .getProgrammingGoods(data, params)
        .subscribe({
          next: resp => {
            console.log(resp);
            if (resp.data) {
              this.id_programacion = resp.data[0].id_programacion;
            } else {
              this.id_programacion = null;
            }
            this.goodsList = new DefaultSelect(resp.data, resp.count);
            this.goods = resp.data;
            this.downloadResultsGoods = true;
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
              'Esta Programación no tiene Bienes'
            );
          },
        });
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Ingrese una Programación'
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
      console.log(data);
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
        'Este Bien ya fue guardado anteriormente'
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
            this.acceptMassive()
              .then(result => {
                console.log(result);
                this.goodsDownloadExcel = [];
                this.goodsDownloadExcel = this.dataExcel;
                setTimeout(() => {
                  this.loader.load = false;
                  this.downloadResults = true;
                  this.data1.load(this.goodsDownloadExcel);
                  this.data1.refresh();
                  this.totalItems = this.goodsDownloadExcel.length;
                  this.alert(
                    'success',
                    `Proceso terminado correctamente, ya puede descargar el resultado`,
                    ''
                  );
                  this.downloadResultsGoods = false;
                  this.searchPrograming();
                }, 1000);
              })
              .catch(error => {});
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
                'Se actualizará la información de los Bienes y se guardarán en el Recibo' +
                IdReceipt;
            } else {
              message =
                'Se actualizará la información de los Bienes y se creará un Recibo nuevo';
            }
            this.alertQuestion(
              'question',
              message,
              '¿Desea continuar?',
              'Continuar'
            ).then(q => {
              if (q.isConfirmed) {
                this.acceptMassive()
                  .then(result => {
                    console.log(result);
                    this.goodsDownloadExcel = [];
                    this.goodsDownloadExcel = this.dataExcel;
                    console.log(this.goodsDownloadExcel);

                    setTimeout(() => {
                      this.loader.load = false;
                      this.downloadResults = true;
                      this.data1.load(this.goodsDownloadExcel);
                      this.data1.refresh();
                      this.totalItems = this.goodsDownloadExcel.length;
                      this.alert(
                        'success',
                        `Proceso terminado correctamente, ya puede descargar el resultado`,
                        ''
                      );
                      this.downloadResultsGoods = false;
                      this.count++;
                    }, 1000);
                  })
                  .catch(error => {});
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
                'Se actualizará la información de los Bienes y se guardarán en el recibo Almacén' +
                IdReceipt;
            } else {
              message =
                'Se actualizará la información de los Bienes y se creará un recibo Almacén nuevo';
            }
            this.alertQuestion(
              'question',
              message,
              '¿Desea continuar?',
              'Continuar'
            ).then(q => {
              this.acceptMassive()
                .then(result => {
                  console.log(result);
                  this.goodsDownloadExcel = [];
                  this.goodsDownloadExcel = this.dataExcel;
                  setTimeout(() => {
                    this.loader.load = false;
                    this.downloadResults = true;
                    this.data1.load(this.goodsDownloadExcel);
                    this.data1.refresh();
                    this.totalItems = this.goodsDownloadExcel.length;
                    this.alert(
                      'success',
                      `Proceso terminado correctamente, ya puede descargar el resultado`,
                      ''
                    );
                    this.downloadResultsGoods = false;
                    this.searchPrograming();
                  }, 1000);
                })
                .catch(error => {});
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
                'Se actualizará la información de los Bienes y se guardarán en el recibo Resguardo' +
                IdReceipt;
            } else {
              message =
                'Se actualizará la información de los Bienes y se creará un recibo Resguardo nuevo';
            }
            this.alertQuestion(
              'question',
              message,
              '¿Desea continuar?',
              'Continuar'
            ).then(q => {
              if (q.isConfirmed) {
                this.acceptMassive()
                  .then(result => {
                    console.log(result);
                    this.goodsDownloadExcel = [];
                    this.goodsDownloadExcel = this.dataExcel;
                    setTimeout(() => {
                      this.loader.load = false;
                      this.downloadResults = true;
                      this.data1.load(this.goodsDownloadExcel);
                      this.data1.refresh();
                      this.totalItems = this.goodsDownloadExcel.length;
                      this.alert(
                        'success',
                        `Proceso terminado correctamente, ya puede descargar el resultado`,
                        ''
                      );
                      this.searchPrograming();
                    }, 1000);
                  })
                  .catch(error => {});
              }
            });
          })
          .catch(error => {});
      } else if (
        this.receiptGenerationForm.controls['operation'].value ==
        'REPROGRAMACION'
      ) {
        if (this.indepForm1.controls['reprogramming'].value != null) {
          this.alertQuestion(
            'question',
            'Se Reprogramarán los Bienes',
            '¿Desea continuar?',
            'Continuar'
          ).then(q => {
            if (q.isConfirmed) {
              this.acceptMassiveCan()
                .then(result => {
                  console.log(result);
                  this.goodsDownloadExcel = [];
                  this.goodsDownloadExcel = this.dataExcel;
                  setTimeout(() => {
                    this.loader.load = false;
                    this.downloadResults = true;
                    this.data1.load(this.goodsDownloadExcel);
                    this.data1.refresh();
                    this.totalItems = this.goodsDownloadExcel.length;
                    this.alert(
                      'success',
                      `Proceso terminado correctamente, ya puede descargar el resultado`,
                      ''
                    );
                    this.searchPrograming();
                  }, 1000);
                })
                .catch(error => {});
            }
          });
        } else {
          this.alert(
            'warning',
            'Debe seleccionar el motivo, de la reprogramación',
            ''
          );
        }
      } else if (
        this.receiptGenerationForm.controls['operation'].value == 'CANCELACION'
      ) {
        if (this.indepForm1.controls['cancellation'].value != null) {
          this.alertQuestion(
            'question',
            'Se cancelarán los Bienes',
            '¿Desea continuar?',
            'Continuar'
          ).then(q => {
            if (q.isConfirmed) {
              this.acceptMassiveCan()
                .then(result => {
                  console.log(result);
                  this.goodsDownloadExcel = [];
                  this.goodsDownloadExcel = this.dataExcel;
                  setTimeout(() => {
                    this.loader.load = false;
                    this.downloadResults = true;
                    this.data1.load(this.goodsDownloadExcel);
                    this.data1.refresh();
                    this.totalItems = this.goodsDownloadExcel.length;
                    this.alert(
                      'success',
                      `Proceso terminado correctamente, ya puede descargar el resultado`,
                      ''
                    );
                    this.searchPrograming();
                  }, 1000);
                })
                .catch(error => {});
            }
          });
        } else {
          this.alert(
            'warning',
            'Debe seleccionar el motivo, de la Cancelación',
            ''
          );
        }
      } else {
        console.log(this.receiptGenerationForm.value);
        this.alert('warning', 'Seleccione una opción', '');
      }
    } else {
      this.alert('warning', 'Seleccione algún archivo', '');
    }
  }
  async acceptMassive() {
    if (this.dataExcel.length > 0) {
      console.log(this.dataExcel.length);
      let idProgramacion: number = 0;
      idProgramacion = this.programmingForm.controls['programmingId'].value;
      // this.goodsDownload = [];
      this.loader.load = true;
      for (let i = 0; i < this.dataExcel.length; i++) {
        let receipGood: any = [];
        let goods: any = await this.comeBackGoodExcel(this.dataExcel[i]);
        this.goodsTable = goods;

        console.log(
          idProgramacion +
            '<<<<<<<<<<<>>>>>>>>' +
            this.goodsTable.id_programacion
        );
        try {
          if (this.goodsTable.observaciones == null) {
            console.log(this.goodsTable);
            if (idProgramacion == this.goodsTable.id_programacion) {
              console.log(this.goodsTable);
              let desc: any = '';
              console.log(this.performValidationsFor(this.goodsTable));
              desc = await this.performValidationsFor(this.goodsTable);
              console.log(desc);
              this.goodsTable.observaciones = desc;
              if (this.goodsTable.observaciones != '') {
                this.dataExcel[i].OBSERVACIONES =
                  'Error: ' + this.goodsTable.observaciones;
              } else {
                if (
                  this.receiptGenerationForm.controls['operation'].value !=
                  'ACTUALIZA'
                ) {
                  receipGood = await this.checkReceiptGood(
                    this.goodsTable.id_bien,
                    idProgramacion
                  );
                  console.log(receipGood.length);
                  if (receipGood.length == 0) {
                    let result: any = await this.performOperation(
                      this.goodsTable,
                      0
                    );
                    console.log(result);
                    if (result == 'success') {
                      console.log(
                        '<<<<<<<<<<<res performOperation>>>>>>>>>>>' + result
                      );
                      receipGood = await this.checkReceiptGood(
                        this.goodsTable.id_bien,
                        idProgramacion
                      );
                      console.log(receipGood);
                      this.dataExcel[i].OBSERVACIONES =
                        'ACTUALIZADO CORRECTAMENTE' +
                        ' ' +
                        receipGood[0].typeReceipt +
                        ' ' +
                        receipGood[0].idReceipt +
                        ' ' +
                        'Y ID ACTA' +
                        ' ' +
                        receipGood[0].idMinutes;
                    } else {
                      this.dataExcel[i].OBSERVACIONES = 'ERROR AL ACTUALIZAR';
                    }
                  } else {
                    console.log(receipGood);
                    this.dataExcel[i].OBSERVACIONES =
                      'ACTUALIZADO ANTERIORMENTE AL ' +
                      receipGood[0].typeReceipt +
                      ' ' +
                      receipGood[0].idReceipt +
                      ' ' +
                      'Y ID ACTA' +
                      ' ' +
                      receipGood[0].idMinutes;
                  }
                } else {
                  let result: any = await this.updateInfoAssets(
                    this.goodsTable
                  );
                  console.log(result);
                  if (result.statusCode == '200') {
                    console.log(
                      '<<<<<<<<<<<res updateInfoAssets>>>>>>>>>>>' + result
                    );
                    this.dataExcel[i].OBSERVACIONES =
                      'ACTUALIZADO CORRECTAMENTE';
                  } else {
                    this.dataExcel[i].OBSERVACIONES = 'ERROR AL ACTUALIZAR';
                  }
                }
              }
            } else {
              this.dataExcel[i].OBSERVACIONES =
                (this.dataExcel[i].OBSERVACIONES != null
                  ? this.dataExcel[i].OBSERVACIONES
                  : '') + 'Programación diferente';
            }
          } else {
            this.dataExcel[i].OBSERVACIONES =
              this.dataExcel[i].OBSERVACIONES +
              ' ' +
              this.goodsTable.observaciones.substring(
                1,
                this.goodsTable.observaciones.length - 1
              );
          }
        } catch (error) {
          this.dataExcel[i].OBSERVACIONES =
            this.dataExcel[i].OBSERVACIONES + '' + error;
        }
        console.log(this.dataExcel);
        await this.dataExcel;
      }
      return this.dataExcel;
    } else {
      this.alert('warning', 'El Archivo no tiene Bienes', '');
    }
    return await this.dataExcel;
  }
  async acceptMassiveCan() {
    if (this.dataExcel.length > 0) {
      console.log(this.dataExcel.length);
      let idProgramacion: number = 0;
      idProgramacion = this.programmingForm.controls['programmingId'].value;
      let motivCan: number = 0;
      if (
        this.receiptGenerationForm.controls['operation'].value == 'CANCELACION'
      ) {
        motivCan = this.indepForm1.controls['cancellation'].value;
      } else if (
        this.receiptGenerationForm.controls['operation'].value ==
        'REPROGRAMACION'
      ) {
        motivCan = this.indepForm1.controls['reprogramming'].value;
      }
      // this.goodsDownload = [];
      this.loader.load = true;
      for (let i = 0; i < this.dataExcel.length; i++) {
        let receipGood: any = [];
        let goods: any = await this.comeBackGoodExcel(this.dataExcel[i]);
        this.goodsTable = goods;
        receipGood = await this.checkReceiptGood(
          this.goodsTable.id_bien,
          idProgramacion
        );
        try {
          console.log(this.goodsTable);
          if (idProgramacion == this.goodsTable.id_programacion) {
            if (receipGood.length == 0) {
              let result: any = await this.performOperation(
                this.goodsTable,
                motivCan
              );
              console.log(result);
              if (result == 'success') {
                console.log(
                  '<<<<<<<<<<<res performOperation>>>>>>>>>>>' + result
                );
                console.log(receipGood);
                this.dataExcel[i].OBSERVACIONES = 'ACTUALIZADO CORRECTAMENTE';
              } else {
                this.dataExcel[i].OBSERVACIONES = 'ERROR AL ACTUALIZAR';
              }
            } else {
              this.dataExcel[i].OBSERVACIONES =
                'AGREGADO ANTERIORMENTE AL' +
                ' ' +
                receipGood[0].typeReceipt +
                ' ' +
                receipGood[0].idReceipt;
            }
          } else {
            this.dataExcel[i].OBSERVACIONES =
              this.dataExcel[i].OBSERVACIONES + 'Programación diferente';
          }
        } catch (error) {
          this.dataExcel[i].OBSERVACIONES =
            this.dataExcel[i].OBSERVACIONES + '' + error;
        }
        await this.dataExcel;
      }
      return await this.dataExcel;
    } else {
      this.alert('warning', 'El Archivo no tiene Bienes', '');
    }
    return await this.dataExcel;
  }
  async checkReceiptGood(good: string, idProgramacion: number) {
    return new Promise((res, rej) => {
      let data = {
        idBien: good,
        idProgramacion: idProgramacion,
      };
      this.receptionGoodService.getReceiptsGood(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp.data);
        },
        error: eror => {
          console.log(eror);
          res([]);
        },
      });
    });
  }
  async comeBackGoodExcel(data: IReceiptExceltem) {
    return new Promise(async (res, rej) => {
      let good: IReceiptGoodItem = { observaciones: null };
      let estado_fisico: any = '';
      console.log(data);
      good.id_recorrido = data.ID.toString();
      good.id_bien = data.ID_BIEN.toString();
      good.clave_unica = data.CLAVE_UNICA != undefined ? data.CLAVE_UNICA : '';
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
            good.observaciones + ', No se puede convertir la cantidad INDEP';
          console.log(good.observaciones);
        }
      } else {
        good.cantidad_sae = 0;
      }
      if (data.UNIDAD_MEDIDA_TRASFERENTE) {
        let unidad: any = '';
        unidad = await this.unitMeasures(data.UNIDAD_MEDIDA_TRASFERENTE);
        good.unidad_medida = unidad;
      } else {
        good.unidad_medida = '';
      }
      if (data.UNIDAD_MEDIDA_SAE) {
        console.log(data.UNIDAD_MEDIDA_SAE);
        let unidadSae: any = '';
        unidadSae = await this.unitMeasures(data.UNIDAD_MEDIDA_SAE);
        console.log(unidadSae);
        if (unidadSae == '0') {
          good.unidad_medida_sae = '';
          good.observaciones =
            good.observaciones + ', Se necesita una Unidad de Medida INDEP';
          console.log(good.observaciones);
        } else {
          console.log(unidadSae);
          good.unidad_medida_sae = unidadSae;
        }
      } else {
        good.unidad_medida_sae = '';
      }
      if (data.ESTADO_FISICO_TRASFERENTE) {
        estado_fisico = await this.obtCat(
          'Estado Fisico',
          data.ESTADO_FISICO_TRASFERENTE
        );
        if (estado_fisico != '0') {
          good.estado_fisico = Number(estado_fisico);
        } else {
          good.estado_fisico = 0;
        }
      }
      if (data.ESTADO_FISICO_SAE) {
        let fisicoSae: any = '';
        fisicoSae = await this.obtCat('Estado Fisico', data.ESTADO_FISICO_SAE);
        if (fisicoSae != '0') {
          good.estado_fisico_sae = Number(fisicoSae);
        } else {
          good.estado_fisico_sae = 0;
        }
      } else {
        good.estado_fisico_sae = 0;
      }
      if (data.ESTADO_CONSERVACION_TRASFERENTE) {
        let estadoConservacion: any = '';
        estadoConservacion = await this.obtCat(
          'Estado Conservacion',
          data.ESTADO_CONSERVACION_TRASFERENTE
        );
        good.estado_conservacion = Number(estadoConservacion);
      }
      if (data.ESTADO_CONSERVACION_SAE) {
        let estadoConservacionSae: any = '';
        estadoConservacionSae = await this.obtCat(
          'Estado Conservacion',
          data.ESTADO_CONSERVACION_SAE
        );
        console.log(estadoConservacionSae);
        if (estadoConservacionSae > 0) {
          good.estado_conservacion_sae = estadoConservacionSae;
        } else {
          good.observaciones =
            good.observaciones +
            ', No se encuentra el estado de conservación INDEP';
          good.estado_conservacion_sae = 0;
          console.log(good.observaciones);
        }
      } else {
        good.estado_conservacion_sae = 0;
      }
      if (data.DESTINO) {
        let destino: any = await this.obtCat('Destino', data.DESTINO);
        good.destino = destino;
      }
      if (data.DESTINO_TRASFERENTE) {
        let destinoTransferente: any = await this.obtCat(
          'Destino',
          data.DESTINO_TRASFERENTE
        );
        good.destino_transferente = destinoTransferente;
      }
      if (data.DESTINO_SAE) {
        let destinoSae: any = '';
        destinoSae = await this.obtCat('Destino', data.DESTINO_SAE);
        console.log(destinoSae);

        if (destinoSae > 0) {
          good.destino_sae = destinoSae;
        } else {
          good.observaciones =
            good.observaciones + ', No se encuentra destino INDEP';
          good.destino_sae = 0;
          console.log(good.observaciones);
        }
      } else {
        good.destino_sae = 0;
      }
      if (data.ID_PROGRAMACION) {
        good.id_programacion = data.ID_PROGRAMACION;
      }
      good.destino_letra = data.DESTINO != undefined ? data.DESTINO : '';
      good.destino_sae_letra =
        data.DESTINO_SAE != undefined ? data.DESTINO_SAE : '';
      good.destino_transferente_letra =
        data.DESTINO_TRASFERENTE != undefined ? data.DESTINO_TRASFERENTE : '';
      good.estado_conservacion_letra =
        data.ESTADO_CONSERVACION_TRASFERENTE != undefined
          ? data.ESTADO_CONSERVACION_TRASFERENTE
          : '';
      good.estado_conservacion_sae_letra =
        data.ESTADO_CONSERVACION_SAE != undefined
          ? data.ESTADO_CONSERVACION_SAE
          : '';
      good.estado_fisico_letra =
        data.ESTADO_FISICO_TRASFERENTE != undefined
          ? data.ESTADO_FISICO_TRASFERENTE
          : '';
      good.estado_fisico_sae_letra =
        data.ESTADO_FISICO_SAE != undefined ? data.ESTADO_FISICO_SAE : '';
      good.unidad_medida_letra =
        data.UNIDAD_MEDIDA_TRASFERENTE != undefined
          ? data.UNIDAD_MEDIDA_TRASFERENTE
          : '';
      good.unidad_medida_sae_letra =
        data.UNIDAD_MEDIDA_SAE != undefined ? data.UNIDAD_MEDIDA_SAE : '';
      console.log(good);
      res(good);
    });
  }
  async performValidationsFor(data: IReceiptGoodItem): Promise<string> {
    return new Promise((res, rej) => {
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
          result = result + coma + 'La cantidad debe ser un entero';
          console.log(result);
          res(result);
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
            console.log(result);

            res(result);
          }
        }
      }
      res('');
    });
  }
  async performOperation(good: IReceiptGoodItem, reasonCanRep: number) {
    return new Promise((res, rej) => {
      let data = {
        P_TIPO_OPERACION:
          this.receiptGenerationForm.controls['operation'].value,
        P_MOTIVOCAN: reasonCanRep,
        P_CANTIDAD_SAE: good.cantidad_sae,
        P_DESTINO_SAE: Number(good.destino_sae),
        P_ESTADO_CONSERVACION_SAE: Number(good.estado_conservacion_sae),
        P_ESTADO_FISICO_SAE: good.estado_fisico_sae,
        P_UNIDAD_MEDIDA_SAE:
          good.unidad_medida_sae != '' ? good.unidad_medida_sae : null,
        P_DESCRIPCION_BIEN_SAE:
          good.descripcion_bien_sae != undefined
            ? good.descripcion_bien_sae != ''
              ? good.descripcion_bien_sae
              : null
            : null,
        P_ID_BIEN: good.id_bien,
        P_ID_PROGRAMACION: good.id_programacion,
        P_USUARIO_CREACION: localStorage.getItem('username'),
      };
      console.log(data);
      this.programmingGoodReceiptService
        .postGoodsProgramingReceipts(data)
        .subscribe({
          next: response => {
            console.log(response);
            res('success');
          },
          error: eror => {
            this.loader.load = false;
            res(eror);
          },
        });
    });
  }
  async updateInfoAssets(good: IReceiptGoodItem) {
    return new Promise((res, rej) => {
      let data = {
        pAmountSae: good.cantidad_sae,
        pDestinationSae: good.destino_sae,
        pStateConservationSae: good.estado_conservacion_sae,
        pStatePhysicalSae: good.estado_fisico_sae,
        pInitExtentSae: good.unidad_medida_sae,
        pDescriptionGoodSae: good.descripcion_bien_sae,
        pIdGood: good.id_bien,
      };
      console.log(data);
      this.programmingGoodReceiptService.postUpdateInfoAssets(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async unitMeasures(type: string) {
    return new Promise((res, rej) => {
      const params = new ListParams();
      params['filter.unit_of_measure_tl'] = `$eq:${type}`;
      this.applicationGoodsQueryService.getAllUnitsQ(params).subscribe({
        next: resp => {
          res(resp.data[0].uom_code);
        },
        error: eror => {
          res('0');
          console.log(eror);
        },
      });
    });
  }
  async obtCat(name: string, description: string) {
    return new Promise((res, rej) => {
      const params = new ListParams();
      params['filter.name'] = name;
      params['filter.description'] = description;
      this.genericService.getAll(params).subscribe({
        next: resp => {
          res(resp.data[0].keyId);
        },
        error: eror => {
          res(0);
        },
      });
    });

    // return keyId;
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
  dowloadGoods() {
    let data = {
      programmingId: this.programmingForm.controls['programmingId'].value,
    };
    this.loader.load = true;
    this.massiveGoodService.postGoodsSchedules(data).subscribe({
      next: response => {
        console.log(response);
        this._downloadExcelFromBase64(response.base64File, response.nameFile);
        this.loader.load = false;
      },
      error: eror => {
        this.alert(
          'warning',
          'El Archivo no tiene Bienes Disponibles para Trabajar',
          ''
        );
        this.loader.load = false;
      },
    });
  }
  goodsDownloadResults() {
    const filename: string =
      'Resultado del archivo(' + this.fileName.split('.') + ')';
    this.excelService.export(this.goodsDownloadExcel, {
      type: 'xlsx',
      filename,
    });
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
          'La cantidad debe se un entero'
        );
        return;
      }
    }
    this.cancellationView1 = false;
    this.reprogramingView1 = false;
    if (sender == 0) {
      this.alertQuestion(
        'question',
        '¿Desea registrar los Bienes con tipo Recibo?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.performOperationSec('UNO', 'RECIBO', 0);
        }
      });
    } else if (sender == 1) {
      this.alertQuestion(
        'question',
        '¿Desea registrar los Bienes con tipo Resguardo?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.performOperationSec('UNO', 'RESGUARDO', 0);
        }
      });
    } else if (sender == 2) {
      this.alertQuestion(
        'question',
        '¿Desea registrar los Bienes con tipo Almacén?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.performOperationSec('UNO', 'ALMACEN', 0);
        }
      });
    }
  }
  performOperationSec(type: string, operation: string, reasonCanRep: number) {
    let data = {
      P_TIPO_OPERACION: operation,
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
          this.alert('success', `Bien agregado a ${operation}`, '');
          this.cleanInsert();
          this.programmingGoodReceipt(new ListParams());
        },
        error: eror => {
          this.alert(
            'warning',
            'Generación de Recibos',
            'No se pudo agregar el Bien al recibo'
          );
        },
      });
  }
  acceptCancellation() {
    if (this.indepForm.controls['cancellation'].value != null) {
      this.alertQuestion(
        'question',
        'Se cancelará la programación',
        '¿Desea continuar?',
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
                'La Cantidad debe ser un entero'
              );
              return;
            }
          }
          this.performOperationSec(
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
        'Debe seleccionar el motivo, de la cancelación'
      );
      return;
    }
  }
  acceptReprogramming() {
    if (this.indepForm.controls['reprogramming'].value != null) {
      this.alertQuestion(
        'question',
        'Se hará una Reprogramación',
        '¿Desea continuar?',
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
                'La cantidad debe ser un entero'
              );
              return;
            }
          }
          this.performOperationSec(
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
        'Debe seleccionar el motivo, de la reprogramación'
      );
      return;
    }
  }
  reprogrammingOne() {
    this.getGenericR(new ListParams());
    this.cancellationView1 = false;
    this.reprogramingView1 = true;
  }
  cancellationOne() {
    this.getGenericC(new ListParams());
    this.cancellationView1 = true;
    this.reprogramingView1 = false;
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
  clearInsertOperation() {
    this.receiptGenerationForm.reset();
    this.fileProgrammingForm.reset();
    this.dataExcel = [];
    this.downloadResults = false;
    this.goodsDownloadExcel = [];
    this.data1.load([]);
    this.data1.refresh();
    this.totalItems = 0;
    this.indepForm1.reset();
    this.cancellationView = false;
    this.reprogramingView = false;
  }
}
