import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { REQUEST_LIST_COLUMNS } from 'src/app/pages/siab-web/sami/consult-tasks/consult-tasks/consult-tasks-columns';
@Component({
  selector: 'app-consult-tasks',
  templateUrl: './consult-tasks.component.html',
  styles: [],
})
export class ConsultTasksComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  filter: any;
  totalItems: number = 0;
  //tasks: IRequestTask[] = [];
  tasks = new LocalDataSource();

  loadingText = '';
  userName = '';
  consultTasksForm: FormGroup;
  department = '';
  delegation: string = null;
  excelLoading = this.loading;

  get txtFecAsigDesde() {
    return this.consultTasksForm.get('txtFecAsigDesde');
  }

  get txtFechaFinDesde() {
    return this.consultTasksForm.get('txtFechaFinDesde');
  }

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private excelService: ExcelService,
    public router: Router,
    private fb: FormBuilder,
    private regionalDelegacionService: RegionalDelegationService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      hideSubHeader: false,
    };
    this.settings.columns = REQUEST_LIST_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    /*this.tasks.onChanged()
    .subscribe( change => {
      if (change.action === 'filter') {
        let filters = change.filter.filters;
        
        filters.map((filter: any) => {})
      }
    })*/
  }

  private prepareForm() {
    this.userName = this.authService.decodeToken().preferred_username;
    this.department = this.authService.decodeToken().department;

    this.consultTasksForm = this.fb.group({
      unlinked: [null, Validators.required],
      unlinked1: [null, Validators.required],
      txtSearch: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtTituloTarea: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtNoProgramacionEntrega: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtNoProgramacionRecepcion: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtNombreActividad: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtNoOrdenServicio: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtAsignado: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtNoOrdenPago: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtAprobador: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtNoOrdenIngreso: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtNombreAplicacion: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtNoMuestreo: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtFecAsigDesde: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtFecAsigHasta: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      txtNoMuestreoOrden: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtFechaFinDesde: [''],
      txtFechaFinHasta: [''],
      txtNoDelegacionRegional: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtNoSolicitud: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtNoTransferente: ['', Validators.pattern(NUMBERS_PATTERN)],
      txtNoProgramacion: ['', Validators.pattern(NUMBERS_PATTERN)],
      State: ['null'],
      typeOfTrasnfer: [null],
    });

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getTasks())
      )
      .subscribe();
  }
  searchTasks() {
    //this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getTasks())
      )
      .subscribe();
  }

  async exportToExcel() {
    this.excelLoading = true;
    const filename: string = this.userName + '-Tasks';
    // El type no es necesario ya que por defecto toma 'xlsx'
    let filter = this.filter;
    filter.getValue().limit = 99999999;
    console.log(filter.getValue());
    const response: any = await this.getData(filter.getValue());
    if (response) {
      const data: any[] = response.data.map((item: any) => {
        return {
          'Titulo de la Tarea': item.title,
          Salida: '',
          'Nombre de la Actividad': item.activitydescription,
          'Asignado a': item.assignees,
          Aprobador: item.approvers,
          'Nombre de la Aplicación': item.applicationdescription,
          'Nombre del Proceso': item.processdescription,
          'Nombre Tarea BPM': '',
          Estatus: item.State,
          'Porcentaje Completado': item.percentageComplete,
          Secuencia: '',
          'Fecha Asignación': item.assignedDate,
          'Fecha Finalización': item.endDate,
          'Duración tiempo (min)': '',
          'Duración tiempo (Días)': '',
          'No. Solicitud': item.requestId,
          'No. Programación': item.programmingId,
          'No. Programación Entrega': '',
          'No. Orden Servicio': '',
          'No. Muestreo': '',
          'No. Muestreo Orden': '',
          'No. Orden Ingreso': '',
          'No. Orden Pago': '',
          'No. Delegación Regional': item.idDelegationRegional,
          'No. Transferente': item.idTransferee,
        };
      });
      this.excelService.export(data, { filename });
      this.excelLoading = false;
    } else {
      this.alert('warning', 'No se encontraron datos para exportar', '');
      this.excelLoading = false;
    }
  }

  async getTasks(limitExport?: number) {
    let isfilterUsed = false;
    this.loading = true;
    const params = this.params.getValue();
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    if (limitExport) {
      this.filterParams.getValue().limit = limitExport;
    } else {
      this.filterParams.getValue().limit = params.limit;
    }
    const user = this.authService.decodeToken() as any;

    this.consultTasksForm.controls['txtNoDelegacionRegional'].setValue(
      Number.parseInt(user.department)
    );

    this.filterParams
      .getValue()
      .addFilter('assignees', user.username, SearchFilter.ILIKE);
    //this.filterParams.getValue().addFilter('title','',SearchFilter.NOT);
    const filterStatus = this.consultTasksForm.get('State').value;

    if (filterStatus) {
      isfilterUsed = true;
      if (filterStatus === 'null') {
        this.filterParams.getValue().addFilter('State', '', SearchFilter.NULL);
        this.getDelegationRegional(user.department);
      } else if (filterStatus === 'FINALIZADA') {
        this.filterParams.getValue().addFilter('FINALIZADA', filterStatus);
        this.getDelegationRegional(user.department);
      }
      if (filterStatus === 'TODOS') {
        this.consultTasksForm.controls['txtNoDelegacionRegional'].setValue('');
        this.delegation = '';
      }
    }

    if (this.consultTasksForm.value.typeOfTrasnfer) {
      isfilterUsed = true;
      const value = this.consultTasksForm.value.typeOfTrasnfer;

      if (value == 'FGR_SAE') {
        this.filterParams
          .getValue()
          .addFilter('request.typeOfTransfer', 'PGR_SAE', SearchFilter.EQ);
        this.filterParams
          .getValue()
          .addFilter('request.typeOfTransfer', value, SearchFilter.OR);
      } else {
        this.filterParams
          .getValue()
          .addFilter('request.typeOfTransfer', value, SearchFilter.EQ);
      }
    }

    if (this.consultTasksForm.value.txtNoSolicitud) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'requestId',
          this.consultTasksForm.value.txtNoSolicitud,
          SearchFilter.EQ
        );
    }

    if (this.consultTasksForm.value.txtTituloTarea) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'title',
          this.consultTasksForm.value.txtTituloTarea,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtNoProgramacionEntrega) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'programmingId',
          this.consultTasksForm.value.txtNoProgramacionEntrega,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtNombreActividad) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'activityName',
          this.consultTasksForm.value.txtNombreActividad,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtNoOrdenServicio) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          '-OrdenServicio',
          this.consultTasksForm.value.txtNoOrdenServicio,
          SearchFilter.ILIKE
        );
    }

    if (this.consultTasksForm.value.txtNoOrdenPago) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          '-OrdenPago',
          this.consultTasksForm.value.txtNoOrdenPago,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtAprobador) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'approvers',
          this.consultTasksForm.value.txtAprobador,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtNoOrdenIngreso) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          '-OrdenIngreso',
          this.consultTasksForm.value.txtNoOrdenIngreso,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtNombreAplicacion) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'applicationName',
          this.consultTasksForm.value.txtNombreAplicacion,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtNoMuestreo) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          '-NoMuestreo',
          this.consultTasksForm.value.txtNoMuestreo,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtFecAsigDesde) {
      isfilterUsed = true;
      const fechaInicio = this.consultTasksForm.value.txtFecAsigDesde;
      const fechaFin = this.consultTasksForm.value.txtFecAsigHasta;

      const inicio =
        fechaInicio instanceof Date
          ? fechaInicio.toISOString().split('T')[0]
          : fechaInicio;
      const final = fechaFin ? fechaFin.toISOString().split('T')[0] : inicio;

      this.filterParams
        .getValue()
        .addFilter('assignedDate', inicio + ',' + final, SearchFilter.BTW);
    }
    if (this.consultTasksForm.value.txtNoMuestreoOrden) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          '-NoMuestreoOrden',
          this.consultTasksForm.value.txtNoMuestreoOrden,
          SearchFilter.ILIKE
        );
    }
    if (this.consultTasksForm.value.txtFechaFinDesde) {
      isfilterUsed = true;
      const fechaInicio = this.consultTasksForm.value.txtFechaFinDesde;
      const fechaFin = this.consultTasksForm.value.txtFechaFinHasta;

      const inicio =
        fechaInicio instanceof Date
          ? fechaInicio.toISOString().split('T')[0]
          : fechaInicio;
      const final = fechaFin ? fechaFin.toISOString().split('T')[0] : inicio;

      this.filterParams
        .getValue()
        .addFilter('endDate', inicio + ',' + final, SearchFilter.BTW);
    }
    if (
      typeof this.consultTasksForm.value.txtNoDelegacionRegional == 'number'
    ) {
      isfilterUsed = true;
      this.filterParams.getValue().addFilter(
        'idDelegationRegional',
        // request.regionalDelegationNumber
        this.consultTasksForm.value.txtNoDelegacionRegional,
        SearchFilter.EQ
      );
    }
    if (typeof this.consultTasksForm.value.txtNoTransferente == 'number') {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'request.transferenceId',
          this.consultTasksForm.value.txtNoTransferente,
          SearchFilter.EQ
        );
    }
    if (typeof this.consultTasksForm.value.txtNoProgramacion == 'number') {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'programmingId',
          this.consultTasksForm.value.txtNoProgramacion,
          SearchFilter.EQ
        );
    }

    this.loading = true;
    this.loadingText = 'Cargando';

    params.text = this.consultTasksForm.value.txtSearch;
    params['others'] = this.userName;

    //this.tasks = [];
    this.tasks = new LocalDataSource();
    this.totalItems = 0;
    // if (!isfilterUsed) {
    //   this.filterParams.getValue().addFilter('State', '', SearchFilter.NULL);
    // }
    this.filter = this.filterParams;
    let filter = this.filterParams
      .getValue()
      .getParams()
      .concat('&sortBy=id:DESC');

    const response: any = await this.getData(filter);
    if (response) {
      this.tasks.load(response.data);
      this.tasks.refresh();
      this.totalItems = response.count;
    } else {
      this.tasks.load([]);
      this.tasks.refresh();
    }
  }

  getData(filter: any) {
    return new Promise((resolve, _reject) => {
      this.taskService.getTasksByUser(filter).subscribe({
        next: response => {
          this.loading = false;
          response.data.map((item: any) => {
            item.taskNumber = item.id;
            item.requestId =
              item.requestId != null ? item.requestId : item.programmingId;
          });
          resolve(response);
        },
        error: () => {
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  cleanFilter() {
    this.consultTasksForm.reset();
    this.consultTasksForm.updateValueAndValidity();
    this.consultTasksForm.controls['txtSearch'].setValue('');
    this.searchTasks();
  }

  onKeydown(event: any) {
    this.searchTasks();
  }

  getDelegationRegional(id: number | string) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.regionalDelegacionService.getAll(params).subscribe({
      next: resp => {
        this.delegation = resp.data[0].id + ' - ' + resp.data[0].description;
      },
      error: error => {},
    });
  }

  openTask(selected: any): void {
    let obj2Storage = {
      assignees: selected.assignees,
      displayName: this.userName,
      taskId: selected.requestId,
      id: selected.id,
    };

    localStorage.setItem(`Task`, JSON.stringify(obj2Storage));

    if (selected.requestId !== null && selected.urlNb !== null) {
      let url = `${selected.urlNb}/${selected.requestId}`;
      this.router.navigateByUrl(url);
    } else {
      this.alert('warning', 'No disponible', 'Tarea no disponible');
    }
  }
}
