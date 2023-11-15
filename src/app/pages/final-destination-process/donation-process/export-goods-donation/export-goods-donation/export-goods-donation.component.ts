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
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import * as XLSX from 'xlsx';
import { MassiveGoodService } from '../../../../../core/services/ms-massivegood/massive-good.service';
import { DetailProceeDelRecService } from '../../../../../core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { COLUMNS_EXPORT_GOODS } from './columns-export-goods';

@Component({
  selector: 'app-export-goods-donation',
  templateUrl: './export-goods-donation.component.html',
  styles: [],
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
  rel_bienes: any;

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
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      // selectMode: 'multi'
    };
    this.settings.columns = {
      ...COLUMNS_EXPORT_GOODS,
    };
    this.settings.hideSubHeader = false;
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
            //console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
            this.rel_bienes = this.ngGlobal.REL_BIENES;
          }
        },
      });
    if (this.rel_bienes != null) {
      this.backRastreador(this.rel_bienes);
    }

    this.data.load(this.data1);
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

  async mapearDatos(response: any) {
    this.data1 = []; // Se inicializa vavicio para que no se duplique al dar click
    this.data.load([]);
    // for (let i = 0; i < response.data.length; i++) {
    let arr: any[] = [];
    let result = response.data.map(async (item: any) => {
      let padre =
        item.no_bien_padre_parcializacion != null
          ? item.no_bien_padre_parcializacion
          : '1';
      let dataForm: any = {
        numberGood: item.no_bien,
        description: item.descripcion,
        quantity: item.cantidad,
        clasificationNumb: item.no_clasif_bien,
        tansfNumb: item.no_transferente,
        proceso_ext_dom: item.proceso_ext_dom,
        id_almacen: item.id_almacen,
        fecha_liberacion: item.fecha_liberacion,
        status: item.estatus,
        unidad: item.unidad,
        proceedingsNumb: item.no_expediente,
        goodTotal: item,
      };
      const model = {} as IGoodsExportPost;
      (model.noBien = item.no_bien),
        (model.vNoBienPadre = padre),
        (model.vNobienreferencia = item.no_bien_referencia);
      //Servicio1
      let acta: any = 0;
      acta = await this.returnFirst(model);
      if (acta != 0) {
        // Servicio2
        let res: any = await this.returnSecond(acta);
        dataForm.delAdmin = res.del_administra;
        dataForm.delDeliv = res.del_recibe;
        dataForm.recepDate = res.fecha_recepcion;
        // item['delAdmin'] = res.del_administra;
        // item['delDeliv'] = res.del_recibe;
        // item['recepDate'] = res.fecha_recepcion;
      }

      let third: any = await this.returnThird(item.no_expediente);
      dataForm.no_emisora = third.no_emisora;
      dataForm.no_tran_emi_aut = third.no_tran_emi_aut;
      // item['no_emisora']= third.no_emisora;
      // item['no_tran_emi_aut'] = third.no_tran_emi_aut;
      arr.push(dataForm);
    });

    Promise.all(result).then(item => {
      this.data1 = arr;
      this.data.load(arr);
      this.data.refresh();
      this.totalItems = response.count;
      this.loading = false;
    });

    // this.delegationService.postCatalog(model).subscribe({
    //   next: resp => {
    //     let acta = resp.data[0].coalesce;
    //     //Servicio2
    //     this.delegationService.getTran(response.data[i].no_expediente)
    //       .subscribe(respo => {
    //         if (respo != null && resp != undefined) {
    //           console.log('Resp tranEmit', respo);
    //           //servicio 3
    //           this.detailProceeDelRecService.getProceding(acta).subscribe({
    //             next: res => {
    //               console.log('res 2 -> ', res);
    //               let arr: any[] = []
    //               let result = response.data.map((item: any) =>{
    //                 let dataForm = {
    //                   numberGood: response.data[i].no_bien,
    //                   description: response.data[i].descripcion,
    //                   quantity: response.data[i].cantidad,
    //                   clasificationNumb: response.data[i].no_clasif_bien,
    //                   tansfNumb: response.data[i].no_transferente,
    //                   proceso_ext_dom: response.data[i].proceso_ext_dom,
    //                   id_almacen: response.data[i].id_almacen,
    //                   fecha_liberacion: response.data[i].fecha_liberacion,
    //                   status: response.data[i].estatus,
    //                   unidad: response.data[i].unidad,
    //                   proceedingsNumb: response.data[i].no_expediente,
    //                   delAdmin: res.del_administra,
    //                   delDeliv: res.del_recibe,
    //                   recepDate: res.fecha_recepcion,
    //                   no_emisora: respo.data[0].no_emisora,
    //                   no_tran_emi_aut: respo.data[0].no_tran_emi_aut,
    //                   goodTotal: response.data[i],
    //                 };
    //                 arr.push(dataForm)
    //               })

    //               // console.log('DATA FORM ->', dataForm);
    //               Promise.all(result).then(resp => {

    //               })
    //             },
    //           });
    //         }
    //       });
    //   },
    // });
    // }
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
    this.getall1(this.boolCon, 'si');
  }

  getall1(boolCon: boolean, filter: string) {
    if (boolCon != true) {
      return;
    }
    this.loading = true;
    this.data1 = [];
    this.totalItems = 0;
    this.data.load(this.data1);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('Params-> ', params);
    this.expedientSamiService.getexpedient(params).subscribe({
      next: response => {
        console.log('Respuesta ', response);
        this.generarAlerta(response, filter);
        // this.totalItems = response.count;
        // this.loading = false;
      },
      error: err => {
        console.log('err ->', err);
        this.data1.push(params);
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
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
              case 'numberGood':
                field = 'filter.no_bien';
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.EQ;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'clasificationNumb':
                searchFilter = SearchFilter.EQ;
                break;
              case 'tansfNumb':
                searchFilter = SearchFilter.EQ;
                break;
              case 'delAdmin':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'delDeliv':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'recepDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'proceedingsNumb':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getall1(this.boolCon, 'no');
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getall1(this.boolCon, 'no'));
  }

  generarAlerta(response: any, filter: any) {
    if (filter == 'no') {
      this.mapearDatos(response);
    } else {
      if (response.count > 1000) {
        this.alertQuestion(
          'question',
          'Se recuperarán ' + response.count + ' registros',
          '¿Deseas continuar?'
        ).then(question => {
          if (question.isConfirmed) {
            this.mapearDatos(response);
          } else {
            this.loading = false;
            return;
          }
        });
      } else {
        this.mapearDatos(response);
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
                        numberGood: response.data[0].goodId,
                        description: response.data[0].description,
                        quantity: response.data[0].quantity,
                        clasificationNumb: response.data[0].goodClassNumber,
                        tansfNumb: response.data[0].transferNumberFiles,
                        proceso_ext_dom: response.data[0].extDomProcess,
                        id_almacen: response.data[0].storeNumber,
                        fecha_liberacion: '',
                        status: response.data[0].goodStatus,
                        unidad: response.data[0].unit,
                        proceedingsNumb: response.data[0].fileNumber,
                        delAdmin: res.del_administra,
                        delDeliv: res.del_recibe,
                        recepDate: res.fecha_recepcion,
                        no_emisora: respo.data[0].no_emisora,
                        no_tran_emi_aut: respo.data[0].no_tran_emi_aut,
                        goodTotal: response.data[0],
                      };
                      console.log('DATA FORM ->', dataForm);
                      this.data1.push(dataForm); // invocar todos tres servicios
                      this.data.load(this.data1); // cuando ya pasa todo, se mapea la info
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
    this.goodTrackerService.PaInsGoodtmptracker(global).subscribe({
      next: response => {
        this.total = response.count;
        console.log('respuesta TMPTRAKER', response);
        for (let i = 0; i < response.data.length; i++) {
          console.log('entra ---> For');
          this.addGoodRastreador(response.data[i].goodNumber);
          this.totalItems = response.count;
        }
        console.log('sale del For');
        window.scrollTo(0, 80);
      },
    });
  }

  // SELECCIONA TODO CPD
  selectAllCPD() {
    this.adm = false;
    this.cpd = true;
    this.rda = false;
    this.data1.forEach((item: any) => {
      if (item.cpd) {
        item.cpd = false; // Si CPD está seleccionado, deselecciónalo
      } else {
        item.cpd = true; // Si CPD no está seleccionado, selecciónalo
        item.adm = false; // Deselecciona ADM
        item.rda = false; // Deselecciona RDA
      }
    });
    this.data.load(this.data1);
    this.data.refresh();
  }
  // SELECCIONA TODO ADM
  selectAllADM() {
    this.adm = true;
    this.cpd = false;
    this.rda = false;
    this.data1.forEach((item: any) => {
      if (item.adm) {
        item.adm = false;
      } else {
        item.adm = true;
        item.cpd = false;
        item.rda = false;
      }
    });
    this.data.load(this.data1);
    this.data.refresh();
  }
  // SELECCIONA TODO RDA
  selectAllRDA() {
    this.adm = false;
    this.cpd = false;
    this.rda = true;
    this.data1.forEach((item: any) => {
      if (item.rda) {
        item.rda = false;
      } else {
        item.rda = true;
        item.cpd = false;
        item.adm = false;
      }
    });
    this.data.load(this.data1);
    this.data.refresh();
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

    let message = 'Se actualizarán el estatus de los bienes';
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
        'No hay bienes por exportar y actualizar',
        ''
      );
    this.data.getElements().then(item => {
      let i = 0;
      let o = 0;
      let result = item.map(async (item_: any) => {
        if ([item_.cpd, item_.adm, item_.rda].includes(true)) {
          let statusFinal: any = await this.returnService(
            'FDONACIONES',
            item_.status,
            item_.proceso_ext_dom
          );
          let descripcion = this.form.get('description').value;
          o++;
          if (!statusFinal) {
            i++;
          } else {
            let obj = {
              goodId: item_.no_bien_referencia.replace(' ', ''),
              id: item_.no_bien.replace(' ', ''),
              status: statusFinal,
              observations: descripcion + ' ' + item_.goodTotal.observations,
            };
            await this.updateGood(obj);

            let params2 = {
              propertyNum: item_.numberGood.replace(' ', ''),
              status: statusFinal,
              changeDate: new Date(),
              userChange: this.user,
              statusChangeProgram: 'FDONACIONES',
              reasonForChange: descripcion,
            };
            await this.insertHistoric(params2);
          }
        }
      });
      Promise.all(result).then(resp => {
        if (i == o) {
          this.alertQuestion(
            'warning',
            'No se actualizaron el estatus de los bienes seleccionados',
            '¿Desea descargar el excel?'
          ).then(async question => {
            if (question.isConfirmed) {
              await this.exportToExcelX();
            }
          });
        } else {
          this.getall1(true, 'no');
          this.alertInfo(
            'success',
            'Se actualizaron los bienes correctamente',
            ''
          ).then(async question => {
            // if (question.isConfirmed) {
            await this.exportToExcelX();
            // }
          });
          // this.alert('success', 'Se actualizaron los bienes correctamente', '');
        }
      });
    });
    return;
    // for (let i = 0; i < this.data1.length; i++) {
    //   let item = this.data1[i]
    //   if ( [item.cpd, item.adm, item.rda].includes(true)
    //   // this.data1[i].cpd == true || this.data1[i].adm == true || this.data1[i].rda == true
    //   ) {
    //     let cve = 'FDONACIONES';
    //     this.screenStatusService.getStatusEndforScreen(cve, this.data1[i].status, this.data1[i].proceso_ext_dom)
    //       .subscribe({
    //         next: response => {
    //           let statusFinal = response.data[0].statusFinal;
    //           let descripcion = this.form.get('description').value;
    //           this.data1[i].goodTotal.status = statusFinal;
    //           this.data1[i].goodTotal.descripcion =
    //             descripcion + ' ' + this.data1[i].goodTotal.observations;
    //           let params2 = {
    //             propertyNum: this.data1[i].numberGood,
    //             status: statusFinal,
    //             changeDate: new Date(),
    //             userChange: this.user,
    //             statusChangeProgram: 'FDONACIONES',
    //             reasonForChange: this.form.get('description').value,
    //           };
    //           this.goodService.updateWithParams(this.data1[i].goodTotal)
    //             .subscribe({
    //               next: response => {
    //                 this.alert(
    //                   'success',
    //                   'Exitoso',
    //                   'Se actualizó correctamente'
    //                 );
    //               },
    //               error: err => {
    //                 this.alert(
    //                   'error',
    //                   'Error',
    //                   'Hubo un error al actualizar el bien'
    //                 );
    //               },
    //             }),
    //             this.historyGoodService.PostStatus(params2).subscribe({
    //               next: response => {},
    //             });
    //         },
    //       });
    //   }
    // }
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

  returnService(cve: any, status: any, processExtDom: any) {
    return new Promise((resolve, reject) => {
      this.screenStatusService
        .getStatusEndforScreen(cve, status, processExtDom)
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
  async exportToExcelX() {
    console.log('data select ', this.selectedData);
    let c = 0;
    let n = 0;
    let arregloPrincipal: any[] = [];
    let result = this.data1.map(item => {
      if ([item.cpd, item.adm, item.rda].includes(true)) {
        c++;
        let item_: any = {
          NO_BIEN: item.numberGood,
          DESCRIPCION: item.description,
          CANTIDAD: item.quantity,
          NO_CLASIF_BIEN: item.clasificationNumb,
          NO_TRANSFERENTE: item.tansfNumb,
          DEL_ADMINISTRA: item.delAdmin,
          DEL_RECIBE: item.delDeliv,
          FECHA_RECEPCION: item.recepDate,
          ESTATUS: item.status,
          PROCESO_EXT_DOM: item.proceso_ext_dom,
          NO_EXPEDIENTE: item.proceedingsNumb,
          CANTIDAD_PROPUESTA: '0',
          CANTIDAD_DONADA: '',
          ID_ALMACEN: item.id_almacen,
          FEC_LIBERACION: item.fecha_liberacion,
          NO_UNIDAD: item.unidad,
          CVE_UNICA: item.no_tran_emi_aut,
          NO_EMISORA: item.no_emisora,
        };
        arregloPrincipal.push(item_);
      }
    });

    if (arregloPrincipal.length == 0) {
      this.alert(
        'warning',
        'Seleccione los bienes a exportar',
        ''
        // 'Seleccione un estado de los bienes que quiere exportar'
      );
      return;
    }
    // for (let i = 0; i < this.data1.length; i++) {
    //   if ( this.data1[i].cpd == true || this.data1[i].adm == true || this.data1[i].rda == true ) {
    //     c++;
    //     console.log('entra ', this.data1[i]);
    //     let item: any = {
    //       numberGood: this.data1[i].numberGood,
    //       description: this.data1[i].description,
    //       quantity: this.data1[i].quantity,
    //       clasificationNumb: this.data1[i].clasificationNumb,
    //       tansfNumb: this.data1[i].tansfNumb,
    //       proceso_ext_dom: this.data1[i].proceso_ext_dom,
    //       id_almacen: this.data1[i].id_almacen,
    //       fecha_liberacion: this.data1[i].fecha_liberacion,
    //       status: this.data1[i].status,
    //       unidad: this.data1[i].unidad,
    //       proceedingsNumb: this.data1[i].proceedingsNumb,
    //       delAdmin: this.data1[i].delAdmin,
    //       delDeliv: this.data1[i].delDeliv,
    //       recepDate: this.data1[i].recepDate,
    //       no_emisora: this.data1[i].no_emisora,
    //       no_tran_emi_aut: this.data1[i].no_tran_emi_aut,
    //     };
    //     arregloPrincipal.push(item);
    //   } else {
    //     n++;
    //     console.log('this ', this.data1[i], '', n);
    //     if (n == this.data1.length) {
    //       this.alert(
    //         'warning',
    //         'Seleccione los bienes a exportar',
    //         ''
    //         // 'Seleccione un estado de los bienes que quiere exportar'
    //       );
    //       return;
    //     }
    //   }
    // }
    console.log('Data a enviar -> ', arregloPrincipal);
    Promise.all(result).then(item => {
      const filename: string = 'ExcelDownload';
      this.excelService.export(arregloPrincipal, { type: 'xlsx', filename });
      this.alert('success', 'Archivo descargado correctamente', '');
    });

    // let array = {
    //   data: arregloPrincipal,
    // };
    // this.massiveGoodService.exportXlsx(array).subscribe({
    //   next: response => {
    //     this.convertAndDownloadExcel(response.base64File, response.fileName);
    //     this.alert('success', 'Exportación excel', 'Generada correctamente');
    //   },
    //   error: err => {
    //     this.alert('error', 'No se puede copiar el archivo de excel.', '');
    //   },
    // });
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
