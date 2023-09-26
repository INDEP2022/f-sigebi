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
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import * as XLSX from 'xlsx';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { IDetailProceedingsDevollutionDelete } from 'src/app/core/models/ms-proceedings/proceedings.model';
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
  title: string = 'Oficios de Autorización de Destrucción';
  textButton: string = 'Cerrar';
  expediente: number;
  textDisabled: boolean = false;
  acta: IProceedingDeliveryReception = null;
  dataFile: any[];
  consult: boolean = false;

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
    private datePipe: DatePipe,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService,
    private proceedingService: ProceedingsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...ASSETS_DESTRUCTION_COLUMLNS },
      mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consult) {
        this.getDetailProceedingsDevolution(this.form.controls.noAuth.value);
      }
    });
  }

  /* expedientChange() {
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
  } */

  getDetailProceedingsDevolution(number: number, expedient: boolean = false) {
    this.loading = true;
    let params: any = {
      ...this.params.getValue(),
      //...this.columnFilters2,
    };
    if (expedient) params['filter.good.fileNumber'] = `$eq:${number}`;
    if (!expedient) params['filter.numberProceedings'] = `$eq:${number}`;
    this.proceedingService.getDetailProceedingsDevolution(params).subscribe({
      next: async response => {
        console.log(response);
        const data = await this.postQuery(response.data);
        this.data.load(data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
        console.log(error);
      },
    });
  }

  expedientChange() {
    this.consult = true;
    this.expediente = Number(this.form.controls.idExpedient.value);
    const params: ListParams = {};
    params['filter.id'] = `$eq:${this.expediente}`;
    this.expedientService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.form.patchValue(resp.data[0]);
        this.relationsExpedient();
      },
      error: err => {
        this.alert(
          'warning',
          this.title,
          'No se encontrarón registros para este expediente',
          ''
        );
      },
    });
    //// buscar en el
  }

  relationsExpedient() {
    //this.getGoods();
    this.loading = false;
    this.proceedingsDetailDel.getProceeding3(this.expediente).subscribe(
      response => {
        console.log(response);
        if (response.data === null) {
          this.alert('info', this.title, 'No se encontrarón registros', '');
          return;
        }
        this.acta = response.data[0];
        this.form.controls.noAuth.setValue(this.acta.id);
        this.form.controls.authNotice.setValue(this.acta.keysProceedings);
        this.form.controls.fromDate.setValue(
          this.datePipe.transform(this.acta.elaborationDate, 'yyyy/MM/dd')
        );
        this.form.controls.universalFolio.setValue(this.acta.universalFolio);
        this.form.controls.act.setValue(this.acta.keysProceedings);
        this.form.controls.statusAct.setValue(this.acta.statusProceedings);
        console.log(this.form.controls.fromDate.value);

        //receive
        // receiptKey clave del que recibe
        const statusAct = this.acta.statusProceedings; //this.form.get('statusAct').value;
        console.error('ESATUS ACTA ' + statusAct);

        if (['CERRADO', 'CERRADA'].includes(statusAct)) {
          this.textDisabled = true;
        } else if (['ABIERTO', 'ABIERTA'].includes(statusAct)) {
          this.textDisabled = false;
        } else if (statusAct === null) {
          this.textDisabled = true;
        }
        this.getDetailProceedingsDevolution(this.form.controls.noAuth.value);
      },
      error => {
        this.alert(
          'error',
          this.title,
          'No se encontraron actas con este numero de expediente'
        );
      }
    );
  }

  async masive() {
    this.loading = true;
    const data: any[] = await this.data.getAll();
    data.forEach(item => {
      if (
        item.di_disponible === 'S' &&
        this.acta.keysProceedings !== null &&
        this.acta.elaborationDate !== null
      ) {
        item.fecha = `${this.acta.keysProceedings} ${this.datePipe.transform(
          this.acta.elaborationDate,
          'dd-MM-yyyy'
        )}`;
        item.aprobado = 'SI';
      } else {
        item.fecha = null;
        item.aprobado = 'NO';
      }
    });
    this.data.load(data);
    this.data.refresh();
    this.loading = false;
  }

  async closed() {
    const detail: any[] = await this.data.getAll();
    if (detail.length === 0) {
      return;
    }
    detail.forEach(async (element: any) => {
      const model: IDetailProceedingsDevollutionDelete = {
        numberGood: element.numberGood,
        numberProceedings: element.numberProceedings,
      };
      await this.pupDepuraDetalle(model);
    });
    this.getDetailProceedingsDevolution(this.form.controls.noAuth.value);
  }

  pupDepuraDetalle(model: IDetailProceedingsDevollutionDelete) {
    return new Promise((resolve, _reject) => {
      this.proceedingService
        .deleteDetailProceedingsDevolution(model)
        .subscribe({
          next: (resp: any) => {
            resolve(true);
          },
          error: (err: any) => {
            resolve(false);
          },
        });
    });
  }

  addGood() {
    if (!['CERRADA', 'CERRADO'].includes(this.acta.statusProceedings)) {
      if (this.expediente) {
        this.getDetailProceedingsDevolution(this.expediente, true);
      } else {
        this.pupBienesrastreador();
      }
    }
  }

  pupBienesrastreador() {
    this.alert('warning', this.title, 'Lllamando a rastreador');
  }

  clean() {
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
  }

  async postQuery(det: any[]) {
    return await Promise.all(
      det.map(async (item: any) => {
        switch (item.good.ubicationType) {
          case 'A':
            item.di_cve_ubicacion = 'ALMACEN';
            item.di_ubicacion1 = `${
              item.good.almacen ? item.good.almacen.ubication : ''
            } LOTE ${item.good.lotNumber ? item.good.lotNumber.id : ''} RACK ${
              item.good.rackNumber
            }`;
            break;
          case 'B':
            item.di_cve_ubicacion = 'BOVEDA';
            item.di_ubicacion1 = `${
              item.good.boveda ? item.good.boveda.ubication : ''
            } GAVETA ${item.good.lotNumber ? item.good.lotNumber.id : ''}`;
            break;
          case 'D':
            item.di_cve_ubicacion = 'DEPOSITARÍA';
            break;
          default:
            item.di_ubicacion1 = 'UBICACIÓN DESCONOCIDA';
            break;
        }
        item.di_disponible = 'N';
        item.aprobado = 'SI';
        item.description = item.good.description;
        item.status = item.good.status;
        item.process = item.good.extDomProcess;
        item.physicalReceptionDate = item.good.physicalReceptionDate;
        item.fecha = item.good.observationss
          ? item.good.observationss
          : `${this.acta.keysProceedings} ${this.datePipe.transform(
              this.acta.elaborationDate,
              'dd-MM-yyyy'
            )}`;
        return item;
      })
    );
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
          this.alert('warning', 'No se encontraron registros', '');
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

  async ReadExcel(event: any) {
    console.log(this.acta.statusProceedings);
    if (!this.acta) {
      this.alert(
        'warning',
        this.title,
        'No se puede realizar la operación, el Acta está cerrada'
      );
      return;
    }
    this.loading = true;
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    const dataTable: any[] = await this.data.getAll();
    fileReader.onload = e => {
      let workbook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workbook.SheetNames;
      this.dataFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      const data = dataTable.concat(this.dataFile);
      this.data.load(data);
      this.data.refresh();
      this.loading = false;
    };
  }
}
