import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { compareDesc } from 'date-fns';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { MassiveDepositaryService } from 'src/app/core/services/ms-massivedepositary/massivedepositary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { offlinePagination } from 'src/app/utils/functions/offline-pagination';
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

export interface IVariables {
  VCONP: number;
  VCONC: number;
  VCONE: number;
  VCONJ: number;
  VCONA: number;
  T_REG_LEIDOS: number;
  T_REG_PROCESADOS: number;
  T_REG_CORRECTOS: number;
  T_REG_ERRONEOS: number;
  T_REG_CORJUR: number;
  T_REG_CORADM: number;
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
  paginatedData: any[] = [];
  currentItemData: number = 0;
  totalItemsData: number = 0;
  loadingDataProcess: boolean = false;
  errorsData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: ExampleData[] = [];
  origin: string = '';
  no_bien: number = null;
  no_nom: number = null;
  V_BAN: boolean = false;
  countsData: IVariables = {
    VCONP: 0,
    VCONC: 0,
    VCONE: 0,
    VCONJ: 0,
    VCONA: 0,
    T_REG_LEIDOS: 0,
    T_REG_PROCESADOS: 0,
    T_REG_CORRECTOS: 0,
    T_REG_ERRONEOS: 0,
    T_REG_CORJUR: 0,
    T_REG_CORADM: 0,
  };

  form: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private router: Router,
    private massiveService: MassiveDepositaryService,
    private activatedRoute: ActivatedRoute
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

    this.params.subscribe(params => {
      const { page, limit } = params;
      this.paginatedData = offlinePagination(this.data, limit, page);
      console.log(this.paginatedData);
    });
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
    this.loading = true;
    this.massiveService.pupPreviewDataCSVForDepositary(formData).subscribe({
      next: resp => {
        this.loading = false;
        const params = new ListParams();
        this.params.next(params);
        this.totalItems = this.data.length;
        this.onLoadToast(
          'success',
          'La información se ha subido exitosamente.',
          'Exitoso'
        );
      },
      error: eror => {
        this.loading = false;
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
      VALIDADO: 'N',
      VALJUR: 'N',
      VALADM: 'N',
      APLICADO: 'N',
      APLJUR: 'N',
      APLADM: 'N',
    };
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
  validRecords() {
    this.V_BAN = false;
    this.errorsData = [];
    this.countsData = {
      VCONP: 0,
      VCONC: 0,
      VCONE: 0,
      VCONJ: 0,
      VCONA: 0,
      T_REG_LEIDOS: 0,
      T_REG_PROCESADOS: 0,
      T_REG_CORRECTOS: 0,
      T_REG_ERRONEOS: 0,
      T_REG_CORJUR: 0,
      T_REG_CORADM: 0,
    };
    this.data.forEach((element, count) => {
      if (element.APLICADO == 'N') {
        element.VALIDADO = 'N';
        this.V_BAN = true;
      }
      if (element.APLJUR == 'N') {
        element.VALJUR = 'N';
        this.V_BAN = true;
      }
      if (element.APLADM == 'N') {
        element.VALADM = 'N';
        this.V_BAN = true;
      }
      if (element.APLICADO == 'N') {
        this.V_BAN = true;
        let desc = ' (PAGOS) En el registro ' + (count + 1);
        if (element.NO_BIEN == null) {
          this.V_BAN = false;
          desc = desc + ', el número de bien es nulo';
        }
        if (element.FEC_PAGO == null) {
          this.V_BAN = false;
          desc = desc + ', la fecha es nula';
        }
        if (element.FEC_PAGO) {
          let validDate = null;
          validDate = compareDesc(new Date(element.FEC_PAGO), new Date());
          if (validDate < 0) {
            this.V_BAN = false;
            desc = desc + ', la fecha no puede mayor a la fecha actual';
          }
        }
        if (element.CVE_CONCEPTO_PAGO == null) {
          this.V_BAN = false;
          desc = desc + ', el concepto de pago es nuloo';
        }
        if (element.CVE_CONCEPTO_PAGO == null) {
          this.V_BAN = false;
          desc = desc + ', el concepto de pago es nuloo';
        }
        if (element.IMPORTE == 0) {
          this.V_BAN = false;
          desc = desc + ', el importe es cero';
        }
        if (this.V_BAN == false) {
          desc = desc + '.';
          this.countsData.VCONE++;
          this.errorsData.push({ DESCRIPCION: desc }); // Crear error
        }
      }
    });
  }
}
