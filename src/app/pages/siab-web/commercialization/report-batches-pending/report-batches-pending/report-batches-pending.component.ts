import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, forkJoin, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  CAPTURE_LINES,
  CAPTURE_LINES_CLIENTS,
} from './report-batches-pending-colums';

@Component({
  selector: 'app-report-batches-pending',
  templateUrl: './report-batches-pending.component.html',
  styles: [],
})
export class reportBatchesPendingComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  show: boolean = false;
  evento = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  line: any[] = [];
  totalItems: number = 0;
  totalItems1: number = 0;
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  selectdata: any = [];
  selecteddata: any[] = [];
  private isFirstLoad = true;

  settings2;
  constructor(
    private fb: FormBuilder,
    private event: CapturelineService,
    private lotService: LotService,
    private customerService: CustomerService,
    private excelService: ExcelService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CAPTURE_LINES },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...CAPTURE_LINES_CLIENTS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvent(new ListParams());

    this.params1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.lineaCaptura();
      }
    });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.aceptar();
      }
    });
    this.isFirstLoad = false;
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
    });
  }
  getEvent(params: ListParams) {
    const val = this.form.get('event').value;
    console.log(val);
    if (val === null) {
      if (params['search']) {
        params['eventId'] = params['search'];
      } else {
        delete params['eventId'];
      }
    } else {
      params['eventId'] = val;
    }
    console.log(params);

    this.event.getAllAdminCaptureLine(params).subscribe({
      next: resp => {
        this.evento = new DefaultSelect(resp.data, resp.count);
        console.log(this.evento);
      },
    });
  }

  lineaCaptura() {
    this.loading = true;
    this.line = [];
    let params = {
      ...this.params1.getValue(),
    };
    this.lotService.querysp(this.form.get('event').value, params).subscribe({
      next: resp => {
        console.log(resp);
        this.line = resp.data;
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems1 = resp.count;
        this.loading = false;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  selectData(event: { data: any; selected: any }) {
    // this.selectedGooods = event.selected;
    console.log('AQUI SELECT', event);
    this.selectdata = [];
    this.selectdata.push(event.data);
    console.log('this.selectdata', this.selectdata);
  }

  aceptar() {
    if (this.selectdata.length === 0) {
      this.alert(
        'warning',
        'Debe Seleccionar un Registro en la tabla LÍNEAS DE CAPTURA DE CLIENTES',
        ''
      );
    }
    const selectedData = this.selectdata[0]; // Acceder al primer elemento del arreglo
    selectedData.id_evento;
    console.log(selectedData.id_evento);

    const payload = {
      eventId: selectedData.id_evento,
      lotId: selectedData.id_lote,
      lotsId: '',
    };
    let params = {
      ...this.params.getValue(),
    };
    this.customerService.getguarantee(payload, params).subscribe({
      next: resp => {
        console.log(resp);
        this.line = resp.data;
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.alert('warning', 'No se Encontraron Registros', '');
      },
    });

    console.log(payload);
  }

  exportXlsx() {
    const filename: string = 'Lotes Pendientes de Pagos';

    // Hacer una copia de this.params1 si es necesario
    let params = { ...this.params1.getValue() };

    const selectedData = this.selectdata[0]; // Acceder al primer elemento del arreglo

    if (!selectedData) {
      this.alert(
        'warning',
        'No existen datos en la tabla de LÍNEAS DE CAPTURA DEL CLIENTE PARA EL LOTE PÚBLICO',
        ''
      );
      return;
    }

    const payload = {
      eventId: selectedData.id_evento,
      lotId: selectedData.id_lote,
      lotsId: '',
    };

    this.customerService.getguarantee(payload, params).subscribe({
      next: resp => {
        const allData = resp.data;

        // Si hay más páginas de datos, recuperarlas
        const totalPages = Math.ceil(resp.count / params.pageSize);
        const additionalRequests = [];

        for (let page = 2; page <= totalPages; page++) {
          params.page = page;
          additionalRequests.push(
            this.customerService.getguarantee(payload, params)
          );
        }

        // Combinar todos los registros en this.line
        forkJoin(additionalRequests).subscribe({
          next: additionalResponses => {
            for (const additionalResp of additionalResponses) {
              allData.push(...additionalResp.data);
            }

            this.excelService.export(allData, { filename });
          },
          error: err => {
            console.log(err);
          },
        });
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
