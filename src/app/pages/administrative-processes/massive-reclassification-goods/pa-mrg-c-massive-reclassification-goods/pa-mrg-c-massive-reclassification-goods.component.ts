import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
//import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { COLUMNS } from './columns';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PaMrgCModalClassificationGoodsComponent } from '../pa-mrg-c-modal-classification-goods/pa-mrg-c-modal-classification-goods.component';

@Component({
  selector: 'app-pa-mrg-c-massive-reclassification-goods',
  templateUrl: './pa-mrg-c-massive-reclassification-goods.component.html',
  styles: [],
})
export class PaMrgCMassiveReclassificationGoodsComponent
  extends BasePage
  implements OnInit
{
  data: any[] = [];

  included: boolean = false;
  form: FormGroup;

  get mode() {
    return this.form.get('mode');
  }
  get numberClassificationGood() {
    return this.form.get('numberClassificationGood');
  }
  get description() {
    return this.form.get('description');
  }
  get filterByStatus() {
    return this.form.get('filterByStatus');
  }
  get numberClassificationGoodAlterning() {
    return this.form.get('numberClassificationGoodAlterning');
  }
  get descriptionAlternating() {
    return this.form.get('descriptionAlternating');
  }
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      mode: [null, [Validators.required]],
      numberClassificationGood: [null, [Validators.required]],
      description: [null, [Validators.required]],
      filterByStatus: [null, [Validators.required]],
      numberClassificationGoodAlterning: [null, [Validators.required]],
      descriptionAlternating: [null, [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openQuestion() {
    this.alertQuestion(
      'question',
      '¿ Desea cambiar la calsificación de los bienes Seleccionado ?',
      '',
      'Cambiar'
    ).then(resp => {
      resp.isConfirmed ? this.changeClassification() : undefined;
    });
  }

  changeClassification() {
    console.log('Se cambiaron los datos de forma masiva');
  }

  inludedRabio() {
    this.included = true;
  }

  listGoods() {
    if (this.mode.value === 'include') {
      this.data = [
        {
          reclassify: false,
          goodNumber: '1',
          DescriptionClassification: 'Descripcion de la clasificacion 1',
          status: 'Estatus 1',
          descriptionGood: 'Descripcion del bien 1',
        },
        {
          reclassify: false,
          goodNumber: '2',
          DescriptionClassification: 'Descripcion de la clasificacion 2',
          status: 'Estatus 1',
          descriptionGood: 'Descripcion del bien 2',
        },
        {
          reclassify: false,
          goodNumber: '3',
          DescriptionClassification: 'Descripcion de la clasificacion 3',
          status: 'Estatus 3',
          descriptionGood: 'Descripcion del bien 3',
        },
      ];
    }
  }
  openModal(): void {
    this.modalService.show(PaMrgCModalClassificationGoodsComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
