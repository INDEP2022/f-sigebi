import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_SELECTIONS_COLUMNS } from '../massive-conversion/columns';

@Component({
  selector: 'app-massive-conversion-select-good',
  templateUrl: './massive-conversion-select-good.html',
  styleUrls: [],
})
export class MassiveConversionSelectGoodComponent
  extends BasePage
  implements OnInit
{
  //Forma
  form: FormGroup = new FormGroup({});

  get delegation() {
    return this.form.get('delegation');
  }

  get goodClassification() {
    return this.form.get('goodClassification');
  }

  get targetTag() {
    return this.form.get('targetTag');
  }

  get goodStatus() {
    return this.form.get('goodStatus');
  }

  get measurementUnit() {
    return this.form.get('measurementUnit');
  }

  get transferent() {
    return this.form.get('transferent');
  }

  get warehouse() {
    return this.form.get('warehouse');
  }

  //Delegacion
  descData: {
    descDelegation: string;
  };
  //Settings de la tabla
  settingsTable = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: GOODS_SELECTIONS_COLUMNS,
    noDataMessage: 'No se encontrarón registros',
  };

  data = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      goodClassification: [null, [Validators.required]],
      targetTag: [null, [Validators.required]],
      goodStatus: [null, [Validators.required]],
      measurementUnit: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
    });
  }

  emitDelegation(delegation: any) {
    this.descData.descDelegation = delegation;
  }

  settingChange($event: any): void {
    this.settingsTable = $event;
  }

  filter() {
    const paramsF = new FilterParams();
    paramsF.addFilter('id', this.delegation.value);
    this.delegationService.getFiltered(paramsF.getParams()).subscribe(
      res => {},
      err => {}
    );
  }
}
