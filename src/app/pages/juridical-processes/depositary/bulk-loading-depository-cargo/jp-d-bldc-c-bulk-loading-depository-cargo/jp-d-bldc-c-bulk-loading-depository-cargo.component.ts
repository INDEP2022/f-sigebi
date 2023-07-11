import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IncidentMaintenanceService } from 'src/app/core/services/ms-generalproc/incident-maintenance.service';
import { MassiveDepositaryService } from 'src/app/core/services/ms-massivedepositary/massivedepositary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import * as XLSX from 'xlsx';
import { COLUMNS } from './columns';

interface ExampleData {
  NO_BIEN: number;
  FEC_PAGO: string;
  IMPORTE: number;
  CVE_CONCEPTO_PAGO: string;
  OBSERVACION: string;
  JURIDICO: string;
  ADMINISTRA: string;
  VALIDADO: string;
  VALJUR: string;
  VALADM: string;
  APLICADO: string;
  APLJUR: string;
  APLADM: string;
}

@Component({
  selector: 'app-jp-d-bldc-c-bulk-loading-depository-cargo',
  templateUrl: './jp-d-bldc-c-bulk-loading-depository-cargo.component.html',
  styles: [],
})
export class JpDBldcCBulkLoadingDepositoryCargoComponent
  extends BasePage
  implements OnInit
{
  assetsForm: FormGroup;
  fileName: string = 'Seleccionar archivo';
  totalItems: number = 0;
  ExcelData: any;
  errorData: any;
  currentItemData: number = 0;
  totalItemsData: number = 0;
  loadingDataProcess: boolean = false;
  errorsData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: ExampleData[];
  origin: string = '';
  no_bien: number = null;
  no_nom: number = null;

  form: FormGroup = new FormGroup({});
  regRead: number = 0;
  regProcessed: number = 0;
  regCorrect: number = 0;
  regWrong: number = 0;
  regCorjur: number = 0;
  regCoradm: number = 0;
  disableApplyRecords: boolean = true;
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private router: Router,
    private massiveService: MassiveDepositaryService,
    private activatedRoute: ActivatedRoute,
    private incidentMaintenanceService: IncidentMaintenanceService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        this.origin = params['origin'] ?? null;
        if (this.origin == 'FACTJURREGDESTLEG') {
          this.no_bien = params['no_bien'] ?? null;
          this.no_nom = params['p_nom'] ?? null;
        }
        console.log(params);
      });
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      status: [null, [Validators.required]],
      observation: [null, [Validators.required]],
      csv: [null, [Validators.required]],
    });
  }

  onFileChange(event: any) {
    const formData = new FormData();
    let file = event.target.files[0];
    formData.append('file', file);
    const fileReader = new FileReader();

    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });

      var buffer = new Buffer(fileReader.result.toString());
      var string = buffer.toString('base64');

      var sheetNames = workbook.SheetNames;

      this.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

      console.log('this.ExcelData =>>>>  ', this.ExcelData);

      this.data = [];

      this.data = this.ExcelData.map((data: any) =>
        this.setDataTableFromExcel(data)
      );
    };

    fileReader.onload = () => this.readExcel(fileReader.result);
    this.loadData(formData);
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData(binaryExcel);
      // this.onLoadToast('success', 'Archivo subido con Exito', 'Exitoso');
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  loadData(formData: FormData) {
    this.massiveService.pupPreviewDataCSVForDepositary(formData).subscribe({
      next: resp => {
        this.onLoadToast(
          'success',
          'La información se ha subido exitosamente.',
          'Exitoso'
        );
      },
      error: eror => {
        this.onLoadToast('error', 'Error', eror.error.message);
      },
    });
  }

  setDataTableFromExcel(excelData: ExampleData) {
    return {
      NO_BIEN: excelData.NO_BIEN,
      FEC_PAGO: excelData.FEC_PAGO,
      IMPORTE: excelData.IMPORTE,
      CVE_CONCEPTO_PAGO: excelData.CVE_CONCEPTO_PAGO,
      OBSERVACION: excelData.OBSERVACION,
      JURIDICO: excelData.JURIDICO,
      ADMINISTRA: excelData.ADMINISTRA,
    };
  }
  tmpMistakes(params: ListParams) {
    this.incidentMaintenanceService.getTmpErrores(params).subscribe({
      next: data => {
        //INSERTAR DATA PARA TABLA
        console.log(data);
        this.errorData = data.data;
        this.totalItems = data.count | 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  goBack() {
    if (this.origin == 'FACTJURREGDESTLEG') {
      this.router.navigate(
        ['/pages/juridical/depositary/depositary-record/' + this.no_bien],
        {
          queryParams: {
            p_nom: this.no_nom,
          },
        }
      );
    } else {
      this.alert(
        'warning',
        'La página de origen no tiene opción para regresar a la pantalla anterior',
        ''
      );
    }
  }
  applyRecords() {
    let VCONP: number = 0;
    let VCONC: number = 0;
    let VCONE: number = 0;
    let VCONJ: number = 0;
    let VCONA: number = 0;
    let V_CHECA: number = 0;
    let V_BAN: boolean = false;
    let ERRTXT: string = '';
    if (this.no_bien != null) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].VALIDADO === 'S' && this.data[i].APLICADO === 'N') {
          //insert
          //success
          this.data[i].APLICADO = 'S';
          VCONC = VCONC + 1;
          //error . ERROR: ${this.cleanErrorText(this.dbmsErrorText)}
          ERRTXT = `(PAGOS) Registro: ${i}. Bien: ${this.no_bien}, Fecha Pago: ${this.data[i].FEC_PAGO}, Clave Pago: ${this.data[i].CVE_CONCEPTO_PAGO}`;
          VCONE = VCONE + 1;
          this.data[i].VALIDADO = 'N';
          if (this.errorData[i].description != null) {
          } else {
            this.errorData[i].description = ERRTXT;
          }
        }
        if (this.data[i].VALJUR === 'S' && this.data[i].APLJUR === 'N') {
          //insert
          //success
          this.data[i].APLJUR = 'S';
          VCONJ = VCONJ + 1;
          //error . ERROR: ${this.cleanErrorText(this.dbmsErrorText)}
          ERRTXT = `(JURIDICO) Registro: ${i}. Bien: ${this.no_bien}, Fecha Pago: ${this.data[i].FEC_PAGO}, Clave Pago: ${this.data[i].CVE_CONCEPTO_PAGO}`;
          this.data[i].VALJUR = 'N';
          if (this.errorData[i].description != null) {
            //CREATE_RECORD;
          } else {
            this.errorData[i].description = ERRTXT;
          }
        }
        if (this.data[i].VALADM === 'S' && this.data[i].APLADM === 'N') {
          //insert
          //success
          this.data[i].APLADM = 'S';
          VCONA = VCONA + 1;
          //error . ERROR: ${this.cleanErrorText(this.dbmsErrorText)}
          ERRTXT = `(ADMINISTRATIVO) Registro: ${i}. Bien: ${this.no_bien}, Fecha Pago: ${this.data[i].FEC_PAGO}, Clave Pago: ${this.data[i].CVE_CONCEPTO_PAGO}`;
          this.data[i].VALADM = 'N';
          if (this.errorData[i].description != null) {
            //CREATE_RECORD;
          } else {
            this.errorData[i].description = ERRTXT;
          }
        }
        VCONP = VCONP + 1;
      }
      this.regRead = VCONP;
      this.regProcessed = VCONC + VCONE;
      this.regCorrect = VCONC;
      this.regWrong = VCONE;
      this.regCorjur = VCONJ;
      this.regCoradm = VCONA;
      this.disableApplyRecords = false;
    }
  }
}
