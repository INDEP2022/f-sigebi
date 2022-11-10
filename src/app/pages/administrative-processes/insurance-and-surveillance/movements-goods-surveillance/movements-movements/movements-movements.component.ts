import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import {
  MOVEMENTS_MOVEMENTS_COLUMNS,
  MOVEMENTS_MOVEMENTS_COLUMNS2,
} from './movements-movements-columns';

@Component({
  selector: 'app-movements-movements',
  templateUrl: './movements-movements.component.html',
  styles: [],
})
export class MovementsMovementsComponent extends BasePage implements OnInit {
  form: FormGroup;

  bienes = new DefaultSelect();
  states = new DefaultSelect();

  concepts: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  prorrateos: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  settings1 = { ...this.settings, actions: false };

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: MOVEMENTS_MOVEMENTS_COLUMNS2,
    };
    this.settings1.columns = MOVEMENTS_MOVEMENTS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      cveContract: [null, Validators.required],
      movementType: [null, Validators.required],
      noReport: [null, Validators.required],
      noBien: [null, Validators.required],
      descriptionState: [null, Validators.required],
      dateReception: [null, Validators.required],
      startDate: [null, Validators.required],
      finishDate: [null, Validators.required],
      applicationDate: [null, Validators.required],
      modsus: [null, Validators.required],
      requestArea: [null, Validators.required],
      resquest: [null, Validators.required],
      timeReception: [null, Validators.required],
      cveProrrateo: [null, Validators.required],
      areaEntrega: [null, Validators.required],
      entrega: [null, Validators.required],
      entregaMotiv: [null, Validators.required],
      zone: [null, Validators.required],
      authorize: [null, Validators.required],
      solicitanteFirm: [null, Validators.required],
      observations: [null, Validators.required],
      consult: [null, Validators.required],

      movement: [null, Validators.required],
      noBien2: [null, Validators.required],
      prorrateo2: [null, Validators.required],
    });
  }

  getBienes(evt: any) {}
  getStates(evt: any) {}
}
