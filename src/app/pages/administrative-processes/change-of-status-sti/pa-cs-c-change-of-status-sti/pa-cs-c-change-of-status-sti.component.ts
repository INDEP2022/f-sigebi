import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { COLUMNS, expediente, Good, statusData } from './columns';

@Component({
  selector: 'app-pa-cs-c-change-of-status-sti',
  templateUrl: './pa-cs-c-change-of-status-sti.component.html',
  styles: [],
})
export class PaCsCChangeOfStatusStiComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  get numberFile() {
    return this.form.get('numberFile');
  }
  get newStatus() {
    return this.form.get('newStatus');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }
  get currentDate() {
    return this.form.get('currentDate');
  }
  get description() {
    return this.form.get('description');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data: Good[];
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
      numberFile: [null, [Validators.required]],
      newStatus: [null, [Validators.required]],
      descriptionStatus: [null, [Validators.required]],
      currentDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  accept() {
    this.changeStatus();
  }

  listGoods() {
    const file = this.numberFile.value;
    const files = expediente;
    let buscar: boolean = false;
    files.forEach(elemnt => {
      if (elemnt.numberFile === file) {
        this.data = elemnt.goods;
        this.currentDate.setValue(new Date());
        buscar = true;
      }
    });
    !buscar ? this.onLoadToast('error', 'Expediente no existe', '') : undefined;
  }

  loadDatesStatus() {
    const status = this.newStatus.value;
    console.log(status);
    const statusD = statusData;
    statusD.forEach(elemnt => {
      if (elemnt.numberStatus === status) {
        this.descriptionStatus.setValue(elemnt.descriptionStatus);
      }
    });
  }

  changeStatus() {
    console.log(this.data);

    /*     this.alertQuestion(
      'warning',
      '¿Desea cambiar los estatus del bien ?',
      ''
    ).then(resp => {
      if (resp.isConfirmed) {
        const status = this.newStatus.value;
        this.data.forEach(elemnt => {
          elemnt.status = status;
          this.onLoadToast('success', 'Estatus Actualizados', '');
        });
      }
    }); */
  }
}
