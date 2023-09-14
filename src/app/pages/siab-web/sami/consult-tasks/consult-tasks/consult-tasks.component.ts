import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, map, takeUntil, tap } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { REQUEST_LIST_COLUMNS } from 'src/app/pages/siab-web/sami/consult-tasks/consult-tasks/consult-tasks-columns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-consult-tasks',
  templateUrl: './consult-tasks.component.html',
  styleUrls: ['./consult-tasks.component.scss'],
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
  transferents$ = new DefaultSelect<ITransferente>();

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
    private regionalDelegacionService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private requestServevice: RequestService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      hideSubHeader: true,
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
      State: ['PROCESO'],
      typeOfTrasnfer: [null],
      txtDaysAtrasos: [null],
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

  donwloadReport() {
    const obj: Object = {
      idDelegationRegional: this.consultTasksForm.value.txtNoDelegacionRegional,
      idTransferee: Number(this.consultTasksForm.value.txtNoTransferente),
    };

    console.log('Objeto', obj);

    this.taskService.downloadReport(obj).subscribe({
      next: resp => {
        const data = resp.base64File;
        console.log('Base64: ', data);
        if (data != '') {
          const base64String = data;
          const binaryData = atob(base64String);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          const workbook = XLSX.read(bytes, { type: 'array' });
          const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });

          const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const filename = 'reporteAtrasos.xlsx';
          saveAs(blob, filename);
        } else if (data === '') {
          this.alert(
            'warning',
            'Sin información',
            'No hay reporte disponible para la transferente seleccionada'
          );
        }
      },
      error: error => {
        this.alert('error', 'Error', 'Hubo un problema al generar el reporte');
      },
    });
  }

  replaceAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getTransferent(params?: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    //params['filter.typeTransferent'] = `$eq:NO`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        const text = this.replaceAccents(params.text);
        data.data.map(data => {
          data.nameAndId = `${data.nameTransferent}`;
          return data;
        });
        this.transferents$ = new DefaultSelect(data.data, data.count);

        if (params.text) {
          let copyData = [...data.data];
          copyData.map(data => {
            data.nameAndId = this.replaceAccents(data.nameAndId);
            return data;
          });

          copyData = copyData.filter(item => {
            return text.toUpperCase() === ''
              ? item
              : item.nameAndId.toUpperCase().includes(text.toUpperCase());
          });

          copyData.map(x => {
            x.nameAndId = `${x.nameTransferent}`;
            return x;
          });

          if (copyData.length > 0) {
            this.transferents$ = new DefaultSelect(copyData, copyData.length);
          }
        }
      },
      error: () => {
        this.transferents$ = new DefaultSelect();
      },
    });
  }

  async exportToExcel() {
    this.excelLoading = true;
    //const filename: string = this.userName + '-Tasks';
    // El type no es necesario ya que por defecto toma 'xlsx'
    /*let filter = this.filter;
    filter.getValue().limit = 99999999;
    filter.sortBy = 'id:DESC'
    console.log(filter.getValue());*/

    const user = this.authService.decodeToken() as any;
    const idDeleReg = this.consultTasksForm.value.txtNoDelegacionRegional;
    const filterStatus = this.consultTasksForm.get('State').value;
    const params = new ListParams();
    params['filter.assignees'] = `$ilike:${user.username}`;
    params['filter.State'] = `$eq:${filterStatus}`;
    params['filter.idDelegationRegional'] = `$eq:${idDeleReg}`;
    params['sortBy'] = 'id:DESC';
    const result: any = await this.getTaskRepostBase64(params);
    const base64String = result.base64File;
    const filename: string = result.nameFile;
    if (base64String != '') {
      const base64 = base64String;
      const linkSource = 'data:application/xlsx;base64,' + base64;
      const downloadLink = document.createElement('a');
      const fileName = `tareas.xlsx`; //filename
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
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
        //Cambiar filtro a PROCESO, cuando esten abiertas
        this.filterParams.getValue().addFilter('State', '', SearchFilter.NULL);
        this.getDelegationRegional(user.department);
      } else if (filterStatus === 'FINALIZADA') {
        this.filterParams.getValue().addFilter('State', filterStatus);
        this.getDelegationRegional(user.department);
      } else if (filterStatus === 'PROCESO') {
        this.filterParams.getValue().addFilter('State', filterStatus);
        this.getDelegationRegional(user.department);
      }
      // if (filterStatus === 'TODOS') {
      //   this.consultTasksForm.controls['txtNoDelegacionRegional'].setValue('');
      //   this.delegation = '';
      // }
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

    if (this.consultTasksForm.value.txtNoTransferente) {
      console.log('Filtro de transferente activado');
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'idTransferee',
          this.consultTasksForm.value.txtNoTransferente,
          SearchFilter.EQ
        );
    }

    if (this.consultTasksForm.value.txtDaysAtrasos) {
      isfilterUsed = true;
      this.filterParams
        .getValue()
        .addFilter(
          'backwardness',
          this.consultTasksForm.value.txtDaysAtrasos,
          SearchFilter.BTW
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
        .addFilter('createdDate', inicio + ',' + final, SearchFilter.BTW);
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
    if (typeof this.consultTasksForm.value.txtNoProgramacion == 'number') {
      console.log('txtNoProgramacion');
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
          response.data.map(async (item: any) => {
            item.taskNumber = item.id;
            item.requestId =
              item.requestId != null ? item.requestId : item.programmingId;
          });
          console.log(response);
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
    /*let typeProcess:any = ''
    if(selected.processName == 'DocComplementaria'){
      typeProcess = this.processDocComplementaria(selected);
    }*/
    let obj2Storage = {
      //typeProcess: selected.processName == 'DocComplementaria'? typeProcess : '',
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

  async processDocComplementaria(selected: any) {
    let affair = await this.getRequest(selected.requestId);
    switch (affair) {
      case 33:
        return 'BSRegistroSolicitudes';
        break;

      default:
        return null;
        break;
    }
  }

  getRequest(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.requestServevice.getAll(params).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
      });
    });
  }

  getAsyncTransferent(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.transferentService
        .getAll(params)
        .pipe(
          map(x => {
            return x.data[0];
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp.nameTransferent);
          },
        });
    });
  }

  getTaskRepostBase64(params: ListParams | string) {
    return new Promise((resolve, reject) => {
      this.taskService.downloadReportBase64(params).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }
}
