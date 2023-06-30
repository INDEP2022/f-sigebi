import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GoodsComponent } from '../goods/goods.component';
import { PwComponent } from '../pw/pw.component';
import { ActaConvertionFormComponent } from './acta-convertion-form/acta-convertion.component'; // Importa el componente de tu modal
import { IGood } from 'src/app/core/models/good/good.model';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
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
  //Variables de BLK_TIPO_BIEN

  no_bien_blk_tipo_bien: number;
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedRow: any;
  goodData: any;

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

  attributes: any;

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

  dataGoods = new LocalDataSource();
  dataGoods2: any[] = [];
  conversionId: any;
  goodFatherNumber$ = new BehaviorSubject<any>(undefined);
  filterGood$ = new BehaviorSubject<any>(undefined);

  cveActaConv: any;
  tipoValue: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private serviceGood: GoodService,
    private serviceGoodProcess: GoodProcessService,
    private convertiongoodService: ConvertiongoodService,
    private route: ActivatedRoute,
    private historyGoodProcess: HistoryGoodService
  ) {
    super();
  }
  ngOnInit(): void {
    this.buildForm();

    //Inicializando el modal
    let config = MODAL_CONFIG;
    config = {
      initialState: {
        ...MODAL_CONFIG,
        callback: (data: any) => {
          if (data != null) {
            //Se setea el valor de no_bien
            this.no_bien_blk_tipo_bien = data.goodFatherNumber;
            //Se seta los valores de idConversion
            this.idConversion.setValue(data.id);
            this.numberDossier.setValue(data.fileNumber.id);
            this.numberGoodFather.setValue(data.goodFatherNumber);
            //
            this.goodFatherNumber$.next(data.goodFatherNumber);
            console.log(data);
            this.wrongModal = false;
            this.tipo.setValue(data.typeConv);
            this.actConvertion.setValue(data.cveActaConv);
            this.searchGoods(data.goodFatherNumber);
            this.searchGoodSon(data.goodFatherNumber);
          }
        },
      }, //pasar datos por aca
      class: 'modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };

    const modalRef = this.modalService.show(PwComponent, config);
  }

  getAll() {
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

            this.dataGoods2 = response.data;
          },
        });
    });
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
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
        null,
        [Validators.pattern(STRING_PATTERN)], //Se quita la validación, en el forms no es requerido
      ],
      numberGoodSon: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      observation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionSon: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      quantity: [null, [Validators.required]],
      classifier: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unitOfMeasure: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      destinationLabel: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.getAll();
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

  // Define una variable para almacenar el último id de conversión consultado
  lastIdConversion: any = null;

  async searchGoodSon(e: any) {
    this.form.valueChanges.subscribe(async value => {
      // Comprueba si el id de conversión ha cambiado
      if (this.lastIdConversion !== value.idConversion) {
        try {
          const conversionData = await this.convertiongoodService
            .getById(value.idConversion)
            .toPromise();
          const paramsF = new FilterParams();
          paramsF.addFilter('goodId', e);
          const res = await this.serviceGood
            .getAllFilter(paramsF.getParams())
            .toPromise();
          // if (conversionData.typeConv === '1') {
          if (conversionData.typeConv === '2') {
            this.observation.setValue(res.data[0]['observations']);
            this.descriptionSon.setValue(res.data[0]['descriptionSon']);
            this.quantity.setValue(res.data[0]['quantity']);
            this.classifier.setValue(res.data[0]['goodClassNumber']);
            this.unitOfMeasure.setValue(res.data[0]['unit']);
            this.destinationLabel.setValue(res.data[0]['labelNumber']);
            this.numberGoodSon.setValue(e);
            this.searchStatus(res.data[0]['status']);
            this.getAttributesGood(e);
            this.flagActa = true;
            this.flagCargMasiva = false;
            this.flagCargaImagenes = false;
            this.flagFinConversion = false;
          } else if (conversionData.typeConv === '2') {
            this.observation.setValue('');
            this.descriptionSon.setValue('');
            this.quantity.setValue('');
            this.classifier.setValue('');
            this.unitOfMeasure.setValue('');
            this.destinationLabel.setValue('');
            this.numberGoodSon.setValue('');
            this.searchStatus('');

            this.flagActa = false;
            this.flagCargMasiva = true;
            this.flagCargaImagenes = true;
            this.flagFinConversion = true;
          }

          // Actualiza el último id de conversión consultado
          this.lastIdConversion = value.idConversion;
        } catch (err) {
          console.error(err);
          // maneja el error
        }
      }
    });
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
                'Se cambio el estatus del Bien',
                `El Bien estatus del bien con id: ${this.numberGoodFather.value}, fue cambiado a CAN`
              );
            },
            err => {
              this.alert(
                'error',
                'No se pudo cambiar el estatus del bien',
                'Se presentó un error inesperado que no permitió el cambio de estatus del bien, por favor intentelo nuevamente'
              );
            }
          );
      }
    });
  }

  watchFlagChanges(flag: any) {
    this.flagActa = flag;
  }

  actConversionBtn() {}

  finishConversion() {
    let numberGoodFather = this.form.get('numberGoodFather').value;

    this.serviceGood.getById(numberGoodFather).subscribe(
      async res => {
        this.goodData = res;
        console.log('res:', res);
        this.goodData = this.goodData.data[0];
        console.log('goodData:', this.goodData);

        if (this.goodData.status == 'CVD') {
          this.alert(
            'warning',
            'Advertencia',
            'El bien ya ha sido convertido, anteriormente'
          );
        } else {
          const result = await this.alertQuestion(
            'question',
            'Finalizar conversión',
            '¿ Estas seguro de FINALIZAR la captura de la conversión ?'
          );

          if (result.isConfirmed) {
            console.log('ddd');
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
    console.log('dataBien', dataBien);
    this.insertHistoryGood();

    // this.serviceGood.update(dataBien).subscribe(
    //   async res => {
    //     console.log('ress serviceGood update:', res);

    //     this.insertHistoryGood();
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  insertHistoryGood() {
    let user = localStorage.getItem('username');
    let dataBien = {
      propertyNum: this.no_bien_blk_tipo_bien,
      status: 'CVD',
      changeDate: new Date(),
      userChange: user,
      statusChangeProgram: 'FCONVBIENHIJOS',
      reasonForChange: 'Conversión de Bienes',
    };

    console.log('dataBien', dataBien);

    console.log('no_bien_blk_tipo_bien', this.no_bien_blk_tipo_bien);
    this.updateConversion();
    /*
    this.historyGoodProcess.create(dataBien).subscribe(
      async res => {
        console.log('ress historyGoodProcess res:', res);
      },
      err => {
        console.log(err);
      }
    );
    */
  }

  updateConversion() {
    let idConversion = this.form.get('idConversion').value;
    let conversions = {
      id: idConversion,
      statusConv: 'estatus conv',
    };
    console.log('ress conversions :', conversions);

    /*
    this.convertiongoodService.update(idConversion, conversions).subscribe(
      async res => {
        console.log('ress updateConversion res:', res);
      },
      err => {
        console.log(err);
      }
    );*/
  }

  bulkUpload() {
    this.router.navigate([
      'pages/administrative-processes/derivation-goods/bulk-upload',
    ]);
  }

  imgUpload() {
    let numberGoodFather = this.form.get('numberGoodFather').value;

    this.serviceGood.getById(numberGoodFather).subscribe(
      async res => {
        this.goodData = res;
        console.log('res:', res);
        this.goodData = this.goodData.data[0];
        localStorage.setItem('derivationGoodId', this.goodData.goodId);
        this.router.navigate(['pages/general-processes/goods-characteristics']);
      },
      err => {
        console.log(err);
      }
    );
  }

  openModal(): void {
    this.modalService.show(GoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  applyGood(event: any) {
    /* if (
      this.selectedRow.status === 'CVD' ||
      this.selectedRow.status === 'CAN'
    ) {
      this.alert(
        'error',
        `El Bien estatus del bien con id: ${this.numberGoodFather.value}`,
        `ya ha sido convertido`
      );
    }*/
    this.serviceGood.getGoods(this.goodFatherNumber$.getValue()).subscribe(
      res => {
        const data = res;
        this.filterGood$.next(data);
      },
      err => {
        console.log(err);
      }
    );
    console.log('NEWGOODS1', this.filterGood$.getValue().data);
    let payload = this.filterGood$.getValue().data;
    payload = payload.map((item: any) => {
      delete item.almacen;
      delete item.delegationNumber;
      delete item.expediente;
      delete item.menaje;
      delete item.statusDetails;
      delete item.subDelegationNumber;
      return item;
    });
    delete payload.almacen;
    console.log('NEWGOODS2', payload);
    this.serviceGood.crateGood(payload[0]).subscribe(
      res => {
        this.alert('success', 'se ha agregado el Bien', `con el id: ${res.id}`);
      },
      err => {
        this.alert(
          'error',
          'No se pudo cambiar el estatus del bien',
          'Se presentó un error inesperado que no permitió el cambio de estatus del bien, por favor intentelo nuevamente'
        );
      }
    );

    this.serviceGood.getGoods(this.goodFatherNumber$.getValue()).subscribe(
      res => {
        const data = res;
        this.filterGood$.next(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  onRowSelect(event: any) {
    this.numberGoodSon.setValue(event.data.goodId);
    this.observation.setValue(event.data.descriptionConv);
    this.descriptionSon.setValue(event.data.descriptionSon);
    this.quantity.setValue(event.data.amount);
    this.classifier.setValue(event.data.noClassifGood);
    this.unitOfMeasure.setValue(event.data.unit);
    this.destinationLabel.setValue(event.data.noLabel);
    this.selectedRow = event.data;

    this.getAttributesGood(event.data);
  }

  getAttributesGood(event: any) {
    this.serviceGood.getAttributesGood(event.goodId).subscribe(
      res => {
        delete res.goodNumber;
        this.attributes = Object.entries(res).filter(([key, value]) => value);
      },
      err => {
        console.log(err);
      }
    );
  }

  /* showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Estado cambiado exitosamente !!', { status });
  } */

  showActasConvertion() {
    let config = { ...MODAL_CONFIG, class: 'modal-xl modal-dialog-centered' };
    config.initialState = {
      proceeding: {},
      idProgramming: 1,
      callback: (receipt: any, keyDoc: string) => {
        if (receipt && keyDoc) {
        }
      },
    };
    this.loading = true;
    this.modalService.show(ActaConvertionFormComponent, config);
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        actConvertion: this.form.value.actConvertion,
      },
    });
    this.modalService.show(ActaConvertionFormComponent, config);
  }
}
