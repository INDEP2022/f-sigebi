import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { COLUMNS } from './columns';

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

  data: any;
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

  accept() {}
  listGoods() {
    this.data = [
      {
        goodNumber: '1',
        DescriptionGood: 'Descripcion de la clasificacion 1',
        status: 'Estatus 1',
        check: false,
      },
      {
        goodNumber: '1',
        DescriptionGood: 'Descripcion de la clasificacion 1',
        status: 'Estatus 1',
        check: false,
      },
      {
        goodNumber: '1',
        DescriptionGood: 'Descripcion de la clasificacion 1',
        status: 'Estatus 1',
        check: false,
      },
    ];
  }
}
