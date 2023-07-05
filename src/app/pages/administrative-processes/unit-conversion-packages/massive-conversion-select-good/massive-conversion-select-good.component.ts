import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UnitConversionPackagesDataService } from '../services/unit-conversion-packages-data.service';
import { goodCheck, V_GOOD_COLUMNS } from './columns';

@Component({
  selector: 'app-massive-conversion-select-good',
  templateUrl: './massive-conversion-select-good.component.html',
  styleUrls: [],
})
export class MassiveConversionSelectGoodComponent
  extends BasePage
  implements OnInit
{
  //Variables que recibe
  paqDestinationGoodLenght: number;
  clearPaqDestination: boolean;
  //Params para navegación
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  limit = new FormControl(10);
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
    columns: V_GOOD_COLUMNS,
    noDataMessage: 'No se encontrarón registros',
  };

  data = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private unitConversionPackagesDataService: UnitConversionPackagesDataService,
    private rNomenclaService: ParametersService,
    private packageGoodService: PackageGoodService,
    private trackerGoodService: GoodTrackerService,
    private transferentService: TransferenteService,
    private survillanceService: SurvillanceService,
    private bsModel: BsModalRef
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit(): void {}

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

  private obtainVCuenta(numberGood: number) {
    return this.survillanceService.getVCuentaNoBien(numberGood).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of(0))
    );
  }

  private obtainTransferent(transferent: any) {
    return this.transferentService.getById(transferent).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of(null))
    );
  }

  private obtainDelegation(coord_admin: string) {
    const filterParams = new FilterParams();
    filterParams.addFilter('description', coord_admin);
    return this.delegationService.getAll(filterParams.getParams()).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of({ data: [] })),
      map(x => (x.data.length > 0 ? x.data[0] : null))
    );
  }

  private async fillGoodPaqDestino(v_bani: boolean) {
    let V_BANR = true;
    goodCheck.forEach(async good => {
      if (v_bani) {
        this.unitConversionPackagesDataService.dataPrevisualization.forEach(
          rowPq => {
            if (rowPq.numberGood === good.goodNumber) {
              V_BANR = false;
            }
          }
        );
      }

      if (V_BANR) {
        const V_CUENTA = await firstValueFrom(
          this.obtainVCuenta(good.goodNumber)
        );
        if (V_CUENTA > 0) {
          V_BANR = false;
        }
      }
      if (V_BANR) {
        const V_NO_TRANSFERENTE = await firstValueFrom(
          this.obtainTransferent(good.transferent)
        );
        const V_NO_DELEGACION = await firstValueFrom(
          this.obtainDelegation(good.coord_admin)
        );
      }
    });
  }

  private clearPrevisualizationData() {
    let v_bani: boolean;
    if (this.paqDestinationGoodLenght > 0) {
      this.alertQuestion(
        'question',
        '¿El paquete tiene bienes, se eliminan?',
        '',
        'Eliminar'
      ).then(q => {
        if (q.isConfirmed) {
          this.clearPaqDestination = true;
          v_bani = false;
        } else {
          v_bani = true;
        }
        this.fillGoodPaqDestino(v_bani);
      });
    }
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

  private goodsWhere() {
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

    const whereNoGoods = await this.goodsWhere();
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
            this.totalItems = res.count;
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

  pbIngresar() {
    if (goodCheck.length > 0) {
      this.clearPrevisualizationData();
    } else {
      this.alert('warning', 'No seleccionó ningún bien', '');
    }
  }
}
