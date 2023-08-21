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
import { ExcelService } from 'src/app/common/services/excel.service';
import { IPackageGoodEnc } from 'src/app/core/models/ms-package-good/package-good-enc';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
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
import { goodCheck, resetGoodCheck, V_GOOD_COLUMNS } from './columns';

interface IExcelToJson {
  No_bien: string;
}
@Component({
  selector: 'app-massive-conversion-select-good',
  templateUrl: './massive-conversion-select-good.component.html',
  styleUrls: ['./massive-conversion-select-good.component.scss'],
})
export class MassiveConversionSelectGoodComponent
  extends BasePage
  implements OnInit
{
  //Variables que recibe
  noPackage: AbstractControl;
  paqDestinationGoodLenght: number;
  clearPaqDestination: boolean;
  //Params para navegación
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  limit = new FormControl(10);
  contador = 0;
  //Forma
  form: FormGroup;
  dataExcel: IExcelToJson[] = [];

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
    private clasificationService: GoodSssubtypeService,
    private unitConversionPackagesDataService: UnitConversionPackagesDataService,
    private rNomenclaService: ParametersService,
    private packageGoodService: PackageGoodService,
    private trackerGoodService: GoodTrackerService,
    private transferentService: TransferenteService,
    private survillanceService: SurvillanceService,
    private excelService: ExcelService,
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
      if (this.contador > 0) {
        this.filter();
        this.contador++;
      }
    });
    let packageEnc: IPackageGoodEnc = this.noPackage.value;
    if (packageEnc.cat_etiqueta_bien) {
      let labelData = packageEnc.cat_etiqueta_bien;
      this.targetTag.setValue(
        labelData.labelNumber + '-' + labelData.description
      );
    }
    if (packageEnc.cat_almacenes) {
      let warehouse = packageEnc.cat_almacenes;
      this.warehouse.setValue(
        warehouse.storeNumber + '-' + warehouse.description
      );
    }
    if (packageEnc.unidadesmed) {
      let unidadesmed = packageEnc.unidadesmed;
      this.measurementUnit.setValue(unidadesmed.unit);
    }
    if (packageEnc.numbertrainemiaut) {
      this.obtainTransferent(packageEnc.numbertrainemiaut)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            if (response) {
              this.transferent.setValue(
                response.id + '-' + response.nameTransferent
              );
            }
          },
        });
    }
    if (packageEnc.delegation) {
      const delegation = packageEnc.delegation;
      this.delegation.setValue(delegation.id + '-' + delegation.description);
    }
    if (packageEnc.status) {
      const filterParams = new FilterParams();
      filterParams.addFilter('status', packageEnc.status);
      this.goodService
        .getStatusGood(filterParams.getParams())
        .pipe(
          takeUntil(this.$unSubscribe),
          map(x => (x.data ? (x.data.length > 0 ? x.data[0] : null) : null))
        )
        .subscribe({
          next: response => {
            if (response) {
              this.goodStatus.setValue(
                response.status + '-' + response.description
              );
            }
          },
        });
    }
    if (packageEnc.numberClassifyGood) {
      const filterParams = new FilterParams();
      filterParams.addFilter('numClasifGoods', packageEnc.numberClassifyGood);
      this.clasificationService
        .getAll2(filterParams.getParams())
        .pipe(
          takeUntil(this.$unSubscribe),
          map(x => (x.data ? (x.data.length > 0 ? x.data[0] : null) : null))
        )
        .subscribe({
          next: response => {
            if (response) {
              this.goodClassification.setValue(
                response.numClasifGoods + '-' + response.description
              );
            }
          },
        });
    }
    resetGoodCheck();
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

  async exportarExcel() {
    const filename: string = 'Bienes';
    const jsonToCsv = await this.returnJsonToCsv();
    const lista = [];
    console.log('jsonToCsv.length ', jsonToCsv.length);
    for (let i = 0; jsonToCsv.length; i++) {
      if (jsonToCsv[i] === undefined) {
        break;
      }
      lista.push(this.asignarDescripcionLabelExcel(jsonToCsv[i]));
    }
    this.excelService.export(lista, { filename });
  }

  private async returnJsonToCsv() {
    return this.data.getAll();
  }

  private asignarDescripcionLabelExcel(data: any): any {
    let item = {
      'No. BIEN': data.goodNumber,
      DESCRIPCIÓN: data.description,
      CANTIDAD: data.amount,
      'UNIDAD MEDIDA': data.unitExtent,
      'NUMERO EXPEDIENTE': data.numberProceedings,
      'DESCRIPCIÓN ETIQUETA': data.downloadLabel,
      ESTADO: data.status,
      CLASIFICADOR: data.numberClassifyGood,
      'DESCRIPCIÓN CLASIFICADOR': data.downloadsssubtype,
      'COORDINACIÓN ADMIN': data.coordinateadmin,
      ALMACEN: data.numberStore,
      'UBICACIÓN ALMACEN': data.downloadLocationStore,
      'CIUDAD ALMACEN': data.storeCity,
      'ESTADO ALMACEN': data.storeState,
      TRANSFERENTE: data.dTransferee,
      EMISORA: data.dstation,
      AUTORIDAD: data.dAuthority,
    };

    return item;
  }

  private readTxt(txtData: string) {
    const array = txtData.replace(',', '').split('\r\n'); // saltos de linea
    const newArray: string[] = [];
    if (array.length === 0) {
      this.alert('error', 'No se han Cargado Datos en Archivo', '');
      this.loading = false;
      return;
    }
    array.forEach(row => {
      const array2 = row.split(' ');
      console.log(array2);
      array2.forEach(item => {
        if (item.length > 0 && !isNaN(+item)) {
          newArray.push(item);
        }
      });
    });
    if (newArray.length === 0) {
      this.alert('error', 'No Hay Datos Válidos en el Archivo', '');
      this.loading = false;
      return;
    }
    this.params.value.page = 1;
    this.filter(newArray);
    // const listParams = new ListParams();
    // let modelFilter = new GoodTrackerMap();
    // console.log(newArray);
    // modelFilter.parval.goodNumber = newArray;
    // this.trackerGoodService.trackGoods(modelFilter, listParams).subscribe({
    //   next: res => {
    //     // for (let j = 0; j < response.data.length; j++) {
    //     //   let item = {
    //     //     goodNumber: response.data[j].goodNumber,
    //     //     description: response.data[j].description,
    //     //     unitExtent: response.data[j].unitExtent,
    //     //     numberProceedings: response.data[j].numberProceedings,
    //     //     downloadLabel: response.data[j].downloadLabel,
    //     //     status: response.data[j].status,
    //     //     numberClassifyGood: response.data[j].numberClassifyGood,
    //     //     downloadsssubtype: response.data[j].downloadsssubtype,
    //     //     coordinateadmin: response.data[j].coordinateadmin,
    //     //     numberStore: response.data[j].numberStore,
    //     //     downloadLocationStore: response.data[j].downloadLocationStore,
    //     //     storeCity: response.data[j].storeCity,
    //     //     storeState: response.data[j].storeState,
    //     //     dTransferee: response.data[j].dTransferee,
    //     //     dstation: response.data[j].dstation,
    //     //     dAuthority: response.data[j].dAuthority,
    //     //     amount: response.data[j].amount,
    //     //   };
    //     //   list.push(item);
    //     // }
    //     if (res.data && res.data.length > 0) {
    //       this.data.load(res.data);
    //       this.totalItems = res.count;
    //       this.data.refresh();
    //       this.alert('success', 'Se encontraron registros', '');
    //       this.loading = false;
    //     } else {
    //       this.data.load([]);
    //       this.alert('error', 'No se encontraron registros', '');
    //       this.loading = false;
    //     }
    //   },
    //   error: err => {
    //     console.error(err);
    //     this.data.load([]);
    //     this.alert('error', 'No se encontraron registros', '');
    //     this.loading = false;
    //   },
    // });
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    console.log(binaryExcel);
    // let modelFilter = new GoodTrackerMap();
    this.dataExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
    console.log(this.dataExcel);
    this.params.value.page = 1;
    this.filter(this.dataExcel.map(x => x.No_bien));
    // modelFilter.parval.goodNumber = this.dataExcel.map(x => x.No_bien);
    // const listParams = new ListParams();
    // this.trackerGoodService.trackGoods(modelFilter, listParams).subscribe({
    //   next: res => {
    //     // for (let j = 0; j < response.data.length; j++) {
    //     //   let item = {
    //     //     goodNumber: response.data[j].goodNumber,
    //     //     description: response.data[j].description,
    //     //     unitExtent: response.data[j].unitExtent,
    //     //     numberProceedings: response.data[j].numberProceedings,
    //     //     downloadLabel: response.data[j].downloadLabel,
    //     //     status: response.data[j].status,
    //     //     numberClassifyGood: response.data[j].numberClassifyGood,
    //     //     downloadsssubtype: response.data[j].downloadsssubtype,
    //     //     coordinateadmin: response.data[j].coordinateadmin,
    //     //     numberStore: response.data[j].numberStore,
    //     //     downloadLocationStore: response.data[j].downloadLocationStore,
    //     //     storeCity: response.data[j].storeCity,
    //     //     storeState: response.data[j].storeState,
    //     //     dTransferee: response.data[j].dTransferee,
    //     //     dstation: response.data[j].dstation,
    //     //     dAuthority: response.data[j].dAuthority,
    //     //     amount: response.data[j].amount,
    //     //   };
    //     //   list.push(item);
    //     // }
    //     if (res.data && res.data.length > 0) {
    //       this.data.load(res.data);
    //       this.totalItems = res.count;
    //       this.data.refresh();
    //       this.alert('success', 'Se encontraron registros', '');
    //       this.loading = false;
    //     } else {
    //       this.data.load([]);
    //       this.alert('error', 'No se encontraron registros', '');
    //       this.loading = false;
    //     }
    //   },
    //   error: err => {
    //     console.error(err);
    //     this.data.load([]);
    //     this.alert('error', 'No se encontraron registros', '');
    //     this.loading = false;
    //   },
    // });
  }

  async onFileChange(event: Event) {
    this.loading = true;
    console.log('event: ', event);
    // try {
    const files = (event.target as HTMLInputElement).files;
    console.log('files.length: ', files.length);
    // if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    // fileReader.readAsText(files[0]);
    // fileReader.onload = () => {
    //   this.readTxt(fileReader.result as string);
    // };
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
    // } catch (x) {
    //   this.alert(
    //     'error',
    //     'No hay archivos seleccionados o mas de uno subido',
    //     ''
    //   );
    // }
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
      catchError(x => of(null))
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

    // debugger;
    const results = await goodCheck.map(async good => {
      console.log(good);
      // debugger;
      const row = good.row;
      const goodNumber = row.goodNumber;
      const numberTransferee = row.numberTransferee;
      // const id = row.goodId;
      const fileNumber = row.fileNumber;
      let quantity = row.quantity;
      // const delegation = row.goods.numbercoordinatesadmin;
      quantity = quantity ? +quantity : null;
      let encontro;
      let V_CUENTA;
      if (v_bani) {
        const filterParams = new FilterParams();
        filterParams.addFilter('numberPackage', this.selectedPackage);
        filterParams.addFilter('numberGood', goodNumber);
        encontro = await firstValueFrom(
          this.packageGoodService
            .getPaqDestinationDet(filterParams.getParams())
            .pipe(
              catchError(x => of({ data: [] })),
              map(x => x.data.length > 0)
            )
        );
        console.log(encontro)
        if (encontro) {
          V_BANR = false;
        }
      }

      if (V_BANR) {
        V_CUENTA = await firstValueFrom(this.obtainVCuenta(goodNumber));
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
        // if (packageEnc.numbertrainemiaut) {
        //   await firstValueFrom(
        //     this.expedientService.update(fileNumber, {
        //       id: fileNumber,
        //       transferNumber: +packageEnc.numbertrainemiaut,
        //     })
        //   );
        // }
        // let change = 0;
        // let body: any = {
        //   id: id,
        //   goodId: goodNumber,
        // };
        // if (packageEnc.numberDelegation) {
        //   body = { ...body, delegationNumber: packageEnc.numberDelegation };
        //   change++;
        // }
        // if (packageEnc.numberClassifyGood) {
        //   body = { ...body, goodClassNumber: packageEnc.numberClassifyGood };
        //   change++;
        // }
        // if (packageEnc.numberLabel) {
        //   body = { ...body, labelNumber: packageEnc.numberLabel };
        //   change++;
        // }
        // if (packageEnc.status) {
        //   body = { ...body, status: packageEnc.status };
        //   change++;
        // }
        // if (packageEnc.numberStore) {
        //   body = { ...body, storeNumber: packageEnc.numberStore };
        //   change++;
        // }
        // await firstValueFrom(this.goodService.update(body));

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
        // return await new Promise<any>((resolve, reject) => {
        //   resolve(null);
        // });
        return null;
      } else {
        if (encontro) {
          return {
            id: goodNumber,
            message: 'No puede agregar bienes ya registrados',
          };
          // return await new Promise<any>((resolve, reject) => {
          //   resolve({
          //     id: goodNumber,
          //     message: 'No puede agregar bienes ya registrados',
          //   });
          // });
          // this.alert(
          //   'error',
          //   'ERROR',
          //   'No puede agregar bienes ya registrados'
          // );
        } else {
          return {
            id: goodNumber,
            message:
              'No puede agregar bienes cuyo paquete no está en ESTATUS_PAQ X',
          };
          // return await new Promise<any>((resolve, reject) => {
          //   resolve({
          //     id: goodNumber,
          //     message:
          //       'No puede agregar bienes cuyo paquete no está en ESTATUS_PAQ X',
          //   });
          // });
          // return {
          //   id: goodNumber,
          //   message:
          //     'No puede agregar bienes cuyo paquete no está en ESTATUS_PAQ X',
          // };
          // this.alert(
          //   'error',
          //   'ERROR',
          //   'No puede agregar bienes cuyo paquete no está en ESTATUS_PAQ X'
          // );
        }
      }
    });

    // this.unitConversionPackagesDataService.updatePrevisualizationData.next(
    //   true
    // );
    // this.closeModal();

    Promise.all(results)
      .then(array => {
        let message = '';
        array.forEach(x => {
          if (x && x.message) {
            if (message.length > 0) {
              message += '/';
            }
            if (!message.includes(x.message)) {
              message += x.message;
            }
          }
        });
        if (message.length > 0) {
          this.alert('error', 'ERROR', message);
        } else {
          this.unitConversionPackagesDataService.updatePrevisualizationData.next(
            true
          );
          this.closeModal();
        }
      })
      .catch(error => {
        this.alert('error', 'ERROR', 'No se Pudo Ingresar los Bienes');
      });
  }

  private clearPrevisualizationData() {
    let v_bani: boolean;
    if (this.dataPrevisualization.length > 0) {
      this.alertQuestion(
        'question',
        '¿El Paquete Tiene Bienes, se Eliminan?',
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
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(
            res => {
              //Respuesta de FA_EDO_FISICO
              let edo = JSON.parse(JSON.stringify(res));
              //Parametros de filtro para búsqueda
              const paramsF = new FilterParams();
              paramsF.addFilter('id', this.delegation.value);
              paramsF.addFilter('etapaEdo', edo.stagecreated);
              this.delegationService
                .getFiltered(paramsF.getParams())
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(
                  async res => {
                    const arrayDelegations = await Promise.all(
                      res['data'].map((item: any) => {
                        return item.id;
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
      paramsEnc.limit = 10000000;
      this.packageGoodService
        .getPaqDestinationEnc(paramsEnc.getParams())
        .pipe(takeUntil(this.$unSubscribe))
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
            paramsDet.limit = 1000000;
            this.packageGoodService
              .getPaqDestinationDet(paramsDet.getParams())
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(
                async res => {
                  const arrayNoGood = await Promise.all(
                    res['data'].map((item: any) => {
                      return item.numberGood;
                    })
                  );

                  resolve({ res: arrayNoGood });
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

  // async filterByPage() {
  //   console.log(this.goodClassification.value);
  //   this.loading = true;
  //   let modelFilter = new GoodTrackerMap();
  //   if (this.delegation.value != null) {
  //     const whereDelegation = await this.delegationWhere();
  //     modelFilter.global.gstSelecDeleg = 'S';
  //     modelFilter.global.delegationNumber = [this.delegation.value];
  //   }

  //   if (this.goodClassification.value != null) {
  //     modelFilter.clasifGood.selecSsstype = 'S';
  //     modelFilter.clasifGood.clasifGoodNumber = [this.goodClassification.value];
  //   }

  //   if (this.targetTag.value != null) {
  //     modelFilter.parval.label = this.targetTag.value;
  //   }

  //   if (this.goodStatus.value != null) {
  //     modelFilter.parval.status = [this.goodStatus.value];
  //   }

  //   if (this.measurementUnit.value != null) {
  //   }

  //   if (this.warehouse.value != null) {
  //     modelFilter.global.gstSelecStore = 'S';
  //     modelFilter.global.cstStoreNumber = [this.warehouse.value];
  //   }

  //   if (this.transferent.value != null) {
  //     modelFilter.global.gstSelecProced = 'S';
  //     modelFilter.global.caTransfereeNumber = [this.transferent.value];
  //   }

  //   this.trackerGoodService
  //     .trackGoods(modelFilter, this.params.getValue())
  //     .pipe(takeUntil(this.$unSubscribe))
  //     .subscribe(
  //       res => {
  //         console.log(res);
  //         this.data.load(res.data);
  //         this.totalItems = res.count;
  //         this.loading = false;
  //       },
  //       err => {
  //         this.data.load([]);
  //         this.loading = false;
  //       }
  //     );
  // }

  async filter(goodNumbers: string[] = []) {
    console.log(this.goodClassification.value);
    this.loading = true;
    let modelFilter = new GoodTrackerMap();
    if (this.delegation.value != null) {
      // const whereDelegation = await this.delegationWhere();
      modelFilter.global.gstSelecDeleg = 'S';
      modelFilter.global.delegationNumber = [
        this.delegation.value.split('-')[0],
      ];
    }

    if (this.goodClassification.value != null) {
      modelFilter.clasifGood.selecSsstype = 'S';
      modelFilter.clasifGood.clasifGoodNumber = [
        this.goodClassification.value.split('-')[0],
      ];
    }

    if (this.targetTag.value != null) {
      modelFilter.parval.label = this.targetTag.value.split('-')[0];
    }

    if (this.goodStatus.value != null) {
      modelFilter.parval.status = [this.goodStatus.value.split('-')[0]];
    }

    if (this.measurementUnit.value != null) {
    }

    if (this.warehouse.value != null) {
      modelFilter.global.gstSelecStore = 'S';
      modelFilter.global.cstStoreNumber = [this.warehouse.value.split('-')[0]];
    }

    if (this.transferent.value != null) {
      modelFilter.global.gstSelecProced = 'S';
      modelFilter.global.caTransfereeNumber = [
        this.transferent.value.split('-')[0],
      ];
    }
    if (goodNumbers && goodNumbers.length > 0) {
      modelFilter.parval.goodNumber = goodNumbers;
    }

    let packageEnc: IPackageGoodEnc = this.noPackage.value;
    const generalParams = new FilterParams();
    generalParams.limit = this.params.value.limit;
    generalParams.page = this.params.value.page;
    if (packageEnc.typePackage === '3') {
      generalParams.addFilter3('val24', '$not:null');
    }

    const whereNoGoods1: any = await this.goodsWhere();

    const whereSelectedGoods = this.dataPrevisualization.map(x => x.numberGood);

    let whereNoGoods: string[] = [];
    console.log(whereNoGoods1.res);
    if (whereNoGoods1.res) {
      whereNoGoods = [...whereNoGoods1.res];
    }
    if (whereSelectedGoods) {
      whereNoGoods = whereNoGoods.concat(whereSelectedGoods);
    }

    if (whereNoGoods.length > 0) {
     /*  generalParams.addFilter(
        'goodNumber',
        whereNoGoods.toString(),
        SearchFilter.NOTIN
      ); */
    }

    this.trackerGoodService
      .trackGoodsWidthNotGoods(modelFilter, generalParams.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data && res.data.length > 0) {
            this.data.load(res.data);
            this.totalItems = res.count;
            this.alert('success', 'Se Encontraron Registros', '');
          } else {
            this.data.load([]);
            this.alert('error', 'No se Encontraron Registros', '');
          }

          this.loading = false;
        },
        error: err => {
          this.data.load([]);
          this.alert('error', 'No se Encontraron Registros', '');
          this.loading = false;
        },
      });
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

    const whereNoGoods1: any = await this.goodsWhere();
    const whereSelectedGoods = this.dataPrevisualization.map(x => x.numberGood);
    let whereNoGoods: string[] = [];
    console.log(whereNoGoods1.res);
    if (whereNoGoods1.res) {
      whereNoGoods = [...whereNoGoods1.res];
    }
    if (whereSelectedGoods) {
      whereNoGoods = whereNoGoods.concat(whereSelectedGoods);
    }

    if (whereNoGoods.length > 0) {
      generalParams.addFilter(
        'goodNumber',
        whereNoGoods.toString(),
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
    // debugger;
    if (goodCheck.length > 0) {
      this.clearPrevisualizationData();
    } else {
      this.alert('warning', 'No Seleccionó Ningún Bien', '');
    }
  }
}
