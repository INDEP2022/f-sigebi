import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';
import {
  FileUploadEvent,
  FILE_UPLOAD_STATUSES,
} from 'src/app/utils/file-upload/interfaces/file-event';
import { AppState } from './../../../app.reducers';
import { IFormGroup } from './../../../core/interfaces/model-form';
import { EXCEL_TO_JSON_COLUMNS } from './constants/excel-to-json-columns';
import { JSON_TO_CSV } from './constants/json-to-csv';
import { ExampleModalComponent } from './example-modal.component';
import { HomeService } from './home.service';
/*Redux NgRX Global Vars Service*/
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { IGlobalVars } from '../../../shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from '../../../shared/global-vars/services/global-vars.service';
import { ListDataComponent } from './list-data/list-data.component';
import { BASIC_BUTTONS } from './utils/basic-buttons';

interface IExcelToJson {
  id: number;
  utf8: string;
  column1: string;
  column2: number;
  column3: string;
}

interface IPerson {
  name: string;
  birthdate: Date | any;
}

interface IUser {
  username: string;
  person: IPerson;
  roles: IRole[];
  currency: string;
}

interface IRole {
  role: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent extends BasePage implements OnInit {
  counter: number = 0;
  data: IExcelToJson[] = [];
  formExample: FormGroup;
  userExample: IFormGroup<IUser>;
  user: IUser;
  jsonToCsv = JSON_TO_CSV;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';
  parentModal: BsModalRef;
  /*Redux NgRX Global Vars Model*/
  globalVars: IGlobalVars;
  buttons = BASIC_BUTTONS;

  // ----------- PAGINACION
  params = new BehaviorSubject(new ListParams());

  filterParams = new BehaviorSubject(new FilterParams());

  totalItems = 0;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private excelService: ExcelService,
    private store: Store<AppState>,
    private homeService: HomeService,
    private globalVarsService: GlobalVarsService,
    private sanitized: DomSanitizer,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXCEL_TO_JSON_COLUMNS,
    };
  }

  getElement(html: string) {
    return this.sanitized.bypassSecurityTrustHtml(html);
  }

  testFiles(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    if (index) {
      this.uploadFile(fileEvents[index]);
    } else {
      fileEvents.forEach(fileEvent => {
        this.uploadFile(fileEvent);
      });
    }
  }

  retryUpload(index: number) {
    // this.filesEvent[index];
  }

  uploadFile(fileEvent: FileUploadEvent) {
    fileEvent.status = FILE_UPLOAD_STATUSES.LOADING;
    this.homeService.uploadFiles(fileEvent.file).subscribe({
      next: response => {
        if (response.type === HttpEventType.UploadProgress) {
          fileEvent.progress = Math.round(
            (100 * response.loaded) / response.total
          );
        }
      },
      error: error => {
        fileEvent.status = FILE_UPLOAD_STATUSES.FAILED;
      },
      complete: () => {
        fileEvent.status = FILE_UPLOAD_STATUSES.SUCCESS;
      },
    });
  }

  token: TokenInfoModel;
  ngOnInit(): void {
    this.token = this.authService.decodeToken();

    console.log('Información del usuario logeado: ', this.token);
    this.prepareForm();
    this.store.select('count').subscribe({
      next: data => {
        this.counter = data;
      },
      error: err => {
        console.error(err);
      },
    });

    this.getGlobalVars();
  }

  /*Redux NgRX Global Vars Get Initial State*/
  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
      });
  }

  private prepareForm() {
    this.formExample = this.fb.group({
      input: [null, [Validators.required]],
      textarea: [null, [Validators.required]],
      select: [null, [Validators.required]],
      radio: ['dog'],
      check: [false],
    });
    this.userExample = this.fb.group({
      person: this.personForm,
      roles: this.fb.array([this.roleForm]),
      username: [''],
      currency: [null, []],
    });
  }

  get personForm(): IFormGroup<IPerson> {
    return this.fb.group({
      name: [null],
      birthdate: [new Date()],
    });
  }

  get roleForm(): IFormGroup<IRole> {
    return this.fb.group({
      role: [null],
    });
  }

  get roles(): FormArray {
    return this.userExample.get('roles') as FormArray;
  }

  addRole() {
    this.roles.push(this.roleForm);
  }

  removeRole(index: number) {
    this.roles.removeAt(index);
  }

  saveRole() {
    this.user = this.userExample.getRawValue();
  }

  deleteAlert() {
    this.alertQuestion('warning', 'Eliminar', '¿Desea Eliminar este registro?');
  }

  questionAlert() {
    this.alertQuestion('question', '¿Quiere Continuar con el Proceso?', '');
  }
  errorAlert() {
    this.alert('error', 'Error', 'Descripción del Error');
  }

  warningAlert() {
    this.alert('warning', 'No se Encontraron Bienes', '');
  }

  successAlert() {
    this.alert('success', 'El Registro se ha Guardado', '');
  }
  openModal() {
    let config: ModalOptions = {
      initialState: {
        parentModal: 'Modal Padre',
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-sm', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.parentModal = this.modalService.show(ExampleModalComponent, config);
  }

  chargeFile(event: any) {}

  openPrevImg() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.imagenurl),
          type: 'img',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<IExcelToJson>(binaryExcel);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  exportXlsx() {
    const filename: string = 'Nombre del archivo';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(this.jsonToCsv, { filename });
  }

  exportCsv() {
    const filename: string = 'Nombre del archivo';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  newStateGlobalVars(option: string) {
    let newState = { ...this.globalVars };

    switch (option) {
      case 'allP':
        /*All Object*/
        newState = {
          RAST_BIEN: 'NEW RAST_BIEN',
          RAST_BIEN_REL: 'NEW RAST_BIEN_REL',
          NO_EXPEDIENTE: 'NEW NO_EXPDEDIENTE',
          RAST_EXPEDIENTE_REL: 'NEW RAST_EXPEDIENTE_REL',
          CREA_EXPEDIENTE: 'NEW CREA_EXPEDIENTE',
          RAST_EXPEDIENTE: 'NEW RAST_EXPEDIENTE',
          RAST_DESCRIPCION_BIEN: 'NEW RAST_DESCRIPCION_BIEN',
          RAST_TIPO: 'NEW RAST_TIPO',
          gNoExpediente: null,
          noVolante: null,
          bn: null,
          gCreaExpediente: null,
          gstMensajeGuarda: null,
          gnuActivaGestion: 1,
          antecede: null,
          pSatTipoExp: null,
          pIndicadorSat: null,
          gLastCheck: null,
          vTipoTramite: null,
          gCommit: null,
          gOFFCommit: null,
          noTransferente: null,
          gNoVolante: null,
          varDic: null,
          bienes_foto: 0,
          EXPEDIENTE: null,
          TIPO_DIC: null,
          VOLANTE: null,
          CONSULTA: null,
          TIPO_VO: null,
          P_GEST_OK: null,
          P_NO_TRAMITE: null,
          IMP_OF: null,
          REL_BIENES: null,
        };

        this.globalVarsService.updateGlobalVars(newState);

        break;
      case 'oneP':
        /*OR ONLY ONE PROPERTY*/
        newState = {
          ...this.globalVars,
          RAST_BIEN_REL: 'ONLY ONE PROPERTY RAST_BIEN_REL',
        };

        this.globalVarsService.updateGlobalVars(newState);

        break;
      case 'reset':
        this.globalVarsService.resetGlobalVars();
        break;
      default:
        newState = { ...this.globalVars };
        this.globalVarsService.updateGlobalVars(newState);
        break;
    }
  }

  showData() {
    //descomentar si usan FilterParams ejemplo de consulta
    //this.filterParams.getValue().addFilter('id', 3429640, SearchFilter.EQ)
    //this.filterParams.getValue().addFilter('keyTypeDocument', 'ENTRE', SearchFilter.ILIKE)

    //ejemplo de uso con ListParams
    //this.params.getValue()['filter.id'] = '$eq:3429640'

    let config: ModalOptions = {
      initialState: {
        //filtros
        paramsList: this.params,
        filterParams: this.filterParams, // en caso de no usar FilterParams no enviar
        callback: (next: boolean, data: any /*Modelado de datos*/) => {
          if (next) {
            //mostrar datos de la búsqueda
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListDataComponent, config);
  }
}
