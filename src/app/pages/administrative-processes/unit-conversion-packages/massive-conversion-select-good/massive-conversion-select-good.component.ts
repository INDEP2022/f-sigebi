import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_SELECTIONS_COLUMNS } from '../massive-conversion/columns';
import { UnitConversionPackagesDataService } from '../services/unit-conversion-packages-data.service';

@Component({
  selector: 'app-massive-conversion-select-good',
  templateUrl: './massive-conversion-select-good.component.html',
  styleUrls: [],
})
export class MassiveConversionSelectGoodComponent
  extends BasePage
  implements OnInit
{
  //Forma
  form: FormGroup;

  get delegation() {
    return this.form ? this.form.get('delegation') : null;
  }

  get goodClassification() {
    return this.form ? this.form.get('goodClassification') : null;
  }

  get targetTag() {
    return this.form ? this.form.get('targetTag') : null;
  }

  get goodStatus() {
    return this.form ? this.form.get('goodStatus') : null;
  }

  get measurementUnit() {
    return this.form ? this.form.get('measurementUnit') : null;
  }

  get transferent() {
    return this.form ? this.form.get('transferent') : null;
  }

  get warehouse() {
    return this.form ? this.form.get('warehouse') : null;
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
    private delegationService: DelegationService,
    private unitConversionPackagesDataService: UnitConversionPackagesDataService
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit(): void {}

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

  async pbIngresar() {
    console.log('Agregar bienes');
    this.clearPrevisualizationData();
  }

  private async clearPrevisualizationData() {
    let eliminateGoods: boolean = false;
    if (
      this.unitConversionPackagesDataService.dataPrevisualization.length > 0
    ) {
      this.alertQuestion(
        'warning',
        'Paquete con bienes',
        '¿Desea eliminarlos?'
      ).then(question => {
        if (question.isConfirmed) {
          eliminateGoods = true;
        }
      });
    }
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
