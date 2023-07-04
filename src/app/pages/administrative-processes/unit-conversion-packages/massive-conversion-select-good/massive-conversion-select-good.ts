import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { V_GOOD_COLUMNS } from './columns.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-massive-conversion-select-good',
  templateUrl: './massive-conversion-select-good.html',
  styleUrls: [],
})
export class MassiveConversionSelectGoodComponent
  extends BasePage
  implements OnInit
{
  //Params para navegación
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  limit = new FormControl(10);
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
    columns: V_GOOD_COLUMNS,
    noDataMessage: 'No se encontrarón registros',
  };

  data = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private rNomenclaService: ParametersService,
    private packageGoodService: PackageGoodService,
    private trackerGoodService: GoodTrackerService,
    private bsModel: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      goodClassification: [null, []],
      targetTag: [null, []],
      goodStatus: [null, []],
      measurementUnit: [null, []],
      transferent: [null, []],
      warehouse: [null, []],
    });
  }

  emitDelegation(delegation: any) {
    this.descData.descDelegation = delegation;
  }

  settingChange($event: any): void {
    this.settingsTable = $event;
  }

  closeModal() {
    this.bsModel.hide();
  }

  delegationWhere() {
    return new Promise((resolve, reject) => {
      if (this.delegation.value != null) {
        this.rNomenclaService
          .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
          .subscribe(
            res => {
              //Respuesta de FA_EDO_FISICO
              let edo = JSON.parse(JSON.stringify(res));
              //Parametros de filtro para búsqueda
              const paramsF = new FilterParams();
              paramsF.addFilter('id', this.delegation.value);
              paramsF.addFilter('etapaEdo', edo.stagecreated);
              this.delegationService.getFiltered(paramsF.getParams()).subscribe(
                async res => {
                  const arrayDelegations = await Promise.all(
                    res['data'].map((item: any) => {
                      return item.description;
                    })
                  );
                  resolve({ res: arrayDelegations });
                },
                err => {
                  console.log(err);
                }
              );
            },
            err => {
              console.log(err);
            }
          );
      }
    });
  }

  goodsWhere() {
    return new Promise((resolve, reject) => {
      const paramsEnc = new FilterParams();
      paramsEnc.addFilter('statuspack', 'X', SearchFilter.NOT);
      this.packageGoodService
        .getPaqDestinationEnc(paramsEnc.getParams())
        .subscribe(
          async res => {
            const arrayNoPack = await Promise.all(
              res['data'].map((item: any) => {
                return item.numberPackage;
              })
            );
            //Búsqueda de números de bien
            const paramsDet = new FilterParams();
            paramsDet.addFilter(
              'numberPackage',
              arrayNoPack.toString(),
              SearchFilter.IN
            );
            this.packageGoodService
              .getPaqDestinationDet(paramsDet.getParams())
              .subscribe(
                async res => {
                  const arrayNoGood = await Promise.all(
                    res['data'].map((item: any) => {
                      return item.numberGood;
                    })
                  );

                  resolve({ res: arrayNoGood.toString() });
                },
                err => {
                  console.log(err);
                }
              );
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  async filter() {
    this.loading = true;
    const generalParams = new FilterParams();

    if (this.delegation.value != null) {
      const whereDelegation = await this.delegationWhere();
      console.log(JSON.parse(JSON.stringify(whereDelegation)).res);
      generalParams.addFilter(
        'coordinateadmin',
        JSON.parse(JSON.stringify(whereDelegation)).res,
        SearchFilter.IN
      );
    }

    //Where de número de clasificación
    if (this.goodClassification.value != null) {
      generalParams.addFilter(
        'numberClassifyGood',
        this.goodClassification.value
      );
    }
    //Where de número de etiqueta
    if (this.targetTag.value != null) {
      generalParams.addFilter('numberLabel', this.targetTag.value);
    }
    //Where de unidad de medidad
    if (this.measurementUnit.value != null) {
      generalParams.addFilter('unitExtent', this.measurementUnit.value);
    }
    //Where de estatus
    if (this.goodStatus.value != null) {
      generalParams.addFilter('status', this.goodStatus.value);
    }
    //Where de número de transferente
    if (this.transferent.value != null) {
      generalParams.addFilter('dTransferee', this.transferent.value);
    }
    //Where de almacén
    if (this.warehouse.value != null) {
      generalParams.addFilter('numberStore', this.warehouse.value);
    }

    const whereNoGoods = await this.goodsWhere()
    console.log(JSON.parse(JSON.stringify(whereNoGoods)).res);
    generalParams.addFilter(
      'goodNumber',
      JSON.parse(JSON.stringify(whereNoGoods)).res,
      SearchFilter.NOTIN
    );

    if (generalParams.getParams().length > 0) {
      this.trackerGoodService
        .getTvGoodTrackerFilter(generalParams.getParams())
        .subscribe(
          res => {
            console.log(res);
            this.data.load(res.data);
            this.totalItems = res.count
            this.alert('success', 'Se encontraron registros', '');
            this.loading = false;
          },
          err => {
            console.log(err);
            this.alert(
              'warning',
              'La consulta no recuperó ningún registro',
              ''
            );
            this.loading = false;
          }
        );
    }
  }
}
