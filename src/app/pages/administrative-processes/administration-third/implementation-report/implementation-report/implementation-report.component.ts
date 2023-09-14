import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IStrategyLovSer,
  IStrategyProcess,
  IStrategyTurn,
  IStrategyType,
  IStrateyCost,
} from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  area: number = 0;
  data1: any[] = [];
  desStrategy: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  turnos = new DefaultSelect();
  totalItems: number = 0;
  delegationUser: any;
  delegation = new DefaultSelect();
  settings2 = { ...this.settings, actions: false };
  types = new DefaultSelect();
  turns = new DefaultSelect();
  public serviceOrderKey = new DefaultSelect();
  public process = new DefaultSelect<IStrategyProcess>();
  public regionalCoordination = new DefaultSelect();
  public reportKey = new DefaultSelect();
  public status = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private strategyServiceService: StrategyServiceService,
    private authService: AuthService,
    private indicatorsParametersService: IndicatorsParametersService
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
      type: [null, Validators.required],
      turno: [null, Validators.required],
      process: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      reportKey: [null, Validators.required],
      status: [null, Validators.required],
      authorizationDate: [null, Validators.required],
      dateCapture: [null, Validators.required],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }

  public getReportKey(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getStatus(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
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
    this.strategyServiceService.getTurn(this.filterTurn).subscribe({
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
  getPostQuery() {
    // cursor T_DESPR is
    // select DESCRIPCION
    //   from ESTRATEGIA_PROCESO
    //  where NO_PROCESO = : ESTRATEGIA_FORMATO.NO_PROCESO;
    //   --Descripción de la Coordinacion Regional(2)
    // cursor T_DELEG is
    // select DESCRIPCION
    //   from CAT_DELEGACIONES
    //  where NO_DELEGACION = : ESTRATEGIA_FORMATO.NO_DELEGACION_1
    //  and ETAPA_EDO = FA_ETAPACREDA(SYSDATE);
  }
}
