import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGoodsExportPost } from 'src/app/core/models/catalogs/goods.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ExpedientSamiService } from 'src/app/core/services/ms-expedient/expedient-sami.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import * as XLSX from 'xlsx';
import { MassiveGoodService } from '../../../../../core/services/ms-massivegood/massive-good.service';
import { DetailProceeDelRecService } from '../../../../../core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ExportCommunicationService } from './communication.services';

@Component({
  selector: 'app-export-goods-donation',
  templateUrl: './export-goods-donation.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ExportGoodsDonationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data = new LocalDataSource();
  data1: any[] = [];
  noExpediente: number;
  cveUnica: number | null;
  ngGlobal: IGlobalVars = null;
  columnFilters: any = [];
  selectAll: boolean = false;
  isSelect: boolean = false;
  isExcel: boolean = false;
  isCPDChecked = false;
  isADMChecked = false;
  isRDAChecked = false;
  form: FormGroup;
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: any;
  @Output() toggle: EventEmitter<{ row: any; toggle: boolean }> =
    new EventEmitter();
  cpdall: any;
  selectedOption: string = '';
  @Output() checkboxChanged = new EventEmitter<boolean>();
  dataExport: any[] = [];
  selectedData: any;
  listaDeArreglos: any[][] = [];
  cpd: boolean = false;
  adm: boolean = false;
  rda: boolean = false;
  boolCon: boolean = false;
  goodCheck2: { [key: number]: number } = {};
  selectedItem: string | null = null;
  user: any;
  total: any;
  selectedA: any = false;
  rel_bienes: any = null;
  selectedGoods: any[] = [];
  dataSeleccionada: any[] = [];
  valRastreador: boolean = false;
  goodsTracker: any = null;
  loadingExportAndUpdate: boolean = false;
  loadingExport: boolean = false;
  constructor(
    private router: Router,
    private expedientSamiService: ExpedientSamiService,
    private delegationService: DelegationService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private globalVarsService: GlobalVarsService,
    private goodService: GoodService,
    private goodTrackerService: GoodTrackerService,
    private fb: FormBuilder,
    private massiveGoodService: MassiveGoodService,
    private screenStatusService: ScreenStatusService,
    private historyGoodService: HistoryGoodService,
    private authService: AuthService,
    private excelService: ExcelService,
    private exportCommunicationService: ExportCommunicationService,
    private goodProcessService: GoodProcessService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      // selectMode: 'multi'
    };
    this.settings.columns = {
      goodNumber: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      amount: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
      },
      notClassificationWell: {
        title: 'No. Clasf Bien',
        type: 'number',
        sort: false,
      },
      transferor: {
        title: 'No. Transfer',
        type: 'number',
        sort: false,
      },
      delAdmin: {
        title: 'Del_Admin',
        type: 'number',
        sort: false,
        filter: false,
      },
      delReceives: {
        title: 'Del_Recibe',
        type: 'number',
        sort: false,
        filter: false,
      },
      recepDate: {
        title: 'Fecha Recepción',
        filter: false,
        // filter: {
        //   type: 'custom',
        //   component: CustomDateFilterComponent,
        // },
        valuePrepareFunction: (text: string) => {
          return `${text ? text.split('-').reverse().join('/') : ''}`;
        },
        sort: false,
      },
      status: {
        title: 'Estatus',
        type: 'number',
        sort: false,
      },
      proceedingsNumber: {
        title: 'No. Expediente',
        type: 'number',
        sort: false,
      },
      cpd: {
        title: 'CPD',
        type: 'custom',
        filter: false,
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: any) => {
          instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
            // Manejar el evento del checkbox CPD aquí
            const rowData = event.row;
            const isChecked = event.toggle;

            // Verificar si el checkbox se ha seleccionado
            if (isChecked) {
              // Si el checkbox se selecciona, establecer el valor en true
              rowData.cpd = true; // Asume que rowData.cpd representa el valor de la columna 'CPD'
              rowData.rda = false;
              rowData.adm = false;
              this.updateStatusCheck(rowData, true);
            } else {
              rowData.cpd = false;
              this.updateStatusCheck(rowData, false);
              // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
            }

            console.log(
              'Evento del checkbox CPD. Fila:',
              rowData,
              'Estado:',
              isChecked
            );
          });
          // this.isGoodSelectedCPD(instance);
        },
        valuePrepareFunction: (isSelected: boolean, row: any) =>
          this.isGoodSelectedCPD(row),
        sort: false,
      },
      adm: {
        title: 'ADM',
        type: 'custom',
        filter: false,
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: any) => {
          instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
            // Manejar el evento del checkbox CPD aquí
            const rowData = event.row;
            const isChecked = event.toggle;

            // Verificar si el checkbox se ha seleccionado
            if (isChecked) {
              // Si el checkbox se selecciona, establecer el valor en true
              rowData.adm = true; // Asume que rowData.cpd representa el valor de la columna 'CPD'
              rowData.rda = false;
              rowData.cpd = false;
              this.updateStatusCheck(rowData, true);
            } else {
              rowData.cpd = false;
              this.updateStatusCheck(rowData, false);
              // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
            }

            console.log(
              'Evento del checkbox CPD. Fila:',
              rowData,
              'Estado:',
              isChecked
            );
          });
          // this.onGoodSelectCPD_(instance)
        },
        valuePrepareFunction: (isSelected: boolean, row: any) =>
          this.isGoodSelectedADM(row),
        sort: false,
      },
      rda: {
        title: 'RDA',
        type: 'custom',
        filter: false,
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: any) => {
          instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
            // Manejar el evento del checkbox CPD aquí
            const rowData = event.row;
            const isChecked = event.toggle;

            // Verificar si el checkbox se ha seleccionado
            if (isChecked) {
              // Si el checkbox se selecciona, establecer el valor en true
              rowData.rda = true; // Asume que rowData.cpd representa el valor de la columna 'CPD'
              rowData.cpd = false;
              rowData.adm = false;
              this.updateStatusCheck(rowData, true);
            } else {
              rowData.cpd = false;
              this.updateStatusCheck(rowData, false);
              // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
            }

            console.log(
              'Evento del checkbox CPD. Fila:',
              rowData,
              'Estado:',
              isChecked
            );
          });
        },
        valuePrepareFunction: (isSelected: boolean, row: any) =>
          this.isGoodSelectedRDA(row),
        sort: false,
      },
    };
    this.settings.hideSubHeader = false;
  }

  updateStatusCheck(data: any, valid: boolean) {
    console.log('AQUI ESTAMOS');
    if (!valid) {
      this.selectedGoods = this.selectedGoods.filter(
        (good: any) => data.goodNumber != good.goodNumber
      );
    } else {
      const exists = this.selectedGoods.find(
        (good: any) => data.goodNumber == good.goodNumber
      );
      if (!exists) this.selectedGoods.push(data);
      else {
        const bien = this.selectedGoods.find(
          (good: any) => data.goodNumber == good.goodNumber
        );
        this.selectedGoods = this.selectedGoods.filter(
          (good: any) => bien.goodNumber != good.goodNumber
        );
        this.selectedGoods.push(data);
      }
      console.log('this.selectedGoods', this.selectedGoods);
    }
    this.data.refresh();
  }

  onGoodSelectCPD(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeCPD(data.row, data.toggle),
    });
  }

  isGoodSelectedCPD(_good: any) {
    const exists = this.selectedGoods.find(
      (good: any) => _good.goodNumber == good.goodNumber && good.cpd == true
    );
    return !exists ? false : true;
  }

  isGoodSelectedADM(_good: any) {
    const exists = this.selectedGoods.find(
      (good: any) => _good.goodNumber == good.goodNumber && good.adm == true
    );
    return !exists ? false : true;
  }

  isGoodSelectedRDA(_good: any) {
    const exists = this.selectedGoods.find(
      (good: any) => _good.goodNumber == good.goodNumber && good.rda == true
    );
    return !exists ? false : true;
  }

  goodSelectedChangeCPD(_good: any, selected: boolean) {
    if (selected) {
      this.selectedGoods.push(_good);
    } else {
      this.selectedGoods = this.selectedGoods.filter(
        (good: any) => _good.goodNumber != good.goodNumber
      );
    }
  }

  ngOnInit(): void {
    this.filterGetAll();
    this.getuser();
    this.checked = this.value;
    this.prepareform();
    this.rel_bienes = null;
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          //console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES != null) {
            console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
            this.rel_bienes = this.ngGlobal.REL_BIENES;
            this.ngGlobal.REL_BIENES = null;
          }
        },
      });
    if (this.rel_bienes != null) {
      this.backRastreador(this.rel_bienes);
    }

    // this.data.load(this.data1);
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
  }

  prepareform() {
    this.form = this.fb.group({
      description: [null, [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openDefineFilter() {
    this.router.navigate([
      `/pages/parameterization/filters-of-goods-for-donation`,
    ]);
  }

  returnFirst(model: any) {
    return new Promise((resolve, reject) => {
      this.delegationService.postCatalog(model).subscribe({
        next: resp => {
          resolve(resp.data[0].coalesce);
        },
        error(err) {
          resolve(0);
        },
      });
    });
  }

  returnSecond(acta: any) {
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService.getProceding(acta).subscribe({
        next: resp => {
          resolve(resp);
        },
        error(err) {
          let obj: any = {
            del_administra: null,
            del_recibe: null,
            fecha_recepcion: null,
          };
          resolve(obj);
        },
      });
    });
  }

  returnThird(expediente: any) {
    return new Promise((resolve, reject) => {
      this.delegationService.getTran(expediente).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
        error(err) {
          let obj: any = {
            no_emisora: null,
            no_tran_emi_aut: null,
          };
          resolve(obj);
        },
      });
    });
  }

  getallCondition() {
    this.boolCon = true;
    this.valRastreador = false;
    this.selectedGoods = [];
    this.getall1(this.boolCon, 'si');
  }

  getall1(boolCon: boolean, filter: string) {
    if (boolCon != true) {
      return;
    }
    this.loading = true;
    this.data1 = [];
    this.totalItems = 0;
    this.data.load([]);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('Params-> ', params);
    this.expedientSamiService.getApplicationRegisterCount(params).subscribe({
      next: response => {
        let result = response.data.map(item => {
          item['rda'];
          item['adm'];
          item['cpd'];
        });

        Promise.all(result).then(item => {
          console.log('Respuesta ', response);
          this.generarAlerta(response, filter);
        });

        // this.totalItems = response.count;
        // this.loading = false;
      },
      error: err => {
        this.data1.push(params);
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
      },
    });
  }

  getAllOfRastreador(goods: any[], filter: string) {
    this.loading = true;
    this.data1 = [];
    this.totalItems = 0;
    this.data.load([]);

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.goodProcessService
      .getApplicationGetDataNoprocedingConsulta(goods, params)
      .subscribe({
        next: response => {
          let result = response.data.map(item => {
            item['rda'];
            item['adm'];
            item['cpd'];
          });

          Promise.all(result).then(item => {
            this.data1 = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          });
        },
        error: err => {
          this.data1.push([]);
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
          if (filter == 'si') {
            this.valRastreador = false;
            this.alert(
              'warning',
              'No se encontraron los bienes seleccionados en el Rastreador',
              ''
            );
          }
        },
      });
  }

  filterGetAll() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodNumber':
                // field = 'filter.no_bien';
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amount':
                searchFilter = SearchFilter.EQ;
                break;
              case 'notClassificationWell':
                searchFilter = SearchFilter.EQ;
                break;
              case 'transferor':
                searchFilter = SearchFilter.EQ;
                break;
              case 'delAdmin':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'delReceives':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateCrecep':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'proceedingsNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'recepDate':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              if (filter.field == 'recepDate') {
                var fecha1 = filter.search;
                var ano1 = fecha1.getFullYear();
                var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2);
                var dia1 = ('0' + fecha1.getDate()).slice(-2);
                var fechaFormateada1 = ano1 + '-' + mes1 + '-' + dia1;
                this.columnFilters[
                  field
                ] = `${searchFilter}:${fechaFormateada1}`;
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          if (!this.valRastreador) this.getall1(this.boolCon, 'no');
          else this.getAllOfRastreador(this.goodsTracker, 'no');
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.valRastreador) this.getall1(this.boolCon, 'no');
      else this.getAllOfRastreador(this.goodsTracker, 'no');
    });
  }

  generarAlerta(response: any, filter: any) {
    if (filter == 'no') {
      this.data1 = response.data;
      this.data.load(response.data);
      this.data.refresh();
      this.totalItems = response.count;
      this.loading = false;
    } else {
      if (response.count > 1000) {
        this.alertQuestion(
          'question',
          'Se recuperarán ' + response.count + ' registros',
          '¿Deseas continuar?'
        ).then(question => {
          if (question.isConfirmed) {
            this.data1 = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          } else {
            this.loading = false;
            return;
          }
        });
      } else {
        this.data1 = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      }
    }
  }
  // SE LLAMA A LA PANTALLA RASTREADOR POR BIENES Y NOTIFICACIONES
  callRastreador() {
    this.loadFromGoodsTracker();
  }
  async loadFromGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FDONACIONES',
      },
    });
  }
  // SERVICIO PARA TRAER BIENES DE LA PANTALLA RASTREADOR POR BIENES Y NOTIFICACIONES
  addGoodRastreador(good: any) {
    console.log('1');
    this.goodService.getByGood(good).subscribe({
      next: response => {
        console.log('1.3');
        let padre =
          response.data[0].no_bien_padre_parcializacion != null
            ? response.data[0].no_bien_padre_parcializacion
            : '1';

        const model = {} as IGoodsExportPost;
        (model.noBien = response.data[0].goodId),
          (model.vNoBienPadre = padre),
          (model.vNobienreferencia = response.data[0].goodReferenceNumber);
        //Servicio1
        console.log('1.2', model);

        this.delegationService.postCatalog(model).subscribe({
          next: resp => {
            console.log('2');
            let acta = resp.data[0].coalesce;
            console.log('resp -> ', resp);
            //Servicio2
            this.delegationService
              .getTran(response.data[0].fileNumber)
              .subscribe(respo => {
                console.log('3');
                if (respo != null && resp != undefined) {
                  console.log('Resp tranEmit', respo);
                  //servicio 3
                  this.detailProceeDelRecService.getProceding(acta).subscribe({
                    next: res => {
                      console.log('res 2 -> ', res);

                      let dataForm = {
                        goodNumber: response.data[0].goodId,
                        description: response.data[0].description,
                        amount: response.data[0].quantity,
                        notClassificationWell: response.data[0].goodClassNumber,
                        transferor: response.data[0].transferNumberFiles,
                        processExtDom: response.data[0].extDomProcess,
                        storeId: response.data[0].storeNumber,
                        dateRelease: '',
                        status: response.data[0].goodStatus,
                        unit: response.data[0].unit,
                        proceedingsNumber: response.data[0].fileNumber,
                        delAdmin: res.del_administra,
                        delReceives: res.del_recibe,
                        dateCrecep: res.fecha_recepcion,
                        stationNumber: respo.data[0].no_emisora,
                        onlyKey: respo.data[0].no_tran_emi_aut,
                      };
                      console.log('DATA FORM ->', dataForm);
                      this.data1.push(dataForm); // invocar todos tres servicios
                      this.data.load(this.data1); // cuando ya pasa todo, se mapea la info
                      // this.totalItems = res.count;
                    },
                  });
                }
              });
          },
        });
      },
    });
  }
  // SERVIVO PARA RECORRER EL SERVICIO getByGood
  backRastreador(global: any) {
    this.goodTrackerService.PaInsGoodtmptracker_(global).subscribe({
      next: response => {
        this.total = response.count;
        this.valRastreador = true;
        console.log('respuesta TMPTRAKER', response);

        let obj = {
          goodNumber: [],
        };
        let result = response.data.map(item => {
          obj.goodNumber.push(item.goodNumber);
        });
        Promise.all(result).then(resp => {
          this.goodsTracker = obj;
          this.getAllOfRastreador(this.goodsTracker, 'si');
          console.log('sale del For');
          window.scrollTo(0, 80);
        });
      },
      error: err => {},
    });
  }

  // SELECCIONA TODO CPD
  selectAllCPD() {
    this.adm = false;
    this.cpd = true;
    this.rda = false;
    console.log('seleecCPD', this.selectedGoods);
    this.data.getElements().then(_item => {
      console.log(_item);
      let result = _item.map(item => {
        if (item.cpd) {
          item.cpd = false;
          this.selectedGoods = this.selectedGoods.filter(
            (good: any) => item.goodNumber != good.goodNumber
          );
        } else {
          item.cpd = true;
          item.adm = false;
          item.rda = false;

          const exists = this.selectedGoods.find(
            (good: any) => item.goodNumber == good.goodNumber
          );
          if (!exists) {
            this.selectedGoods.push(item);
          } else {
            this.selectedGoods = this.selectedGoods.filter(
              (good: any) => item.goodNumber != good.goodNumber
            );
            this.selectedGoods.push(item);
          }
        }
      });
      Promise.all(result).then(resp => {
        console.log('after array selectsCPD: ', this.selectedGoods);
        this.data.refresh();
      });
    });
    // this.data.refresh;
  }
  // SELECCIONA TODO ADM
  selectAllADM() {
    this.adm = true;
    this.cpd = false;
    this.rda = false;
    console.log('seleecADM', this.selectedGoods);

    this.data.getElements().then(_item => {
      console.log('asasdasd', _item);
      let result = _item.map(item => {
        if (item.adm) {
          item.adm = false;
          this.selectedGoods = this.selectedGoods.filter(
            (good: any) => item.goodNumber != good.goodNumber
          );
        } else {
          item.adm = true;
          item.cpd = false;
          item.rda = false;

          const exists = this.selectedGoods.find(
            (good: any) => item.goodNumber == good.goodNumber
          );
          if (!exists) {
            this.selectedGoods.push(item);
          } else {
            this.selectedGoods = this.selectedGoods.filter(
              (good: any) => item.goodNumber != good.goodNumber
            );
            this.selectedGoods.push(item);
          }
        }
      });
      Promise.all(result).then(resp => {
        // this.selectedGoods = _item;
        console.log('after array selectsADM: ', this.selectedGoods);
        this.data.refresh();
      });
    });
    // this.data.refresh();
  }
  // SELECCIONA TODO RDA
  selectAllRDA() {
    this.adm = false;
    this.cpd = false;
    this.rda = true;
    console.log('seleecRDA', this.selectedGoods);
    this.data.getElements().then(_item => {
      let result = _item.map(item => {
        if (item.rda) {
          item.rda = false;
          this.selectedGoods = this.selectedGoods.filter(
            (good: any) => item.goodNumber != good.goodNumber
          );
        } else {
          item.rda = true;
          item.cpd = false;
          item.adm = false;

          const exists = this.selectedGoods.find(
            (good: any) => item.goodNumber == good.goodNumber
          );
          if (!exists) {
            this.selectedGoods.push(item);
          } else {
            this.selectedGoods = this.selectedGoods.filter(
              (good: any) => item.goodNumber != good.goodNumber
            );
            this.selectedGoods.push(item);
          }
        }
      });
      Promise.all(result).then(resp => {
        console.log('after array selectsRDA: ', this.selectedGoods);
        this.data.refresh();
      });
    });
    // this.data.load(this.data1);
  }

  selectDataBien(data: any) {
    console.log('selectDataBien', data);
    this.selectedData = [];
    this.selectedData = data;
    this.isSelect = true;
    this.isExcel = true;
  }
  // EXPORTAR A EXCEL
  async ExportAndChange() {
    let descripcion = this.form.get('description').value;
    console.log('PASA DESCRIPCION ->', descripcion); // Se obtiene el valor de description del form y se almacena en la variable descripción
    if (!descripcion) return this.alert('warning', 'Digite la descripción', '');

    let message = 'Se actualizará el estatus de los bienes';
    let _message = '¿Desea continuar?';
    if (this.rda)
      (_message = ''),
        (message = '¿Desea reservar estos bienes para donación?');

    if (this.adm)
      (_message = ''), (message = '¿Desea cambiar estos bienes a ADM?');

    if (this.cpd)
      (_message = ''), (message = '¿Desea cambiar estos bienes a CPD?');

    this.alertQuestion('question', message, _message).then(async question => {
      if (question.isConfirmed) {
        await this.exportandChangeStatus();
      }
    });
  }

  async exportandChangeStatus() {
    if (this.data.count() == 0)
      return this.alert(
        'warning',
        'No hay bienes para exportar y actualizar',
        ''
      );

    if (this.selectedGoods.length == 0)
      return this.alert('warning', 'No hay bienes seleccionados', '');

    this.loadingExportAndUpdate = true;
    let i = 0;
    let o = 0;
    let result = this.selectedGoods.map(async item_ => {
      let action = '';
      if (item_.rda) action = 'RDON';
      if (item_.adm) action = 'ADMIN';
      if (item_.cpd) action = 'CDON';

      let statusFinal: any = await this.returnService(
        'FDONACIONES',
        item_.status,
        item_.processExtDom,
        action
      );
      let descripcion = this.form.get('description').value;
      o++;
      if (!statusFinal) {
        i++;
      } else {
        let obj = {
          goodId: item_.goodNumber,
          id: item_.goodNumber,
          status: statusFinal.status,
          observations: descripcion + ' ',
        };

        item_.status = statusFinal.status;
        await this.updateGood(obj);

        let params2 = {
          propertyNum: item_.goodNumber,
          status: statusFinal.status,
          changeDate: new Date(),
          userChange: this.user,
          statusChangeProgram: 'FDONACIONES',
          reasonForChange: descripcion,
        };
        await this.insertHistoric(params2);
      }
    });
    Promise.all(result).then(item => {
      if (i == o) {
        this.alertQuestion(
          'warning',
          'No se actualizó el estatus de los bienes seleccionados',
          '¿Desea descargar el excel?'
        ).then(async question => {
          if (question.isConfirmed) {
            await this.exportToExcelX(false);
            this.loadingExportAndUpdate = false;
          } else {
            this.loadingExportAndUpdate = false;
          }
        });
      } else {
        if (this.valRastreador)
          this.getAllOfRastreador(this.goodsTracker, 'no');
        else this.getall1(true, 'no');

        this.alertInfo(
          'success',
          'Se actualizaron los bienes correctamente',
          ''
        ).then(async question => {
          // if (question.isConfirmed) {
          await this.exportToExcelX(false);
          this.loadingExportAndUpdate = false;
          // }
        });
        // this.alert('success', 'Se actualizaron los bienes correctamente', '');
      }
    });
  }

  insertHistoric(data: any) {
    return new Promise((resolve, reject) => {
      this.historyGoodService.PostStatus(data).subscribe({
        next: response => {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  updateGood(data: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateWithParams(data).subscribe({
        next: response => {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  returnService(cve: any, status: any, processExtDom: any, action: any) {
    return new Promise((resolve, reject) => {
      this.screenStatusService
        .getStatusEndforScreen(cve, status, processExtDom, action)
        .subscribe({
          next: response => {
            resolve(response.data[0].statusFinal);
          },
          error(err) {
            resolve(null);
          },
        });
    });
  }

  setValue(value: boolean) {
    this.checked = value;
    console.log('PRUEBA2->');
  }
  // EXPORTAR A EXCEL Y CAMBIAR ESTATUS
  async exportToExcelX(filter: boolean) {
    console.log('data select ', this.selectedData);
    let c = 0;
    let n = 0;
    let arregloPrincipal: any[] = [];
    if (this.selectedGoods.length == 0)
      return this.alert('warning', 'No hay bienes seleccionados', '');
    if (filter) this.loadingExport = true;
    let result = this.selectedGoods.map(item => {
      // if ([item.cpd, item.adm, item.rda].includes(true)) {
      c++;
      let item_: any = {
        NO_BIEN: item.goodNumber,
        DESCRIPCION: item.description,
        CANTIDAD: item.amount,
        NO_CLASIF_BIEN: item.notClassificationWell,
        NO_TRANSFERENTE: item.transferor,
        DEL_ADMINISTRA: item.delAdmin,
        DEL_RECIBE: item.delReceives,
        FECHA_RECEPCION: item.dateCrecep,
        ESTATUS: item.status,
        PROCESO_EXT_DOM: item.processExtDom,
        NO_EXPEDIENTE: item.proceedingsNumber,
        CANTIDAD_PROPUESTA: '0',
        CANTIDAD_DONADA: '',
        ID_ALMACEN: item.storeId,
        FEC_LIBERACION: item.dateRelease,
        NO_UNIDAD: item.unit,
        CVE_UNICA: item.onlyKey,
        NO_EMISORA: item.stationNumber,
      };
      arregloPrincipal.push(item_);
      // }
    });

    console.log('Data a enviar -> ', arregloPrincipal);
    Promise.all(result).then(item => {
      setTimeout(() => {
        const filename: string = 'FDONACIONES';
        this.excelService.export(arregloPrincipal, { type: 'xlsx', filename });
        if (filter) this.loadingExport = false;
        this.alert('success', 'Archivo descargado correctamente', '');
      }, 1000);
    });
  }

  // CONVERTIR BASE64 a XLSX
  convertAndDownloadExcel(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const workbook = XLSX.read(byteArray, { type: 'array' });
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, fileName);
  }
}
