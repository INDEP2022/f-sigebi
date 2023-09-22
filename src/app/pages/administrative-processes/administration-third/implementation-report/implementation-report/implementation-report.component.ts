import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import {
  ICostReport,
  IDelReportImp,
  IReportImp,
  IStrategyLovSer,
  IStrategyProcess,
  IStrategyTurn,
  IStrategyType,
  IStrateyCost,
} from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ImplementationReportHistoricComponent } from '../implementation-report-historic/implementation-report-historic.component';
import {
  IMPLEMENTATIONREPORT_COLUMNS,
  IMPLEMENTATION_COLUMNS,
} from './implementation-report-columns';
@Component({
  selector: 'app-implementation-report',
  templateUrl: './implementation-report.component.html',
  styles: [],
})
export class ImplementationReportComponent extends BasePage implements OnInit {
  serviceOrdersForm: FormGroup;
  filterType: IStrategyType;
  filterLovSer: IStrategyLovSer;
  filterTurn: IStrategyTurn;
  lv_VALELI: number = 0;
  filterCost: IStrateyCost;
  costosDes: any[];
  totalItems2: number = 0;
  loading2: boolean = false;
  columnFilters: any = [];
  selectedGooods: any[] = [];
  reportImp: IReportImp;
  area: number = 0;
  data1: any[] = [];
  mEli: IDelReportImp;
  costoR: ICostReport;
  dataTableGood: LocalDataSource = new LocalDataSource();
  actasObject: IProccedingsDeliveryReception;
  desStrategy: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  turnos = new DefaultSelect();
  totalItems: number = 0;
  delegationUser: any;
  dateCapt: string = '';
  bienesStrategy: LocalDataSource = new LocalDataSource();
  maxDate = new Date();
  disabledBtnActas: boolean = true;
  dateClose: string = '';
  delegation = new DefaultSelect();
  settings2 = { ...this.settings, actions: false };
  types = new DefaultSelect();
  turns = new DefaultSelect();
  selectedRow: any | null = null;
  public serviceOrderKey = new DefaultSelect();
  public process = new DefaultSelect<IStrategyProcess>();
  public regionalCoordination = new DefaultSelect();
  public reportKey = new DefaultSelect();
  public noFormat: number = 0;
  public status = new DefaultSelect();
  annio: string = '';
  to: string = '';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private strategyServiceService: StrategyServiceService,
    private authService: AuthService,
    private indicatorsParametersService: IndicatorsParametersService,
    private datePipe: DatePipe,
    private strategyProcessService: StrategyProcessService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private changeDetectorRef: ChangeDetectorRef,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: IMPLEMENTATIONREPORT_COLUMNS,
    };
    this.settings2.columns = IMPLEMENTATION_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.initForm();
    this.getProcess(new ListParams());
  }
  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      serviceOrderKey: [null, Validators.required],
      noFormat: [null, Validators.required],
      type: [null, Validators.required],
      turno: [null, Validators.required],
      process: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      reportKey: [null],
      status: [null, Validators.required],
      authorizationDate: [null, Validators.required],
      dateCapture: [null, Validators.required],
      observations: [null, Validators.required],
    });
  }

  openHistoric(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ImplementationReportHistoricComponent, config);
  }
  getTypes() {
    this.filterType = {
      pProcessNumber: this.serviceOrdersForm.get('process').value,
      pServiceNumber: this.serviceOrdersForm.get('serviceOrderKey').value,
    };
    this.strategyServiceService.getServiceType(this.filterType).subscribe({
      next: data => {
        data.data.filter((item: any) => {
          item['typeAndName'] = item.no_tiposervicio + '-' + item.descripcion;
        });
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.loading = false;
        this.types = new DefaultSelect();
      },
    });
  }

  getServices() {
    this.filterLovSer = {
      pProcessNumber: Number(this.serviceOrdersForm.get('process').value),
    };
    this.strategyServiceService.getServiceLov(this.filterLovSer).subscribe({
      next: data => {
        data.data.filter((item: any) => {
          item['serAndName'] = item.no_servicio + '-' + item.descripcion;
        });
        this.serviceOrderKey = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.loading = false;
        this.serviceOrderKey = new DefaultSelect();
      },
    });
  }

  getProcess($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllProcess(params).subscribe();
  }

  getAllProcess(params: FilterParams) {
    return this.strategyServiceService.getProcess(params.getParams()).pipe(
      catchError(error => {
        this.process = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          console.log(response.data);
          response.data.filter((item: any) => {
            item['proAndName'] = item.processNumber + '-' + item.description;
          });
          this.serviceOrdersForm.get('process').patchValue(response[0]);
        }
        this.process = new DefaultSelect(response.data, response.count);
      })
    );
  }

  initForm() {
    this.delegationUser = this.authService.decodeToken().delegacionreg;
    this.area = Number(this.authService.decodeToken().department);
    if (this.area == 0) {
      this.getProcess(new ListParams());
    } else {
      this.indicatorsParametersService.getRNomencla(this.area).subscribe({
        next: data => {
          this.delegation = new DefaultSelect(data.data);
        },
        error: () => {
          this.delegation = new DefaultSelect();
        },
      });
    }
  }
  getTurns() {
    this.filterTurn = {
      pProcessNumber: this.serviceOrdersForm.get('process').value,
      pServiceNumber: this.serviceOrdersForm.get('serviceOrderKey').value,
      pServiceTypeNumber: Number(this.serviceOrdersForm.get('type').value),
    };
    this.strategyServiceService.getTurn(this.filterTurn).subscribe({
      next: data => {
        data.data.filter((item: any) => {
          item['turnAndName'] = item.no_turno + '-' + item.descripcion;
        });
        this.turnos = new DefaultSelect(data.data, data.count);
        // console.log(data);
        // this.turnos = new DefaultSelect(data.data)
      },
      error: () => {
        this.loading = false;
        this.turnos = new DefaultSelect();
      },
    });
  }

  validaForm() {
    const resullt = true;
    const process = this.serviceOrdersForm.get('process').value;
    const serviceOrderKey = this.serviceOrdersForm.get('serviceOrderKey').value;
    const type = Number(this.serviceOrdersForm.get('type').value);
    const turno = this.serviceOrdersForm.get('turno').value;

    if (!Boolean(process)) {
      this.alert('info', 'seleccione el proceso para genera costos', '');
      return resullt;
    }

    if (!Boolean(serviceOrderKey)) {
      this.alert(
        'info',
        'seleccione una Clave de orden de servicio para genera costos',
        ''
      );
      return resullt;
    }

    if (!Boolean(type)) {
      this.alert('info', 'seleccione un tipo para genera costos', '');
      return resullt;
    }

    if (!Boolean(turno)) {
      this.alert('info', 'seleccione un turno para genera costos', '');
      return resullt;
    }

    // Si todos los campos son válidos, llamar a la función getCosts()
    this.getCosts();

    return resullt;
  }

  getCosts() {
    const process = this.serviceOrdersForm.get('process').value;
    const serviceOrderKey = this.serviceOrdersForm.get('serviceOrderKey').value;
    const type = this.serviceOrdersForm.get('type').value;
    const turno = Number(this.serviceOrdersForm.get('turno').value);

    this.filterCost = {
      pProcessNumber: process,
      pServiceNumber: serviceOrderKey,
      pServiceTypeNumber: type,
      pTurnNumber: turno,
    };

    this.strategyServiceService.getCosts(this.filterCost).subscribe({
      next: data => {
        this.costosDes = data.data;
      },
      error: () => {
        this.loading = false;
        this.turns = new DefaultSelect();
      },
    });
  }

  getReportImp() {
    // if (this.serviceOrdersForm.value.noFormat == null || 0) {
    //   this.alert('warning', 'Debe ingresar la Clave de Orden de Servicio', '');
    //   return;
    // }
    this.strategyProcessService
      .getStrategyRepImplementation(this.serviceOrdersForm.value.noFormat)
      .subscribe({
        next: data => {
          this.reportImp = data.data;
          console.log(this.reportImp);
          data.data.filter((value: any) => {
            console.log(value);
            this.dateCapt = this.datePipe.transform(
              value.captureDate,
              'dd/MM/yyyy'
            );
            this.dateClose = this.datePipe.transform(
              value.authorizeDate,
              'dd/MM/yyyy'
            );
            this.serviceOrdersForm.get('reportKey').setValue(value.reportKey);
            this.serviceOrdersForm.get('status').setValue(value.status);
            this.serviceOrdersForm
              .get('authorizationDate')
              .setValue(this.dateClose);
            this.serviceOrdersForm.get('dateCapture').setValue(this.dateCapt);
            this.serviceOrdersForm
              .get('observations')
              .setValue(value.observations);
            this.serviceOrdersForm.get('process').setValue(value.processNumber);
          });
        },
      });
  }
  pupGenera() {
    console.log(this.serviceOrdersForm.value.noFormat);
    try {
      if (this.serviceOrdersForm.value.noFormat == null) {
        this.alert(
          'warning',
          'Debe ingresar la Clave de Orden de Servicio y seleccionar las Estrategias de Administración',
          ''
        );
        return;
      }
      this.alertQuestion(
        'question',
        'Generar',
        '¿Seguro que desea generar el Reporte de Implementación?'
      ).then(question => {
        if (question.isConfirmed) {
          if (
            this.serviceOrdersForm.value.status == 'AUTORIZADA' ||
            this.serviceOrdersForm.value.status == 'CANCELADA'
          ) {
            this.alert(
              'warning',
              '',
              `El reporte de Implementaión ya se encuentra ${this.serviceOrdersForm.value.status}`,
              ''
            );
          }
          if (this.serviceOrdersForm.get('dateCapture').value == null) {
            this.alert(
              'warning',
              'La Clave de Acta aun no se encuentra Cerrada',
              ''
            );
          }
          if (this.serviceOrdersForm.value.reportKey == null) {
            // this.genClave();
          } else {
            // this.alert(
            //   'warning',
            //   'El tiempo para Generar la Clave de Reporte a Expirado',
            //   ''
            // );
            this.generaReporte();
            console.log(
              ' en espera dde funcion para generar',
              this.dateCapt + this.dateClose
            );
          }
        }
      });
    } catch {
      console.log('error reporte');
    }
  }

  cargaBienes() {
    if (this.serviceOrdersForm.value.noFormat == null) {
      this.alert(
        'warning',
        'Debe ingresar la Clave de Orden de Servicio para incorporar Bienes',
        ''
      );
      return;
    }
    this.alertQuestion(
      'question',
      'Incorporar',
      '¿Seguro que desea Incorporar Bienes al Reporte?'
    ).then(question => {
      if (question.isConfirmed) {
        let params = {
          ...this.params.getValue(),
          ...this.columnFilters,
        };
        this.goodPosessionThirdpartyService
          .getAllStrategyGoodsById(
            this.serviceOrdersForm.value.noFormat,
            params
          )
          .subscribe({
            next: data => {
              console.log(data);
              this.dataTableGood.load(data.data);
              this.dataTableGood.refresh();
              this.totalItems = data.count;
            },
            error: () => {
              console.log('error');
              this.loading = false;
            },
          });
      }
    });
  }
  cleanForm() {
    this.serviceOrdersForm.reset();
    this.reportImp = null;
    this.dataTableGood.load([]);
    this.dataTableGood.refresh();
    this.bienesStrategy.load([]);
    this.bienesStrategy.refresh();
  }
  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  genClave() {
    if (
      this.serviceOrdersForm.value.process == null ||
      this.serviceOrdersForm.value.type == null ||
      this.serviceOrdersForm.value.turno == null ||
      this.serviceOrdersForm.value.serviceOrderKey == null
    ) {
      this.alert(
        'info',
        'Debe Seleccionar Prceso, Servicio, Tipo y Turno para generar la Clave',
        ''
      );
    }
  }
  onUserRowSelect(event: { data: any; selected: any }) {
    this.selectedRow = event.data;
    this.selectedGooods = event.selected;
    console.log(this.selectedGooods);
    this.changeDetectorRef.detectChanges();
  }
  incorporaGoods() {
    if (this.selectedGooods.length == 0) {
      this.alert(
        'info',
        'Es necesario seleccionar bienes para generar el reporte',
        ''
      );
      return;
    }
  }

  elimina() {
    if (this.reportImp.reportNumber === null) {
      this.alert('info', 'No existe el reporte de implementación', '');
      return;
    }
    this.alertQuestion(
      'question',
      'Eliminar',
      `¿Seguro que desea eliminar bienes bien(es) del Reporte de Implementación ${this.serviceOrdersForm.value.reportKey}? `
    ).then(question => {
      if (question.isConfirmed) {
        this.selectedGooods.forEach(good => {
          const data = {
            formatNumber: good.formatNumber,
            goodNumber: good.goodNumber.id,
            actNumber: good.actNumber,
          };
          this.goodPosessionThirdpartyService
            .deleteReportGoodImp(data)
            .subscribe(res => {
              console.log(res);
              this.lv_VALELI = 4;
            });
        });
      } else {
        this.lv_VALELI = 5;
      }
      this.dataTableGood.refresh();
      console.log(this.lv_VALELI);
    });
  }
  generaReporte(): void {
    try {
      if (this.serviceOrdersForm.value.regionalCoordination === null) {
        this.alert('warning', 'Debe seleccionar la Coordinación Regional', '');
        return;
      }
      let params = {
        P_ANIO: 2023,
        P_COORDINACION: this.serviceOrdersForm.value.regionalCoordination,
        P_MES: 12,
        P_USUARIO: this.authService.decodeToken().username,
      };
      this.siabService
        // .fetchReport('RINDICA_0006', params)
        .fetchReport('blank', params)
        .subscribe(response => {
          // response=null;
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            // this.onLoadToast(
            //   'warning',
            //   'advertencia',
            //   'Sin Datos Para los Rangos de Fechas Suministrados'
            // );
            console.log('error');
          }
        });
    } catch {
      console.log('error');
    }
  }

  incorporaCostos() {
    if (this.reportImp.reportNumber === null) {
      this.alert('warning', 'No existe el reporte de Implementación', '');
      return;
    }
    this.alertQuestion(
      'question',
      'Incorporar',
      '¿Seguro que desea Incorporar Costos al Reporte?'
    ).then(question => {
      if (question.isConfirmed) {
        this.costoR = {
          serviceNumber: this.serviceOrdersForm.value.serviceOrderKey,
          typeServiceNumber: this.serviceOrdersForm.value.type,
          turnNumber: this.serviceOrdersForm.value.turno,
          varCosteNumber: 7,
          importTot: this.totalItems,
          amountTot: 2000,
        };
        this.goodPosessionThirdpartyService.getIncCosto(this.costoR).subscribe({
          next: data => {
            console.log(data.data);
            this.bienesStrategy.load(data.data);
            this.totalItems2 = data.count;
            this.bienesStrategy.refresh();
            console.log('costos', data);
          },
        });
        console.log('aqui se incorporan');
      } else {
        return;
      }
    });
  }

  bitacora() {}
}
