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
import { ExcelService } from 'src/app/common/services/excel.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodViewTrackerService } from 'src/app/core/services/ms-good-tracker/good-v-tracker.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UnitConversionPackagesDataService } from '../services/unit-conversion-packages-data.service';
import { goodCheck, V_GOOD_COLUMNS } from './columns';

interface IExcelToJson {
  No_bien: string;
}
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
  goodCheckValues = goodCheck;
  paqDestinationGoodLenght: number;
  clearPaqDestination: boolean;
  //Params para navegación
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  limit = new FormControl(10);
  //Forma
  form: FormGroup;

  data = new LocalDataSource();
  list: any[] = [];
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
    private bsModel: BsModalRef,
    private excelService: ExcelService,
    private goodViewTrackerService: GoodViewTrackerService
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
    console.log(delegation);

    this.descData.descDelegation = delegation.description;
  }

  settingChange($event: any): void {
    this.settingsTable = $event;
  }

  private obtainVCuenta(numberGood: number) {
    return this.survillanceService.getVCuentaNoBien(numberGood).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of({ data: [] })),
      map(x => (x.data.length > 0 ? 0 : x.data[0].count))
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
    await goodCheck.forEach(async good => {
      console.log(good);
      if (v_bani) {
        const filterParams = new FilterParams();
        filterParams.addFilter('numberPackage', this.selectedPackage);
        filterParams.addFilter('numberGood', good.goodNumber);
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
        const V_CUENTA = await firstValueFrom(
          this.obtainVCuenta(good.goodNumber)
        );
        if (V_CUENTA > 0) {
          V_BANR = false;
        }
      }
      if (V_BANR) {
        console.log('Entro a registrar');
        let V_NO_TRANSFERENTE;
        if (good.dTransferee) {
          const transferentSplit = good.dTransferee.split('-');
          if (transferentSplit.length > 0) {
            V_NO_TRANSFERENTE = await firstValueFrom(
              this.obtainTransferent(transferentSplit[0])
            );
            // V_NO_TRANSFERENTE = transferentSplit[0];
          }
        }

        const V_NO_DELEGACION = await firstValueFrom(
          this.obtainDelegation(good.coord_admin)
        );
        // console.log(V_NO_DELEGACION);

        if (V_NO_DELEGACION) {
          await firstValueFrom(
            this.goodService.update({
              id: good.id,
              goodNumber: good.goodNumber,
              delegationNumber: V_NO_DELEGACION,
            })
          );
        }

        if (V_NO_TRANSFERENTE) {
          await firstValueFrom(
            this.expedientService.update(good.fileNumber, {
              id: good.fileNumber,
              transferNumber: V_NO_TRANSFERENTE,
            })
          );
        }
        await firstValueFrom(
          this.packageGoodService.insertPaqDestDec({
            numberPackage: this.selectedPackage,
            numberGood: good.goodNumber,
            amount: good.quantity,
            amountConv: null,
            numberRecord: good.numFile,
            nbOrigin: null,
          })
        );
        this.unitConversionPackagesDataService.updatePrevisualizationData.next(
          true
        );
        this.closeModal();
      }
    });
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
    // debugger;
    if (goodCheck.length > 0) {
      this.clearPrevisualizationData();
    } else {
      this.alert('warning', 'No seleccionó ningún bien', '');
    }
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

  async returnJsonToCsv() {
    return this.data.getAll();
  }
  onFileChange(event: Event) {
    console.log('event: ', event);
    const files = (event.target as HTMLInputElement).files;
    console.log('files.length: ', files.length);
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.ngOnInit();
      this.dataExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
      for (let i = 0; i < this.dataExcel.length; i++) {
        this.goodViewTrackerService
          .getGoods(this.dataExcel[i].No_bien)
          .subscribe({
            next: response => {
              for (let j = 0; j < response.data.length; j++) {
                let item = {
                  goodNumber: response.data[j].goodNumber,
                  description: response.data[j].description,
                  unitExtent: response.data[j].unitExtent,
                  numberProceedings: response.data[j].numberProceedings,
                  downloadLabel: response.data[j].downloadLabel,
                  status: response.data[j].status,
                  numberClassifyGood: response.data[j].numberClassifyGood,
                  downloadsssubtype: response.data[j].downloadsssubtype,
                  coordinateadmin: response.data[j].coordinateadmin,
                  numberStore: response.data[j].numberStore,
                  downloadLocationStore: response.data[j].downloadLocationStore,
                  storeCity: response.data[j].storeCity,
                  storeState: response.data[j].storeState,
                  dTransferee: response.data[j].dTransferee,
                  dstation: response.data[j].dstation,
                  dAuthority: response.data[j].dAuthority,
                  amount: response.data[j].amount,
                };
                this.list.push(item);
              }
              this.data.load(this.list);
              this.totalItems = this.list.length;
              this.paginator();
              this.data.refresh();
            },
            error: err => {
              console.error(err);
            },
          });
      }
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  paginator(noPage: number = 1, elementPerPage: number = 10) {
    const indiceInicial = (noPage - 1) * elementPerPage;
    const indiceFinal = indiceInicial + elementPerPage;

    let paginateData = this.list.slice(indiceInicial, indiceFinal);
    this.data.load(paginateData);
  }

  asignarDescripcionLabelExcel(data: any): any {
    let item = {
      'NUMERO BIEN': data.goodNumber,
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
}
