import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IReportImp,
  IStrategyLovSer,
  IStrategyProcess,
  IStrategyTurn,
  IStrategyType,
  IStrateyCost,
} from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
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
  filterCost: IStrateyCost;
  reportImp: IReportImp;
  area: number = 0;
  data1: any[] = [];
  desStrategy: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  turnos = new DefaultSelect();
  totalItems: number = 0;
  delegationUser: any;
  dateCapt: string = '';
  maxDate = new Date();
  dateClose: string = '';
  delegation = new DefaultSelect();
  settings2 = { ...this.settings, actions: false };
  types = new DefaultSelect();
  turns = new DefaultSelect();
  public serviceOrderKey = new DefaultSelect();
  public process = new DefaultSelect<IStrategyProcess>();
  public regionalCoordination = new DefaultSelect();
  public reportKey = new DefaultSelect();
  public noFormat: number = 0;
  public status = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private strategyServiceService: StrategyServiceService,
    private authService: AuthService,
    private indicatorsParametersService: IndicatorsParametersService,
    private datePipe: DatePipe,
    private strategyProcessService: StrategyProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
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
          item['turnAndName'] = item.no_tiposervicio + '-' + item.descripcion;
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

  getCosts() {
    // this.strategyServiceService.getCosts()}
    this.filterCost = {
      pProcessNumber: this.serviceOrdersForm.get('process').value,
      pServiceNumber: this.serviceOrdersForm.get('serviceOrderKey').value,
      pServiceTypeNumber: Number(this.serviceOrdersForm.get('type').value),
      pTurnNumber: this.serviceOrdersForm.get('turno').value,
    };
    this.strategyServiceService.getCosts(this.filterCost).subscribe({
      next: data => {
        // data.data.filter((item: any) => {
        //   item['turnAndName'] = item.no_tiposervicio + '-' + item.descripcion;
        // });
        // this.turns = new DefaultSelect(data.data, data.count);
        console.log('costos', data);
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
          data.data.filter((value: any) => {
            this.reportImp = value;
            console.log(value);
            this.dateCapt = this.datePipe.transform(
              this.serviceOrdersForm.value.dateCapture,
              'dd/MM/yyyy'
            );
            this.dateClose = this.datePipe.transform(
              this.serviceOrdersForm.value.authorizationDate,
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
        'warning',
        'Generar',
        '¿Seguro que desea generar el Reporte de Implementación?'
      ).then(question => {
        if (question.isConfirmed) {
          if (
            this.reportImp.reportNumber == null &&
            this.reportImp.reportKey != null
          ) {
            this.genClave();
          } else if (this.reportImp.captureDate == null) {
            this.alert(
              'warning',
              'La Clave de Acta aun no se encuentra Cerrada',
              ''
            );
          } else {
            this.alert(
              'warning',
              'El tiempo para Generar la Clave de Reporte a Expirado',
              ''
            );
          }
        }
      });
      // this.getReportImp();
      this.dateCapt = this.datePipe.transform(
        this.serviceOrdersForm.value.dateCapture,
        'dd/MM/yyyy'
      );
      this.dateClose = this.datePipe.transform(
        this.serviceOrdersForm.value.authorizationDate,
        'dd/MM/yyyy'
      );
      let fechaCapture = this.dateCapt;
      let fechaCierre = this.dateClose;
      let vParUser = this.authService.decodeToken().username;
    } catch {
      console.log('error reporte');
    }
  }

  cargaBienes() {
    //   if : ESTRATEGIA_REP_IMPLEMENTACION.NO_REPORTE is null then
    //   LIP_MENSAJE('No se pueden incorporar bienes si no hay Reporte de Implementación', 'C');
    // else
    // LIP_COMMIT_SILENCIOSO;
    // PUP_INCORPORA_BIENES;
    // end if;
    if (this.reportImp.reportNumber == null) {
      this.alert(
        'warning',
        'Debe elegir una Estrategia de Administración para Generar la clave de Reporte de Implementación',
        ''
      );
      return;
    }
    this.alertQuestion(
      'warning',
      'Generar',
      '¿Seguro que desea generar el Reporte de Implementación?'
    ).then(question => {
      if (question.isConfirmed) {
        // if (this.repImplenta == null) {
        // }
        // IF: ESTRATEGIA_REP_IMPLEMENTACION.NO_REPORTE is null then
        // this.parameterTiieService.remove(tiie.id).subscribe({
        //   next: data => {
        //     this.loading = false;
        //     this.onLoadToast('success', 'Registro Eliminado', '');
        //     this.getData();
        //   },
        //   error: error => {
        //     this.onLoadToast('error', 'No Se Puede Eliminar Registro', '');
        //     this.loading = false;
        //   },
        // });
      }
    });
  }
  cleanForm() {
    this.serviceOrdersForm.reset();
    this.reportImp = null;
  }

  genClave() {}
}
