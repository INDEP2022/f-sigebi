import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared';
import {
  DOUBLE_POSITIVE_PATTERN,
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { GoodsComponent } from '../goods/goods.component';
import { PwComponent } from '../pw/pw.component';
import { ActaConvertionFormComponent } from './acta-convertion-form/acta-convertion.component'; // Importa el componente de tu modal
import { DerivationCharGoodCellComponent } from './derivation-char-good-cell/derivation-char-good-cell.component';
import { DerivationGoodsService } from './derivation-goods.service';
import { ATRIBUT_ACT_COLUMNS } from './devation-columns';
//import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-derivation-goods',
  templateUrl: './derivation-goods.component.html',
  styleUrls: ['./derivation-goods.component.scss'],
})
export class DerivationGoodsComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;

  // Variable para la contraseña
  private _password: string;

  //Deshabilitar el formulario
  wrongModal = true;
  flagCargMasiva: boolean = false;
  flagActa: boolean = false;
  flagFinConversion: boolean = false;
  flagCargaImagenes: boolean = false;
  flagUpdate: boolean = false;
  flagCambia: boolean = false;
  flagGoodNew: boolean = false;
  flagGoodDelete: boolean = false;
  //Variables de BLK_TIPO_BIEN
  numberFoli: number;
  classificationOfGoods: number;
  no_bien_blk_tipo_bien: number;
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedRow: any;
  goodData: any;
  good: any;
  relDocuments: any;
  bkConversionsCveActaCon: any;
  typeAction: boolean = true;
  goodForTableChar: any;

  service = inject(DerivationGoodsService);
  get id() {
    return this.form.get('id');
  }

  get idConversion() {
    return this.form.get('idConversion');
  }
  get numberGoodFather() {
    return this.form.get('numberGoodFather');
  }
  get tipo() {
    return this.form.get('tipo');
  }
  get numberDossier() {
    return this.form.get('numberDossier');
  }
  get status() {
    return this.form.get('status');
  }
  get situation() {
    return this.form.get('situation');
  }
  get actConvertion() {
    return this.form.get('actConvertion');
  }
  get description() {
    return this.form.get('description');
  }
  get numberGoodSon() {
    return this.form.get('numberGoodSon');
  }
  get observation() {
    return this.form.get('observation');
  }
  get descriptionSon() {
    return this.form.get('descriptionSon');
  }
  get quantity() {
    return this.form.get('quantity');
  }
  get classifier() {
    return this.form.get('classifier');
  }
  get unitOfMeasure() {
    return this.form.get('unitOfMeasure');
  }
  get destinationLabel() {
    return this.form.get('destinationLabel');
  }

  attributes: any = [];
  atributNewSettings: any;

  //Settings para la tabla
  settingsGood = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      goodId: {
        title: 'No. Bien Hijo',
        type: 'Number',
        filter: false,
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  goodChange = 0;
  dataGoods = new LocalDataSource();
  dataGoods2: any[] = [];
  conversionId: any;
  goodFatherNumber$ = new BehaviorSubject<any>(undefined);
  filterGood$ = new BehaviorSubject<any>(undefined);
  cveActaConv: any;
  tipoValue: any;
  statusCode: any;
  conversionData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private serviceGood: GoodService,
    private serviceGoodProcess: GoodProcessService,
    private convertiongoodService: ConvertiongoodService,
    private route: ActivatedRoute,
    private historyGoodProcess: HistoryGoodService,
    private documentsService: DocumentsService
  ) {
    super();
    this.atributNewSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: {
        ...ATRIBUT_ACT_COLUMNS,
        value: {
          ...ATRIBUT_ACT_COLUMNS.value,
          type: 'custom',
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: row, good: this.good };
          },
          renderComponent: DerivationCharGoodCellComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return row.data.tableCd ? '' : 'notTableCd';
      },
    };
  }
  ngOnInit(): void {
    this.buildForm();
    this.pw();
    this.tipo.disable();
    //Inicializando el modal
    this.route.queryParams.subscribe(params => {
      if (params['newActConvertion']) {
        this.actConvertion.setValue(params['newActConvertion']);
      }
      if (params['folio']) {
        this.numberFoli = params['folio'] ?? null;
      }
      if (params['tipoConv']) {
        this.tipo.setValue(params['tipoConv'] ?? null);
      }
      // this.actConvertion.setValue(params['expedientNumber'] ?? null);
      if (params['pGoodFatherNumber']) {
        this.numberGoodFather.setValue(params['pGoodFatherNumber'] ?? null);
      }
      if (params['expedientNumber']) {
        this.numberDossier.setValue(params['expedientNumber'] ?? null);
      }

      console.log(this.numberFoli);
      // if (this.numberFoli) {
      //   this.showActasConvertion();
      // }
    });
  }

  pw() {
    this.loader.load = true;
    let config = MODAL_CONFIG;
    config = {
      initialState: {
        ...MODAL_CONFIG,
        callback: (data: any) => {
          if (data != null) {
            console.log(data);
            this.conversionData = data;
            if (this.conversionData) {
              this.no_bien_blk_tipo_bien = data.goodFatherNumber;
              this.idConversion.setValue(data.id);
              this.numberDossier.setValue(
                data.fileNumber != null ? data.fileNumber.id : ''
              );
              this.numberGoodFather.setValue(data.goodFatherNumber);
              this.goodFatherNumber$.next(data.goodFatherNumber);
              this.wrongModal = false;
              this.tipo.setValue(data.typeConv);
              this.actConvertion.setValue(data.cveActaConv);
              this.statusGood(data.goodFatherNumber);
              this.searchGoods(data.goodFatherNumber);
              this.searchGoodSon(data.goodFatherNumber);
              this.searchSituation(data.goodFatherNumber);
              this.searchGoodRelDocuments(data.goodFatherNumber);
              this.getAllGoodChild(data.goodFatherNumber);
              // if (data.typeConv == 2) {
              //   this.getAllGoodChild(data.goodFatherNumber);
              // }
            }
          }
        },
      }, //pasar datos por aca
      class: 'modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };

    const modalRef = this.modalService.show(PwComponent, config);
  }
  getAll() {
    this.loading = false;
    //bien validacion de referencia. refertencia sea igual al noBien padre ? referencia debe ser diferente al bien del padre
    // select no_bien, no_bien_referencia
    // from sera.bien
    // where no_bien != no_bien_referencia
    // and no_bien_referencia = 641346 --Este es el no_bien del padre

    this.form.valueChanges.subscribe(value => {
      this.convertiongoodService
        .getAllGoodsConversions(this.params.getValue(), value.idConversion)
        .subscribe({
          next: response => {
            this.loading = false;
            response.data.map((item: any) => {
              item.idConversion = item.id;
              item.fileNumber =
                item.fileNumber != null ? item.fileNumber : item.idConversion;
            });
            // this.dataGoods2 = response.data;
          },
        });
    });
  }
  getAllGoodChild(good: string) {
    this.serviceGood.getGetReferenceGoodgoodI(good).subscribe({
      next: response => {
        this.dataGoods2 = response.data;
      },
    });
  }
  private buildForm() {
    this.form = this.fb.group({
      id: [null],
      idConversion: [null, [Validators.required]],
      numberGoodFather: [null, [Validators.pattern(NUMBERS_PATTERN)]], //Se quita la validación, en el forms no es requerido
      tipo: [null, [Validators.required]],
      numberDossier: [null, [Validators.pattern(NUMBERS_PATTERN)]], //Se quita la validación, en el forms no es requerido
      status: [null, [Validators.pattern(STRING_PATTERN)]], //Se quita la validación, en el forms no es requerido
      situation: [
        null,
        [Validators.pattern(STRING_PATTERN)], //Se quita la validación, en el forms no es requerido
      ],
      actConvertion: [
        null,
        [Validators.pattern(STRING_PATTERN)], //Se quita la validación, en el forms no es requerido
      ],
      description: [
        null, //Se quita la validación, en el forms no es requerido
      ],
      numberGoodSon: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      observation: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.max(600)],
      ],
      descriptionSon: [null, [Validators.required, Validators.max(1250)]],
      quantity: [
        null,
        [
          Validators.required,
          Validators.pattern(DOUBLE_POSITIVE_PATTERN),
          Validators.max(16),
        ],
      ],
      classifier: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.max(6),
        ],
      ],
      unitOfMeasure: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.max(10),
        ],
      ],
      destinationLabel: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.max(2),
        ],
      ],
    });
    // this.getAll();
  }
  searchGoodRelDocuments(good: string) {
    let params = new ListParams();
    params['filter.goodNumber'] = good;
    this.documentsService.getGoodsRelDocuments(params).subscribe({
      next: response => {
        this.relDocuments = response.data[0];
      },
    });
  }
  searchGoods(e: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('goodId', e);
    this.serviceGood.getAllFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.description.setValue(res.data[0]['description']);
        this.searchStatus(res.data[0]['status']);
      },
      err => {
        console.log(err);
      }
    );
  }

  lastIdConversion: any = null;

  get dataCharacteristics() {
    return this.service.data;
  }

  updateAttributes() {
    // debugger;
    let body: any = {
      id: this.goodForTableChar.id,
      goodId: this.goodForTableChar.goodId,
    };
    let tableValid = true;
    this.dataCharacteristics.forEach(row => {
      if (row.required && !row.value) {
        this.alert(
          'error',
          'Características del Bien ' + this.goodForTableChar.id,
          'Complete el atributo ' + row.attribute
        );
        tableValid = false;
        return;
      }
      body[row.column] = row.value;
    });
    if (!tableValid) {
      return;
    }
    this.serviceGood
      .update(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.alert('success', 'Valores Actualizados Correctamente', '');
          this.getAllGoodChild(this.goodFatherNumber$.getValue());
        },
      });
  }

  async searchGoodSon(e: any) {
    if (this.lastIdConversion !== this.idConversion.value) {
      const conversionData = this.conversionData;
      const paramsF = new FilterParams();
      paramsF.addFilter('goodId', e);
      this.serviceGood.getAllFilter(paramsF.getParams()).subscribe({
        next: res => {
          console.log(res);
          this.good = res.data[0];
          this.goodForTableChar = res.data[0];
          console.log(this.goodForTableChar);
          if (conversionData.typeConv == '2') {
            this.id.setValue(res.data[0]['id']);
            this.observation.setValue(res.data[0]['observations']);
            this.descriptionSon.setValue(res.data[0]['description']);
            this.quantity.setValue(res.data[0]['quantity']);
            this.classifier.setValue(res.data[0]['goodClassNumber']);
            this.unitOfMeasure.setValue(res.data[0]['unit']);
            this.destinationLabel.setValue(res.data[0]['labelNumber']);
            this.statusCode = res.data[0]['status'];
            this.numberGoodSon.setValue(e);
            this.searchStatus(res.data[0]['status']);
            this.classificationOfGoods = Number(res.data[0]['goodClassNumber']);
            if (this.classificationOfGoods) {
              console.log(this.classificationOfGoods);
              setTimeout(() => {
                this.goodChange++;
              }, 1000);
            }
            this.flagCargMasiva = true;
            this.flagCargaImagenes = true;
            this.flagFinConversion = true;
            this.flagCambia = true;
            this.flagUpdate = true;
            this.flagGoodNew = true;
            this.flagGoodDelete = true;
            this.flagCargMasiva = true;

            // this.getAttributesGood(res.data[0]['goodClassNumber']);
          } else if (conversionData.typeConv == '1') {
            this.id.setValue(res.data[0]['id']);
            this.observation.setValue(res.data[0]['observations']);
            this.descriptionSon.setValue(res.data[0]['description']);
            this.quantity.setValue(res.data[0]['quantity']);
            this.classifier.setValue(res.data[0]['goodClassNumber']);
            this.unitOfMeasure.setValue(res.data[0]['unit']);
            this.destinationLabel.setValue(res.data[0]['labelNumber']);
            this.statusCode = res.data[0]['status'];
            this.numberGoodSon.setValue(e);
            this.searchStatus(res.data[0]['status']);
            this.classificationOfGoods = Number(res.data[0]['goodClassNumber']);
            if (this.classificationOfGoods) {
              this.goodChange++;
            }
            this.flagCargMasiva = false;
            this.flagCargaImagenes = false;
            this.flagFinConversion = false;
            this.flagCambia = false;
            this.flagUpdate = false;
            this.flagGoodNew = false;
            this.flagGoodDelete = false;
            this.flagCargMasiva = false;
          }
        },
      });
    }

    // this.form.valueChanges.subscribe(async value => {
    //   if (this.lastIdConversion !== value.idConversion) {
    //     try {
    //       const conversionData = await this.convertiongoodService
    //         .getById(value.idConversion)
    //         .toPromise();
    //       const paramsF = new FilterParams();
    //       paramsF.addFilter('goodId', e);
    //       const res = await this.serviceGood
    //         .getAllFilter(paramsF.getParams())
    //         .toPromise();

    //       this.lastIdConversion = value.idConversion;
    //     } catch (err) {
    //       console.error(err);
    //       // maneja el error
    //     }
    //   }
    // });
  }
  async searchSituation(e: any) {
    this.serviceGoodProcess.getByIdSituation(e).subscribe(
      res => {
        console.log(res);
        this.situation.setValue(res.data[0]['desc_situacion']);
      },
      err => {
        console.log(err);
      }
    );
  }

  searchStatus(data: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('status', data);
    this.serviceGood.getStatusGood(paramsF.getParams()).subscribe(
      res => {
        this.status.setValue(res.data[0]['description']);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateStatus() {
    this.alertQuestion(
      'question',
      `¿Desea cambiar el estatus al bien ${this.numberGoodFather.value}?`,
      ''
    ).then(q => {
      if (q.isConfirmed) {
        this.serviceGood
          .updateGoodStatus(this.numberGoodFather.value, 'CAN')
          .subscribe(
            res => {
              this.alert(
                'success',
                'Se Cambio el Estatus del Bien',
                `El Bien Estatus del Bien con id: ${this.numberGoodFather.value}, fue Cambiado a CAN`
              );
            },
            err => {
              this.alert(
                'error',
                'No se Pudo Cambiar el Estatus del Bien',
                'Se Presentó un Error Inesperado que no Permitió el Cambio de Estatus del Bien, por favor Intentelo Nuevamente'
              );
            }
          );
      }
    });
  }
  updateGood() {
    if (this.goodData.status == 'CVD' || this.goodData.status == 'CAN') {
      this.alert('warning', `El Bien ya ha sido convertido`, ``);
      return;
    }
    console.log(this.numberGoodSon.value);
    if (this.numberGoodSon.value == null) {
      this.alert('warning', `Debe llenar los campos requeridos`, ``);
      return;
    }
    if (this.descriptionSon.value == null) {
      this.alert('warning', `Debe llenar los campos requeridos`, ``);
      return;
    }
    if (this.quantity.value == null) {
      this.alert('warning', `Debe llenar los campos requeridos`, ``);
      return;
    }
    if (this.classifier.value == null) {
      this.alert('warning', `Debe llenar los campos requeridos`, ``);
      return;
    }
    if (this.unitOfMeasure.value == null) {
      this.alert('warning', `Debe llenar los campos requeridos`, ``);
      return;
    }
    if (this.destinationLabel.value == null) {
      this.alert('warning', `Debe llenar los campos requeridos`, ``);
      return;
    }
    this.loader.load = true;
    const data = {
      id: this.id.value,
      goodId: this.numberGoodSon.value,
      observations: this.observation.value,
      quantity: this.quantity.value,
      goodClassNumber: this.classifier.value,
      unit: this.unitOfMeasure.value,
      labelNumber: this.destinationLabel.value,
    };
    console.log(data);
    this.serviceGood.update(data).subscribe(
      res => {
        this.alert('success', 'El Bien se ha Actualizado', ``);
        this.loader.load = false;
      },
      err => {
        this.alert(
          'error',
          'Bien',
          'No se Pudo Actualizar el Bien, por favor Intentelo Nuevamente'
        );
        this.loader.load = false;
      }
    );
  }

  watchFlagChanges(flag: any) {
    this.flagActa = flag;
  }

  statusGood(numberGoodFather: string) {
    this.serviceGood.getById(numberGoodFather).subscribe(
      async res => {
        this.goodData = res;
        console.log('res:', res);
        this.goodData = this.goodData.data[0];
        if (this.goodData.status == 'CVD') {
          this.flagCargMasiva = true;
          this.flagCargaImagenes = true;
          this.flagFinConversion = true;
          this.flagCambia = true;
          this.flagUpdate = true;
          this.flagGoodNew = true;
          this.flagGoodDelete = true;
          this.loader.load = false;
        }
        this.loader.load = false;
      },
      err => {
        console.log(err);
        this.loader.load = false;
      }
    );
  }

  finishConversion() {
    let numberGoodFather = this.form.get('numberGoodFather').value;

    this.serviceGood.getById(numberGoodFather).subscribe(
      async res => {
        this.goodData = res;
        console.log('res:', res);
        this.goodData = this.goodData.data[0];

        // this.finishConversionBeforeValidation(
        //   this.goodData.goodId,
        //   this.goodData.id
        // );
        // return;

        if (this.goodData.status == 'CVD') {
          this.alert(
            'warning',
            'Advertencia',
            'El Bien ya ha Sido Convertido, Anteriormente'
          );
        } else {
          const result = await this.alertQuestion(
            'question',
            '¿Desea Finalizar la Captura de Conversión?',
            ''
          );

          if (result.isConfirmed) {
            this.finishConversionBeforeValidation(
              this.goodData.goodId,
              this.goodData.id
            );
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  finishConversionBeforeValidation(goodId: any, id: any) {
    let dataBien = {
      id: id,
      goodId: goodId,
      status: 'CVD',
    };
    this.serviceGood.update(dataBien).subscribe(
      async res => {
        if (res) {
          this.insertHistoryGood(goodId);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  insertHistoryGood(goodId: any) {
    let user = localStorage.getItem('username');
    let dataBien = {
      propertyNum: goodId,
      status: 'CVD',
      changeDate: new Date(),
      userChange: user,
      statusChangeProgram: 'FCONVBIENHIJOS',
      reasonForChange: 'Conversión de Bienes',
    };

    this.historyGoodProcess.create(dataBien).subscribe(
      async res => {
        console.log('ress historyGoodProcess res:', res);
        if (res) {
          this.updateConversion();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  updateConversion() {
    let idConversion = this.form.get('idConversion').value;
    let conversions = {
      id: parseInt(idConversion),
      cveActaConv: this.form.get('actConvertion').value,
      statusConv: 2,
      typeConv: 2,
    };
    console.log('ress conversions :', conversions);

    this.convertiongoodService.update(idConversion, conversions).subscribe(
      async res => {
        if (res.statusCode == 200 && res.message[0] == 'ok') {
          this.alert('success', 'Conversión Finalizada', '');
          localStorage.removeItem('conversion');
          this.form.reset();
          this.good = [];
          this.goodForTableChar = [];
          this.classificationOfGoods = 0;
          this.goodChange = 0;
          this.conversionData = [];
          this.dataGoods2 = [];
          this.form.reset();
          this.pw();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  bulkUpload() {
    console.log(this.conversionData);
    localStorage.setItem('conversion', JSON.stringify(this.conversionData));
    this.router.navigate(
      ['pages/administrative-processes/derivation-goods/bulk-upload'],
      {
        queryParams: {
          pGoodFatherNumber: this.form.value.numberGoodFather,
          expedientNumber: this.form.value.numberDossier,
          classificationOfGoods: this.classificationOfGoods,
        },
      }
    );
  }

  imgUpload() {
    localStorage.setItem('conversion', JSON.stringify(this.conversionData));
    let numberGoodFather = this.form.get('numberGoodFather').value;

    this.serviceGood.getById(numberGoodFather).subscribe(
      async res => {
        this.goodData = res;
        console.log('res:', res);
        this.goodData = this.goodData.data[0];
        // localStorage.setItem('selectedGoodsForPhotos', this.form.value.numberGoodFather);
        this.router.navigate(['pages/general-processes/good-photos'], {
          queryParams: {
            numberGood: this.form.value.numberGoodFather,
            origin: 'FCONVBIENHIJOS',
          },
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  openModal(): void {
    this.loading = false;
    this.modalService.show(GoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  applyGood(event: any) {
    if (this.goodData.status == 'CVD' || this.goodData.status == 'CAN') {
      this.alert('warning', `El Bien ya ha sido convertido`, ``);
      return;
    }
    // if (this.tipo.value == '2') {
    //   this.alert(
    //     'warning',
    //     `No se puede crear Bienes hijos en un Bien tipo Conversión`,
    //     ``
    //   );
    //   return;
    // }

    console.log(this.good);
    this.alertQuestion(
      'question',
      `Se Agregará un Bien Hijo`,
      '¿Desea Continuar?'
    ).then(q => {
      if (q.isConfirmed) {
        this.loader.load = true;
        let good = this.good;
        delete good.id;
        delete good.goodId;
        delete good.statusDetails;
        delete good.menaje;
        good.goodReferenceNumber = this.goodFatherNumber$.getValue();
        good.almacen =
          this.good.almacen != null ? this.good.almacen.idWarehouse : '';
        good.delegationNumber = this.good.delegationNumber.id;
        good.expediente = this.good.expediente.id;
        good.subDelegationNumber = this.good.subDelegationNumber.id;
        good.lotNumber =
          this.good.lotNumber != null ? this.good.lotNumber.id : null;
        good.observations = this.observation.value;
        good.description = this.description.value;
        good.quantity = this.quantity.value;
        good.classifier = this.classifier.value;
        good.unit = this.unitOfMeasure.value;
        good.labelNumber = this.destinationLabel.value;
        console.log(good);
        this.serviceGood.crateGood(good).subscribe(
          res => {
            this.createRelDocument(res);
            this.loader.load = false;
          },
          err => {
            this.loader.load = false;
            this.alert(
              'error',
              'No. Bien Hijo',
              'Error Inesperado, Por Favor Intentelo Nuevamente'
            );
          }
        );
      }
    });
  }
  createRelDocument(good: any) {
    let documentGood = this.relDocuments;
    delete documentGood.goodNumber;
    documentGood.goodNumber = good.goodId;
    this.documentsService.createRelDocument(documentGood).subscribe(
      res => {
        this.alert(
          'success',
          'Bien Hijo Agregado Correctamente',
          `Id: ${good.goodId}`
        );
        this.getAllGoodChild(this.goodFatherNumber$.getValue());
      },
      err => {
        this.alert('error', 'No se Pudo Agregar el Bien', '');
      }
    );
  }
  //Eliminar bien hijo
  deletGood(event: any) {
    if (this.tipo.value == '2') {
      this.alert(
        'warning',
        `No se puede crear Bienes hijos en un Bien tipo Conversión`,
        ``
      );
      return;
    }
    //console.log("el evento es -> ",this.selectedRow.data);
    if (event != null && this.selectedRow != undefined) {
      //console.log("el evento es -> ",JSON.stringify(this.selectedRow));
      console.log('status->', this.selectedRow);
      if (this.selectedRow.status == 'CVD') {
        this.alert(
          'error',
          `El Bien con Id: ${this.numberGoodFather.value}`,
          `ya ha Sido Convertido`
        );
      }

      console.log('status2->', this.selectedRow);
      this.alertQuestion(
        'question',
        `Bien Hijo a Eliminar No. ${this.selectedRow.goodId}`,
        '¿Desea Continuar?'
      ).then(q => {
        if (q.isConfirmed) {
          this.loader.load = true;
          let data = {
            id: this.selectedRow.id,
            goodId: this.selectedRow.goodId,
          };
          this.serviceGood.removeGood(data).subscribe(
            res => {
              this.alert(
                'success',
                'Se Eliminó el Bien',
                `El Bien con id: ${this.selectedRow.goodId}, fue Eliminado`
              );
              this.getAllGoodChild(this.goodFatherNumber$.getValue());
              delete this.selectedRow;
              this.loader.load = false;
            },
            err => {
              this.alert('error', 'error ', err.message);
              this.loader.load = false;
            }
          );
        }
      });
    } else {
      this.alert('warning', 'No hay Registro Seleccionado', '');
    }
  }

  onRowSelect(event: any) {
    console.log(event.data);
    this.id.setValue(event.data.id);
    this.numberGoodSon.setValue(event.data.goodId);
    this.observation.setValue(event.data.observations);
    this.descriptionSon.setValue(event.data.description);
    this.quantity.setValue(event.data.quantity);
    this.classifier.setValue(event.data.goodClassNumber);
    this.unitOfMeasure.setValue(event.data.unit);
    this.destinationLabel.setValue(event.data.labelNumber);
    this.selectedRow = event.data;
    this.goodForTableChar = event.data;
    this.goodChange++;
    // this.getAttributesGood(event.data.noClassifGood);
  }
  // getAttributesGood(event: any) {
  //   this.serviceGood.getAllFilterClassification(event).subscribe(
  //     res => {
  //       this.attributes = [];
  //       console.log('getAllFilterClassification -> ', res);
  //       for (let i = 0; i < res.data.length; i++) {
  //         let value = '';
  //         for (const index in this.good) {
  //           if (index === `val${res.data[i].columnNumber}`) {
  //             console.log('this.good -> ', this.good[index]);
  //             value = this.good[index];
  //           }
  //         }
  //         this.attributes.push({
  //           attributes: res.data[i].attribute,
  //           value: value,
  //         });
  //       }
  //       // this.attributes = res.data.map(objeto => objeto.attribute);
  //       // console.log(this.attributes);
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }

  /* showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Estado cambiado exitosamente !!', { status });
  } */

  showActasConvertion() {
    console.log(this.tipo.value);
    if (this.tipo.value == '2') {
      if (this.goodData.status == 'CVD') {
        localStorage.removeItem('conversion');
      } else {
        localStorage.setItem('conversion', JSON.stringify(this.conversionData));
      }
      let config = { ...MODAL_CONFIG, class: 'modal-xl modal-dialog-centered' };
      console.log(this.numberDossier.value);
      config.initialState = {
        proceeding: {},
        numberFoli: this.numberFoli,
        actConvertion: this.actConvertion.value,
        tipoConv: this.tipo.value,
        pGoodFatherNumber: this.numberGoodFather.value,
        expedientNumber: this.numberDossier.value,
        idConversion: this.form.get('idConversion').value,
        callback: (receipt: any, keyDoc: string) => {
          if (receipt && keyDoc) {
          }
        },
      };
      this.modalService.show(ActaConvertionFormComponent, config);
      console.log(this.form.value.tipo);
      // this.router.navigate(
      //   ['/pages/administrative-processes/derivation-goods'],
      //   {
      //     queryParams: {
      //       actConvertion: this.actConvertion.value,
      //       tipoConv: this.tipo.value,
      //       pGoodFatherNumber: this.numberGoodFather.value,
      //     },
      //   }
      // );
    } else {
      this.alert(
        'warning',
        `Advertencia`,
        'Para Cargar el Acta debe ser Tipo Conversión'
      );
    }
  }
  session() {
    localStorage.removeItem('conversion');
    this.form.reset();
    this.good = [];
    this.goodForTableChar = [];
    this.classificationOfGoods = 0;
    this.goodChange = 0;
    this.conversionData = [];
    this.dataGoods2 = [];
    this.pw();
  }
  clean() {
    this.observation.setValue('');
    this.descriptionSon.setValue('');
    this.quantity.setValue('');
    this.classifier.setValue('');
    this.unitOfMeasure.setValue('');
    this.destinationLabel.setValue('');
    this.numberGoodSon.setValue('');
  }
}
