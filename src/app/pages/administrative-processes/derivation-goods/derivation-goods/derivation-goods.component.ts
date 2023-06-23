import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GoodsComponent } from '../goods/goods.component';
import { PwComponent } from '../pw/pw.component';
import { IGood } from 'src/app/core/models/ms-good/good';

@Component({
  selector: 'app-derivation-goods',
  templateUrl: './derivation-goods.component.html',
  styles: [],
})
export class DerivationGoodsComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;

  // Variable para la contraseña
  private _password: string;

  //Deshabilitar el formulario
  wrongModal = true;

  //Variables de BLK_TIPO_BIEN
  no_bien_blk_tipo_bien: number

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private serviceGood: GoodService,
    private serviceGoodProcess: GoodProcessService
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
          if(data != null){
            //Se setea el valor de no_bien
            this.no_bien_blk_tipo_bien = data.goodFatherNumber
            //Se seta los valores de idConversion
            this.idConversion.setValue(data.id)
            this.numberDossier.setValue(data.fileNumber.id)
            this.numberGoodFather.setValue(data.goodFatherNumber)
            //
            console.log(data)
            this.wrongModal = false
            this.tipo.setValue(data.typeConv)
            this.actConvertion.setValue(data.cveActaConv)
            this.numberGoodSon.setValue(data.goodFatherNumber)
            this.searchGoods(data.goodFatherNumber)
            this.searchGoodSon(data.goodFatherNumber)
            this.dataGoods.load([data])
          }
        },
      }, //pasar datos por aca
      class: 'modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };

    const modalRef = this.modalService.show(PwComponent, config);
  }

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

  searchGoodSon(e: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('goodId', e);
    this.serviceGood.getAllFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.observation.setValue(res.data[0]['observations']);
        this.descriptionSon.setValue(res.data[0]['description']);
        this.quantity.setValue(res.data[0]['quantity']);
        this.classifier.setValue(res.data[0]['goodClassNumber']);
        this.unitOfMeasure.setValue(res.data[0]['unit']);
        this.destinationLabel.setValue(res.data[0]['labelNumber']);
        this.searchStatus(res.data[0]['status']);
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

  actConversionBtn() {}

  finishConversion() {}

  bulkUpload() {
    this.router.navigate([
      'pages/administrative-processes/derivation-goods/bulk-upload',
    ]);
  }

  imgUpload() {}

  openModal(): void {
    this.modalService.show(GoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  /* showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Estado cambiado exitosamente !!', { status });
  } */
}
