import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ASSETS_DESTRUCTION_COLUMLNS } from './authorization-assets-destruction-columns';
//XLSX
import { DatePipe } from '@angular/common';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import * as XLSX from 'xlsx';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthorizationAssetsDestructionForm } from '../utils/authorization-assets-destruction-form';

@Component({
  selector: 'app-authorization-assets-destruction',
  templateUrl: './authorization-assets-destruction.component.html',
  styleUrls: ['./authorization-assets-destruction.scss'],
})
export class AuthorizationAssetsDestructionComponent
  extends BasePage
  implements OnInit
{
  form = new FormGroup(new AuthorizationAssetsDestructionForm());
  show = false;
  ExcelData: any;
  table: boolean = false;
  idExpedient: string | number = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  expedient: IExpedient;
  data: LocalDataSource = new LocalDataSource();
  selectExpedient = new DefaultSelect<IExpedient>();
  rowSelected: boolean = false;
  selectedRow: any = null;

  goodsList: IGood[] = [];

  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  get controls() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...ASSETS_DESTRUCTION_COLUMLNS },
      mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.status === 'RGA') {
          return 'text-success';
        } else {
          return 'text-danger';
        }
      },
    };
  }

  ngOnInit(): void {}

  expedientChange() {
    const expedientId = this.controls.idExpedient.value;
    if (!expedientId) {
      return;
    }
    this.findExpedientById(expedientId).subscribe({
      next: expedient => {
        this.form.patchValue(expedient);
      },
      error: error => {
        if (error.status <= 500) {
          this.onLoadToast('error', 'Error', 'No se encontró el expediente');
          this.form.reset();
        }
      },
    });
  }

  findExpedientById(expedientId: number) {
    return this.expedientService.getById(expedientId);
  }

  getExpedients(params: ListParams) {
    const _params = new FilterParams();
    _params.page = params.page;
    _params.limit = params.limit;
    _params.addFilter('id', params.text);
    this.expedientService.getAll(_params.getParams()).subscribe({
      next: response => {
        this.selectExpedient = new DefaultSelect(response.data, response.count);
        this.getExpedientById();
      },
      error: () => {
        this.selectExpedient = new DefaultSelect();
      },
    });
  }

  getExpedientById(): void {
    let _id = this.idExpedient;
    this.loading = true;
    this.expedientService.getById(_id).subscribe(
      response => {
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getGoodsByExpedient(this.idExpedient);
          console.log(response);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getGoodsByExpedient(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(id));
  }

  getGoods(id: string | number): void {
    this.goodService.getByExpedient(id, this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.goodsList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  msjRequest() {
    this.alertQuestion(
      'question',
      'Atención',
      '¿Desea imprimir la solicitud de digitalización?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Listo', 'Se ha solicitado');
      }
    });
  }

  msjScan() {
    this.alertQuestion(
      'info',
      'Atención',
      'Para escanear debe de abrir la aplicación de su preferencia'
    );
  }

  openPrevImg() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.imagenurl),
          type: 'img',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      // this.data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.data);
    };
  }
}
