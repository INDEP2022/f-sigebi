import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
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
import { IPackageGoodEnc } from 'src/app/core/models/ms-package-good/package-good-enc';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodTrackerMap } from 'src/app/pages/general-processes/goods-tracker/utils/good-tracker-map';
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
  noPackage: AbstractControl;
  goodCheckValues = goodCheck;
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

  get selectedPackage() {
    return this.unitConversionPackagesDataService.selectedPackage;
  }

  get dataPrevisualization() {
    return this.unitConversionPackagesDataService.dataPrevisualization;
  }

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private unitConversionPackagesDataService: UnitConversionPackagesDataService,
    private rNomenclaService: ParametersService,
    private packageGoodService: PackageGoodService,
    private trackerGoodService: GoodTrackerService,
    private transferentService: TransferenteService,
    private survillanceService: SurvillanceService,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private bsModel: BsModalRef
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.filterByPage();
    });
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
    console.log(delegation);

    this.descData.descDelegation = delegation.description;
  }

  settingChange($event: any): void {
    this.settingsTable = $event;
  }

  private obtainVCuenta(numberGood: number) {
    return this.survillanceService.getVCuentaNoBien(numberGood).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of({ data: [{ count: 0 }] })),
      map(x => (x.data.length > 0 ? x.data[0].count : 0))
    );
  }

  private obtainTransferent(transferent: string) {
    return this.transferentService.getById(transferent).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of(null)),
      map(x => (x ? x.id : null))
    );
  }

  private obtainDelegation(coord_admin: string) {
    const filterParams = new FilterParams();
    filterParams.addFilter('description', coord_admin);
    return this.delegationService.getAll(filterParams.getParams()).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of({ data: [] })),
      map(x => (x.data.length > 0 ? x.data[0].id : null))
    );
  }

  private async fillGoodPaqDestino(v_bani: boolean) {
    let V_BANR = true;
    let packageEnc: IPackageGoodEnc = this.noPackage.value;
    await goodCheck.forEach(async good => {
      console.log(good);
      debugger;
      const row = good.row;
      const goodNumber = row.goodNumber;
      const numberTransferee = row.numberTransferee;
      const id = row.goods.id;
      const fileNumber = row.goods.fileNumber;
      let quantity = row.goods.quantity;
      const delegation = row.goods.numbercoordinatesadmin;
      quantity = quantity ? +quantity : null;
      if (v_bani) {
        const filterParams = new FilterParams();
        filterParams.addFilter('numberPackage', this.selectedPackage);
        filterParams.addFilter('numberGood', goodNumber);
        const encontro = await firstValueFrom(
          this.packageGoodService
            .getPaqDestinationDet(filterParams.getParams())
            .pipe(
              catchError(x => of({ data: [] })),
              map(x => x.data.length > 0)
            )
        );
        if (encontro) {
          V_BANR = false;
        }
      }

      if (V_BANR) {
        const V_CUENTA = await firstValueFrom(this.obtainVCuenta(goodNumber));
        if (V_CUENTA > 0) {
          V_BANR = false;
        }
      }
      if (V_BANR) {
        console.log('Entro a registrar');
        let V_NO_TRANSFERENTE;
        // if (numberTransferee) {
        //   // const transferentSplit = transfer
        //   V_NO_TRANSFERENTE = await firstValueFrom(
        //     this.obtainTransferent(numberTransferee)
        //   );
        // }

        // const V_NO_DELEGACION = await firstValueFrom(
        //   this.obtainDelegation(delegation)
        // );
        // console.log(V_NO_DELEGACION);
        if (packageEnc.numbertrainemiaut) {
          await firstValueFrom(
            this.expedientService.update(fileNumber, {
              id: fileNumber,
              transferNumber: +packageEnc.numbertrainemiaut,
            })
          );
        }
        let change = 0;
        let body: any = {
          id: id,
          goodId: goodNumber,
        };
        if (packageEnc.numberDelegation) {
          body = { ...body, delegationNumber: packageEnc.numberDelegation };
          change++;
        }
        if (packageEnc.numberClassifyGood) {
          body = { ...body, goodClassNumber: packageEnc.numberClassifyGood };
          change++;
        }
        if (packageEnc.numberLabel) {
          body = { ...body, labelNumber: packageEnc.numberLabel };
          change++;
        }
        if (packageEnc.status) {
          body = { ...body, status: packageEnc.status };
          change++;
        }
        await firstValueFrom(this.goodService.update(body));

        await firstValueFrom(
          this.packageGoodService.insertPaqDestDec({
            numberPackage: this.selectedPackage,
            numberGood: goodNumber,
            amount: quantity,
            amountConv: null,
            numberRecord: fileNumber,
            nbOrigin: packageEnc.nbOrigin,
          })
        );
      }
    });
    this.unitConversionPackagesDataService.updatePrevisualizationData.next(
      true
    );
    this.closeModal();
  }

  private clearPrevisualizationData() {
    let v_bani: boolean;
    if (this.dataPrevisualization.length > 0) {
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
    } else {
      this.fillGoodPaqDestino(false);
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
                  resolve({ res: null });
                }
              );
          },
          err => {
            console.log(err);
            resolve({ res: null });
          }
        );
    });
  }

  async filterByPage() {
    console.log(this.goodClassification.value);
    this.loading = true;
    let modelFilter = new GoodTrackerMap();
    if (this.delegation.value != null) {
      const whereDelegation = await this.delegationWhere();
      modelFilter.global.gstSelecDeleg = 'S';
      modelFilter.global.delegationNumber = [this.delegation.value];
    }

    if (this.goodClassification.value != null) {
      modelFilter.clasifGood.selecSsstype = 'S';
      modelFilter.clasifGood.clasifGoodNumber = [this.goodClassification.value];
    }

    if (this.targetTag.value != null) {
      modelFilter.parval.label = this.targetTag.value;
    }

    if (this.goodStatus.value != null) {
      modelFilter.parval.status = [this.goodStatus.value];
    }

    if (this.measurementUnit.value != null) {
    }

    if (this.warehouse.value != null) {
      modelFilter.global.gstSelecStore = 'S';
      modelFilter.global.cstStoreNumber = [this.warehouse.value];
    }

    if (this.transferent.value != null) {
      modelFilter.global.gstSelecProced = 'S';
      modelFilter.global.caTransfereeNumber = [this.transferent.value];
    }

    this.trackerGoodService
      .trackGoods(modelFilter, this.params.getValue())
      .subscribe(
        res => {
          console.log(res);
          this.data.load(res.data);
          this.totalItems = res.count;
          this.loading = false;
        },
        err => {
          this.data.load([]);
          this.loading = false;
        }
      );
  }

  async filter() {
    console.log(this.goodClassification.value);
    this.loading = true;
    let modelFilter = new GoodTrackerMap();
    if (this.delegation.value != null) {
      const whereDelegation = await this.delegationWhere();
      modelFilter.global.gstSelecDeleg = 'S';
      modelFilter.global.delegationNumber = [this.delegation.value];
    }

    if (this.goodClassification.value != null) {
      modelFilter.clasifGood.selecSsstype = 'S';
      modelFilter.clasifGood.clasifGoodNumber = [this.goodClassification.value];
    }

    if (this.targetTag.value != null) {
      modelFilter.parval.label = this.targetTag.value;
    }

    if (this.goodStatus.value != null) {
      modelFilter.parval.status = [this.goodStatus.value];
    }

    if (this.measurementUnit.value != null) {
    }

    if (this.warehouse.value != null) {
      modelFilter.global.gstSelecStore = 'S';
      modelFilter.global.cstStoreNumber = [this.warehouse.value];
    }

    if (this.transferent.value != null) {
      modelFilter.global.gstSelecProced = 'S';
      modelFilter.global.caTransfereeNumber = [this.transferent.value];
    }

    this.trackerGoodService.trackGoods(modelFilter, new ListParams()).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
        this.alert('success', 'Se encontraron registros', '');
        this.loading = false;
      },
      err => {
        this.data.load([]);
        this.alert(
          'error',
          'No se encontraron registros con los filtros seleccionados',
          ''
        );
        this.loading = false;
      }
    );
  }

  /* async filter() {
    this.loading = true;
    const generalParams = new FilterParams();
    let packageEnc: IPackageGoodEnc = this.noPackage.value;
    console.log(this.noPackage.value);
    // if (packageEnc.numberDelegation) {
    //   generalParams.addFilter(
    //     'coordinateadmin',
    //     packageEnc.numberDelegation,
    //     SearchFilter.IN
    //   );
    // }
    // if (packageEnc.numberClassifyGood)
    //   generalParams.addFilter(
    //     'numberClassifyGood',
    //     packageEnc.numberClassifyGood
    //   );
    // if (packageEnc.numberLabel)
    //   generalParams.addFilter('numberLabel', packageEnc.numberLabel);
    // if (packageEnc.unit) generalParams.addFilter('unitExtent', packageEnc.unit);
    // if (packageEnc.numbertrainemiaut)
    //   generalParams.addFilter('dTransferee', packageEnc.numbertrainemiaut);
    // if (packageEnc.numberStore)
    //   generalParams.addFilter('numberStore', packageEnc.numberStore);
    // return;
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

    const whereNoGoods: any = await this.goodsWhere();
    console.log(whereNoGoods.res);
    if (whereNoGoods.res) {
      generalParams.addFilter(
        'goodNumber',
        whereNoGoods.res,
        SearchFilter.NOTIN
      );
    }

    if (generalParams.getParams().length > 0) {

      this.t

      this.trackerGoodService
        .getTvGoodTrackerFilter(generalParams.getParams())
        .subscribe({
          next: response => {
            console.log(response);
            this.data.load(response.data);
            this.totalItems = response.count;
            this.alert('success', 'Se encontraron registros', '');
            this.loading = false;
          },
          error: err => {
            console.log(err);
            this.alert(
              'warning',
              'La consulta no recuperó ningún registro',
              ''
            );
            this.loading = false;
          },
        });
    } else {
      this.loading = false;
    }
  } */

  pbIngresar() {
    debugger;
    if (goodCheck.length > 0) {
      this.clearPrevisualizationData();
    } else {
      this.alert('warning', 'No seleccionó ningún bien', '');
    }
  }
}
