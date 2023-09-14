import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { compareDesc } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import {
  IVChecaPost,
  IVChecaPostReport,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IncidentMaintenanceService } from 'src/app/core/services/ms-generalproc/incident-maintenance.service';
import { MassiveDepositaryService } from 'src/app/core/services/ms-massivedepositary/massivedepositary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { offlinePagination } from 'src/app/utils/functions/offline-pagination';
import * as XLSX from 'xlsx';
import { COLUMNS } from './columns';
import { JpDBldcCBulkLoadingDepositoryCargoService } from './jp-d-bldc-c-bulk-loading-depository-cargo.service';

interface ExampleData {
  NO_BIEN: number;
  FEC_PAGO: string;
  IMPORTE: number;
  CVE_CONCEPTO_PAGO: string;
  OBSERVACION: string;
  NO_NOMBRAMIENTO: string;
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
  totalItems2: number = 0;
  ExcelData: any;
  // errorData: any;
  paginatedData: any[] = [];
  paginatedData2: any[] = [];
  currentItemData: number = 0;
  totalItemsData: number = 0;
  loadingDataProcess: boolean = false;
  errorsData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
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
  };

  form: FormGroup = new FormGroup({});
  regRead: number = 0;
  regProcessed: number = 0;
  regCorrect: number = 0;
  regWrong: number = 0;
  regCorjur: number = 0;
  regCoradm: number = 0;
  disableApplyRecords: boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  settings2 = { ...this.settings };
  dataTable: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private router: Router,
    private massiveService: MassiveDepositaryService,
    private activatedRoute: ActivatedRoute,
    private incidentMaintenanceService: IncidentMaintenanceService,
    private svJpDBldcCBulkLoadingDepositoryCargoService: JpDBldcCBulkLoadingDepositoryCargoService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
    this.settings2 = {
      ...this.settings,
      columns: {
        DESCRIPCION: {
          title: 'Descripción',
          sort: false,
        },
      },
    };
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
    this.params2.subscribe(params2 => {
      const { page, limit } = params2;
      this.paginatedData2 = offlinePagination(this.errorsData, limit, page);
      this.dataTable.load(this.paginatedData2);
      this.dataTable.refresh();
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

      // this.data = this.ExcelData.map((data: any) =>
      //   this.setDataTableFromExcel(data)
      // );
    };

    fileReader.onload = () => this.readExcel(fileReader.result);
    this.loadData(formData);
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      // let tempData = this.excelService.getData(binaryExcel);
      // console.log(tempData);
      // this.data = tempData.map((data: any) => this.setDataTableFromExcel(data));
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
        // console.log(resp);
        this.data = resp.data;
        const params = new ListParams();
        this.params.next(params);
        this.totalItems = this.data.length;
        // this.data = tempData.map((data: any) =>
        //   this.setDataTableFromExcel(data)
        // );

        // this.data = this.ExcelData.map((data: any) =>
        //   this.setDataTableFromExcel(data)
        // );
        this.resetCountsAndVariables();
        this.onLoadToast(
          'success',
          'La información se ha cargado exitosamente.',
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
      NO_NOMBRAMIENTO: excelData.NO_NOMBRAMIENTO
        ? excelData.NO_NOMBRAMIENTO
        : null,
    };
  }
  // tmpMistakes(params: ListParams) {
  //   this.incidentMaintenanceService.getTmpErrores(params).subscribe({
  //     next: data => {
  //       //INSERTAR DATA PARA TABLA
  //       console.log(data);
  //       this.errorData = data.data;
  //       this.totalItems = data.count | 0;
  //       this.loading = false;
  //     },
  //     error: error => (this.loading = false),
  //   });
  // }
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
    this.loading = true;
    this.resetCountsAndVariables();
    let VCONP: number = 0;
    let VCONC: number = 0;
    let VCONE: number = 0;
    let VCONJ: number = 0;
    let VCONA: number = 0;
    let V_CHECA: number = 0;
    let V_BAN: boolean = false;
    let ERRTXT: string = '';
    // this.regRead = 0;
    // this.regProcessed = 0;
    // this.regCorrect = 0;
    // this.regWrong = 0;
    // this.regCorjur = 0;
    // this.regCoradm = 0;
    if (this.no_bien != null) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].VALIDADO === 'S' && this.data[i].APLICADO === 'N') {
          //insert
          //success
          let data = {
            appointmentNum: this.data[i].NO_NOMBRAMIENTO,
            datePay: this.data[i].FEC_PAGO,
            conceptPayKey: this.data[i].CVE_CONCEPTO_PAGO,
            amount: this.data[i].IMPORTE,
            observation: this.data[i].OBSERVACION,
          };
          this.svJpDBldcCBulkLoadingDepositoryCargoService
            .postDedPayDepositary(data)
            .subscribe({
              next: resp => {
                this.data[i].APLICADO = 'S';
                VCONC = VCONC + 1;
              },
              error: eror => {
                // this.alert(
                //   'warning',
                //   'Carga masiva de carga de depositarias',
                //   'Error intentelo de nuevo.'
                // );
                //error . ERROR: ${this.cleanErrorText(this.dbmsErrorText)}
                ERRTXT = `(PAGOS) Registro: ${i}. Bien: ${this.no_bien}, Fecha Pago: ${this.data[i].FEC_PAGO}, Clave Pago: ${this.data[i].CVE_CONCEPTO_PAGO}`;
                VCONE = VCONE + 1;
                this.data[i].VALIDADO = 'N';
                this.errorsData.push({ DESCRIPCION: ERRTXT });
                // if (this.errorsData[i].description != null) {
                // } else {
                //   this.errorsData[i].description = ERRTXT;
                // }
              },
            });
        }
        if (this.data[i].VALJUR === 'S' && this.data[i].APLJUR === 'N') {
          //insert
          //success
          let data = {
            appointmentNum: this.data[i].NO_NOMBRAMIENTO,
            dateRepo: this.data[i].FEC_PAGO,
            reportKey: 1,
            report: this.data[i].JURIDICO,
          };
          this.svJpDBldcCBulkLoadingDepositoryCargoService
            .postDetrepoDepositary(data)
            .subscribe({
              next: resp => {
                this.data[i].APLJUR = 'S';
                VCONJ = VCONJ + 1;
              },
              error: eror => {
                //error . ERROR: ${this.cleanErrorText(this.dbmsErrorText)}
                ERRTXT = `(JURIDICO) Registro: ${i}. Bien: ${this.no_bien}, Fecha Pago: ${this.data[i].FEC_PAGO}, Clave Pago: ${this.data[i].CVE_CONCEPTO_PAGO}`;
                this.data[i].VALJUR = 'N';
                this.errorsData.push({ DESCRIPCION: ERRTXT });
                // if (this.errorsData[i].description != null) {
                //   //CREATE_RECORD;
                // }
              },
            });
        }
        //insert
        let data = {
          appointmentNum: this.data[i].NO_NOMBRAMIENTO,
          dateRepo: this.data[i].FEC_PAGO,
          reportKey: 2,
          report: this.data[i].ADMINISTRA,
        };
        this.svJpDBldcCBulkLoadingDepositoryCargoService
          .postDetrepoDepositary(data)
          .subscribe({
            next: resp => {
              //error . ERROR: ${this.cleanErrorText(this.dbmsErrorText)}
              ERRTXT = `(ADMINISTRATIVO) Registro: ${i}. Bien: ${this.no_bien}, Fecha Pago: ${this.data[i].FEC_PAGO}, Clave Pago: ${this.data[i].CVE_CONCEPTO_PAGO}`;
              this.data[i].VALADM = 'N';
              this.errorsData.push({ DESCRIPCION: ERRTXT });
              // if (this.errorsData[i].description != null) {
              //   //CREATE_RECORD;
              // }
            },
          });
      }
    }
    this.regRead = VCONP;
    this.regProcessed = VCONC + VCONE;
    this.regCorrect = VCONC;
    this.regWrong = VCONE;
    this.regCorjur = VCONJ;
    this.regCoradm = VCONA;
    this.disableApplyRecords = false;
    // console.log(this.errorsData);
    // this.dataTable.load(this.errorsData);
    // this.dataTable.refresh();
    this.paginatedData2 = offlinePagination(
      this.errorsData,
      this.params2.value.limit,
      this.params2.value.page
    );
    this.dataTable.load(this.paginatedData2);
    this.dataTable.refresh();
    this.loading = false;
    setTimeout(() => {
      this.alert('success', 'Proceso terminado', '');
    }, 500);
  }
  resetCountsAndVariables() {
    this.V_BAN = false;
    this.errorsData = [];
    this.countsData = {
      VCONP: 0,
      VCONC: 0,
      VCONE: 0,
      VCONJ: 0,
      VCONA: 0,
    };
    this.regRead = 0;
    this.regProcessed = 0;
    this.regCorrect = 0;
    this.regWrong = 0;
    this.regCorjur = 0;
    this.regCoradm = 0;
    this.paginatedData2 = offlinePagination(
      this.errorsData,
      this.params2.value.limit,
      this.params2.value.page
    );
    this.dataTable.load(this.paginatedData2);
    this.dataTable.refresh();
  }
  validRecords() {
    this.loading = true;
    this.resetCountsAndVariables();
    // this.V_BAN = false;
    // this.errorsData = [];
    // this.countsData = {
    //   VCONP: 0,
    //   VCONC: 0,
    //   VCONE: 0,
    //   VCONJ: 0,
    //   VCONA: 0,
    // };
    // this.regRead = 0;
    // this.regProcessed = 0;
    // this.regCorrect = 0;
    // this.regWrong = 0;
    // this.regCorjur = 0;
    // this.regCoradm = 0;
    // console.log('DATA TABLA ', this.data);
    this.data.forEach(element => {
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
    });
    setTimeout(() => {
      if (this.V_BAN == true) {
        this.loopValidPays(0);
      }
    }, 500);
  }

  loopValidPays(count: number) {
    let desc: string = '';
    if (this.data[count].APLICADO == 'N') {
      this.V_BAN = true;
      desc = desc + ' (PAGOS) En el registro ' + (count + 1);
      if (this.data[count].NO_BIEN == null) {
        this.V_BAN = false;
        desc = desc + ', el número de bien es nulo';
      }
      if (this.data[count].FEC_PAGO == null) {
        this.V_BAN = false;
        desc = desc + ', la fecha es nula';
      }
      if (this.data[count].FEC_PAGO) {
        let validDate = null;
        validDate = compareDesc(
          new Date(this.data[count].FEC_PAGO),
          new Date()
        );
        // console.log(
        //   'FECHAS ################# ',
        //   validDate,
        //   new Date(this.data[count].FEC_PAGO)
        // );
        if (validDate < 0) {
          this.V_BAN = false;
          desc = desc + ', la fecha no puede ser mayor a la fecha actual';
        }
      }
      if (this.data[count].CVE_CONCEPTO_PAGO == null) {
        this.V_BAN = false;
        desc = desc + ', el concepto de pago es nuloo';
      }
      if (this.data[count].CVE_CONCEPTO_PAGO == null) {
        this.V_BAN = false;
        desc = desc + ', el concepto de pago es nuloo';
      }
      if (this.data[count].IMPORTE == 0) {
        this.V_BAN = false;
        desc = desc + ', el importe es cero';
      }
      if (this.V_BAN == false) {
        desc = desc + '.';
        this.countsData.VCONE++;
        // console.log('DESC ######### ', desc);
        this.errorsData.push({ DESCRIPCION: desc }); // Crear error
        this.validJuridical(count);
      } else {
        this.getAppointmentNumber(count, desc);
      }
    }
  }
  getAppointmentNumber(count: number, desc: string, option: string = 'pays') {
    this.svJpDBldcCBulkLoadingDepositoryCargoService
      .getAppointmentNumber_PBAplica(this.data[count].NO_BIEN)
      .subscribe({
        next: async data => {
          // console.log(data, data.data[0].no_nombramiento);
          this.data[count].NO_NOMBRAMIENTO = data.data[0].no_nombramiento;
          if (option == 'pays') {
            this.getVCheca(count, desc);
          } else if (option == 'juridico') {
            this.getVChecaPostReport(count, desc, 'juridico');
          } else if (option == 'admin') {
            this.getVChecaPostReport(count, desc, 'admin');
          }
        },
        error: err => {
          this.V_BAN = false;
          console.log(option);
          let labelText: string = '';
          if (option == 'pays') {
            labelText = 'PAGOS';
            this.countsData.VCONE++;
          } else if (option == 'juridico') {
            labelText = 'JURIDICO';
          } else if (option == 'admin') {
            labelText = 'ADMINISTRATIVO';
          }
          desc =
            desc +
            '(' +
            labelText +
            ') Bien: ' +
            this.data[count].NO_BIEN +
            '. No existe en Depositaría.';
          // console.log('DESC ######### ', desc);
          this.errorsData.push({ DESCRIPCION: desc }); // Crear error
          if (option == 'pays') {
            this.validJuridical(count);
          } else if (option == 'juridico') {
            this.validAdmin(count);
          } else if (option == 'admin') {
            this.continueLoop(count);
          }
        },
      });
  }
  getVCheca(count: number, desc: string) {
    this.svJpDBldcCBulkLoadingDepositoryCargoService
      .getVCheca(Number(this.data[count].CVE_CONCEPTO_PAGO))
      .subscribe({
        next: async data => {
          // console.log(data);
          // this.data[count].NO_NOMBRAMIENTO = data.data[0].no_nombramiento;
          this.getVChecaPost(count, desc);
        },
        error: err => {
          this.V_BAN = false;
          desc =
            desc +
            '(PAGOS) Bien: ' +
            this.data[count].NO_BIEN +
            ', Clave Pago: ' +
            this.data[count].CVE_CONCEPTO_PAGO +
            '. Clave de Concepto de Pago inválido.';
          this.countsData.VCONE++;
          // console.log('DESC ######### ', desc);
          this.errorsData.push({ DESCRIPCION: desc }); // Crear error
          this.validJuridical(count);
        },
      });
  }
  getVChecaPost(count: number, desc: string) {
    let body: IVChecaPost = {
      appointmentNumber: Number(this.data[count].NO_NOMBRAMIENTO),
      payDate: new Date(this.data[count].FEC_PAGO), //"2009-05-14",
      conceptPayKey: Number(this.data[count].CVE_CONCEPTO_PAGO),
    };
    this.svJpDBldcCBulkLoadingDepositoryCargoService
      .getVChecaPost(body)
      .subscribe({
        next: async data => {
          // this.data[count].NO_NOMBRAMIENTO = data.data[0].v_checa.toString();
          this.V_BAN = false;
          desc =
            desc +
            '(PAGOS) Bien: ' +
            this.data[count].NO_BIEN +
            ', Fecha Pago: ' +
            this.datePipe.transform(
              new Date(this.data[count].FEC_PAGO),
              this.dateFormat
            ) +
            ', Clave Pago: ' +
            this.data[count].CVE_CONCEPTO_PAGO +
            '. El pago ya fué aplicado.';
          this.countsData.VCONE++;
          // console.log('DESC ######### ', desc);
          this.errorsData.push({ DESCRIPCION: desc }); // Crear error
          this.validJuridical(count);
        },
        error: err => {
          if (err.status == 400) {
            // Termino proceso correcto
            this.countsData.VCONC++;
            this.data[count].VALIDADO = 'S';
            this.validJuridical(count);
          } else {
            this.V_BAN = false;
            desc =
              desc +
              '(PAGOS) Bien: ' +
              this.data[count].NO_BIEN +
              ', Fecha Pago: ' +
              this.datePipe.transform(
                new Date(this.data[count].FEC_PAGO),
                this.dateFormat
              ) +
              ', Clave Pago: ' +
              this.data[count].CVE_CONCEPTO_PAGO +
              '. Error al verificar el pago.';
            this.countsData.VCONE++;
            // console.log('DESC ######### ', desc);
            this.errorsData.push({ DESCRIPCION: desc }); // Crear error
            this.validJuridical(count);
          }
        },
      });
  }

  getVChecaPostReport(
    count: number,
    desc: string,
    option: string = 'juridico'
  ) {
    let body: IVChecaPostReport = {
      appointmentNumber: Number(this.data[count].NO_NOMBRAMIENTO),
      payDate: new Date(this.data[count].FEC_PAGO), //"2009-05-14",
      reportKey: option == 'juridico' ? 1 : 2,
    };
    this.svJpDBldcCBulkLoadingDepositoryCargoService
      .getVChecaPostReport(body)
      .subscribe({
        next: async data => {
          // this.data[count].NO_NOMBRAMIENTO = data.data[0].v_checa.toString();
          this.V_BAN = false;
          desc =
            desc +
            '(JURIDICO) Bien: ' +
            this.data[count].NO_BIEN +
            ', Fecha Reporte: ' +
            this.datePipe.transform(
              new Date(this.data[count].FEC_PAGO),
              this.dateFormat
            ) +
            '. El reporte ya fué ingresado.';
          // this.countsData.VCONE++;
          // console.log('DESC ######### ', desc);
          this.errorsData.push({ DESCRIPCION: desc }); // Crear error

          if (option == 'pays') {
            this.validJuridical(count);
          } else if (option == 'juridico') {
            this.validAdmin(count);
          } else if (option == 'admin') {
            this.continueLoop(count);
          }
        },
        error: err => {
          if (err.status == 400) {
            // Termino proceso correcto
            if (option == 'juridico') {
              this.countsData.VCONJ++;
              this.data[count].VALJUR = 'S';
              this.validAdmin(count);
            } else {
              this.countsData.VCONA++;
              this.data[count].VALADM = 'S';
              this.continueLoop(count);
            }
          } else {
            this.V_BAN = false;
            desc =
              desc +
              '(JURIDICO) Bien: ' +
              this.data[count].NO_BIEN +
              ', Fecha Reporte: ' +
              this.datePipe.transform(
                new Date(this.data[count].FEC_PAGO),
                this.dateFormat
              ) +
              '. Error al verificar el reporte.';
            // this.countsData.VCONE++;
            // console.log('DESC ######### ', desc);
            this.errorsData.push({ DESCRIPCION: desc }); // Crear error

            if (option == 'pays') {
              this.validJuridical(count);
            } else if (option == 'juridico') {
              this.validAdmin(count);
            } else if (option == 'admin') {
              this.continueLoop(count);
            }
          }
        },
      });
  }

  validJuridical(count: number) {
    let desc: string = '';
    if (this.data[count].APLJUR == 'N') {
      this.V_BAN = true;
      desc = desc + '(JURIDICO) En el registro ' + (count + 1);
      if (this.data[count].NO_BIEN == null) {
        this.V_BAN = false;
        desc = desc + ', el número de bien es nulo';
      }
      if (this.data[count].FEC_PAGO == null) {
        this.V_BAN = false;
        desc = desc + ', la fecha es nula';
      }
      if (this.V_BAN == false) {
        desc = desc + '.';
        this.countsData.VCONE++;
        // console.log('DESC ######### ', desc);
        this.errorsData.push({ DESCRIPCION: desc }); // Crear error
        this.validAdmin(count);
      } else {
        this.getAppointmentNumber(count, desc, 'juridico');
      }
    }
  }

  validAdmin(count: number) {
    let desc: string = '';
    if (this.data[count].APLADM == 'N') {
      this.V_BAN = true;
      desc = desc + ' (ADMINISTRATIVO) En el registro ' + (count + 1);
      if (this.data[count].NO_BIEN == null) {
        this.V_BAN = false;
        desc = desc + ', el número de bien es nulo';
      }
      if (this.data[count].FEC_PAGO == null) {
        this.V_BAN = false;
        desc = desc + ', la fecha es nula';
      }
      if (this.V_BAN == false) {
        desc = desc + '.';
        this.countsData.VCONE++;
        // console.log('DESC ######### ', desc);
        this.errorsData.push({ DESCRIPCION: desc }); // Crear error
        this.continueLoop(count);
      } else {
        this.getAppointmentNumber(count, desc, 'admin');
      }
    }
  }

  continueLoop(count: number) {
    this.countsData.VCONP++;
    count = count + 1;
    // console.log(count);
    if (this.data[count]) {
      this.loopValidPays(count);
    } else {
      this.totalItems2 = this.errorsData.length;
      // console.log(this.errorsData);
      // this.dataTable.load(this.errorsData);
      // this.dataTable.refresh();
      this.loading = false;
      this.paginatedData2 = offlinePagination(
        this.errorsData,
        this.params2.value.limit,
        this.params2.value.page
      );
      this.dataTable.load(this.paginatedData2);
      this.dataTable.refresh();
      // this.countsData.T_REG_LEIDOS = this.countsData.VCONP;
      // this.countsData.T_REG_PROCESADOS =
      //   this.countsData.VCONC + this.countsData.VCONE;
      // this.countsData.T_REG_CORRECTOS = this.countsData.VCONC;
      // this.countsData.T_REG_ERRONEOS = this.countsData.VCONE;
      // this.countsData.T_REG_CORJUR = this.countsData.VCONJ;
      // this.countsData.T_REG_CORADM = this.countsData.VCONA;
      this.regRead = this.countsData.VCONP;
      this.regProcessed = this.countsData.VCONC + this.countsData.VCONE;
      this.regCorrect = this.countsData.VCONC;
      this.regWrong = this.countsData.VCONE;
      this.regCorjur = this.countsData.VCONJ;
      this.regCoradm = this.countsData.VCONA;
      if (this.regCorrect > 0 || this.regCorjur > 0 || this.regCoradm > 0) {
        this.disableApplyRecords = true; // Enable button
      }
      setTimeout(() => {
        this.alert('success', 'Proceso de validación terminado', '');
      }, 500);
    }
  }
}
