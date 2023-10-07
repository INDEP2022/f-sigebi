import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsModalService,
  ModalDirective,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { DetRelationConfiscationService } from 'src/app/core/services/ms-confiscation/det-relation-confiscation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  DATA_BY,
  DATA_BY_MULTIPLE,
  EXCEL_TO_JSON,
} from 'src/app/pages/admin/home/constants/excel-to-json-columns';
import { JSON_TO_CSV_FRELDECOMISO } from 'src/app/pages/admin/home/constants/json-to-csv';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

declare var $: any;
interface IExcelToJson {
  idD: number;
  id: number;
  f_trnas: string;
  f_sent: string;
  Inte: number;
  f_teso: string;
  o_teso: string;
}

interface IExcelToJson {
  idD: number;
  id: number;
  f_trnas: string;
  f_sent: string;
  Inte: number;
  f_teso: string;
  o_teso: string;
}

@Component({
  selector: 'app-confiscation-ratio',
  templateUrl: './confiscation-ratio.component.html',
  styles: [],
})
export class ConfiscationRatioComponent extends BasePage implements OnInit {
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  form: FormGroup;
  file: FormGroup;
  formaplicationData: FormGroup;
  settings1: any = [];
  settings2: any = [];
  dataOnly: any = [];
  dataOnly2: any = [];
  goodIds: any = [];
  Only: FormGroup;
  jsonToCsv = JSON_TO_CSV_FRELDECOMISO;
  dataExcel: any = [];
  data: FormGroup[];
  totalItems: number = 0;
  totalItems1: number = 0;
  lock: boolean = false;
  until: boolean = false;
  unt: boolean = false;
  binaryExcel: string | ArrayBuffer;
  currentPage = 1;
  pageSize = 10;
  loading2: boolean = false;
  flag: number = 0;
  paginatedData: any[] = [];
  fileReader = new FileReader();
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  filterParams = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  source: LocalDataSource = new LocalDataSource();
  dato: LocalDataSource = new LocalDataSource();
  sourceby: LocalDataSource = new LocalDataSource();
  goods: DefaultSelect<IGood>;
  columnFilters: any = [];
  dataTemplate = this.fb.group({
    noGood: [null, Validators.required],
    criminalCase: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.required],
    ],
    preliminaryInvestigation: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.required],
    ],
    dateTesofe: [null, Validators.required],
    jobTesofe: [null, Validators.required],
    authority: [null, Validators.required],
    dateTreasury: [null, Validators.required],
    dateJudgment: [null, Validators.required],
    appraisalValue: [null, Validators.required],
    interests: [null, Validators.required],
    results: [null, Validators.required],
    totalSeizures: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private report: SiabService,
    private goodServ: GoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private screenStatusService: ScreenStatusService,
    private detRelationConfiscationService: DetRelationConfiscationService,
    private goodProcessService: GoodProcessService,
    private authorityService: AuthorityService,
    private excelService: ExcelService,
    private readonly goodServices: GoodService,
    private accountMovementService: AccountMovementService,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXCEL_TO_JSON,
    };
    this.settings1 = {
      ...this.settings1,
      actions: false,
      columns: DATA_BY,
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: DATA_BY_MULTIPLE,
    };
  }
  token: TokenInfoModel;
  ngOnInit(): void {
    this.prepareForm();
    this.token = this.authService.decodeToken();
    this.dataIdentifier();
    this.buildFormaplicationData();
    // this.getGood(new ListParams)
    // this.filterParams.getValue().addFilter('description', '', SearchFilter.ILIKE)
    // this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: () => this.getGood()
    // })
  }
  //const user = this.user.decodeToken();
  //toolbarUser: user.username.toUpperCase(),
  prepareForm() {
    this.form = this.fb.group({
      forfeitureKey: [null, [Validators.required]],
      check: [null],
      import: [null],
      pgr: [null],
      ssa: [null],
      pjf: [null],
      totalAmount: [null],
    });
    this.file = this.fb.group({
      recordRead: [null],
      recordsProcessed: [null],
      processed: [null],
      wrong: [null],
    });
    this.data = [this.dataTemplate];
    this.Only = this.fb.group({
      nobien: [null],
      radio: [''],
    });
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

  getGood(params: ListParams) {
    const field = `filter.goodDescription`;
    params['sortBy'] = 'goodDescription:ASC';
    if (params.text !== '' && params.text !== null) {
      this.columnFilters[field] = `${SearchFilter.ILIKE}:${params.text}`;
      delete params.text;
      delete params['search'];
    } else {
      delete this.columnFilters[field];
    }
    let paramsValue = { ...params, ...this.columnFilters };
    this.goodServ.getAll(paramsValue).subscribe({
      next: resp => {
        this.goods = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  public callReport() {
    const forfeitureKey = this.form.get('forfeitureKey').value;

    if (forfeitureKey === null) {
      console.log(forfeitureKey);
      this.alert('warning', 'Es necesario contar con la Cve. Decomiso', '');
    } else {
      const params = {
        P_Clave_Decomiso: forfeitureKey,
      };

      this.report.fetchReport('RRELDECOMISO', params).subscribe({
        next: response => {
          console.log(response);

          // Check if the response is not empty and not a placeholder response
          if (response.byteLength > 975) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            this.alert(
              'warning',
              'La Cve. Decomiso no existe para generar el reporte',
              ''
            );

            // Additional actions for handling the case when the key does not exist
          }
        },
        error: err => {
          this.alert(
            'warning',
            'La Cve. Decomiso no existe para generar el reporte',
            ''
          );

          // Additional actions for handling the case when the key does not exist
        },
      });
    }
  }

  initialize() {
    //p_Trae('Consecutivo');
  }

  brings() {}

  onFileChange(event: Event) {
    try {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length !== 1) {
        throw new Error('Please select one file.');
      }

      const selectedFile = files[0];
      console.log(selectedFile.name);

      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'csv') {
        this.alert('warning', 'El Archivo debe Tener la Extensión CSV.', '');
        return;
      }

      const expectedFilename = 'FRELDECOMISO.csv';
      if (selectedFile.name !== expectedFilename) {
        this.alert('warning', 'El Nombre del Archivo no es Correcto', '');
        return;
      }

      // Limpia cualquier evento onload anterior
      this.fileReader.onload = null;

      // Asigna el evento onload para manejar la lectura del archivo
      this.fileReader.onload = loadEvent => {
        if (loadEvent.target && loadEvent.target.result) {
          // Llama a la función para procesar el archivo
          this.readExcel(loadEvent.target.result);

          // Limpia el input de archivo para permitir cargar el mismo archivo nuevamente
          (event.target as HTMLInputElement).value = '';
        }
      };

      // Lee el contenido binario del archivo
      this.fileReader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData(binaryExcel);
      const mappedData: any = [];
      for (let i = 0; i < this.dataExcel.length; i++) {
        mappedData.push({
          id: this.dataExcel[i].no_bien,
          f_trnas: this.dataExcel[i].fec_transferencia,
          f_sent: this.dataExcel[i].fec_sentencia,
          Inte: this.dataExcel[i].intereses,
          f_teso: this.dataExcel[i].fec_of_tesofe,
          o_teso: this.dataExcel[i].oficio_tesofe,
          aut: this.dataExcel[i].autoridad,
          causa_penal: this.dataExcel[i].causa_penal,
        });
      }
      console.log(mappedData);
      this.source.load(mappedData);
      this.unt = true;
      this.source.refresh();
      this.totalItems = this.dataExcel.length;
      this.file.get('recordRead').patchValue(this.totalItems);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  exportCsv() {
    const filename: string = 'FRELDECOMISO';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  async aprove() {
    if (this.dataExcel.length === 0) {
      this.alert('warning', 'Se debe importar el archivo excel', '');
      return;
    }

    if (this.form.get('forfeitureKey').value === null) {
      this.alert('warning', 'Se debe ingresar la Cve Decomiso', '');
      return;
    }

    if (this.Only.get('radio').value === null) {
      this.alert('warning', 'Se debe seleccionar un tipo de modena', '');
      return;
    }

    const user = this.authService.decodeToken();
    const clave = this.form.get('forfeitureKey').value;
    const moneda = this.Only.get('radio').value;
    const useri = user.username.toUpperCase();
    this.dataExcel.map((item: any) => {
      item['screenkey'] = 'FRELDECOMISO';
      item['toolbar_user'] = useri;
      item['clave_decom'] = clave;
      item['money'] = moneda;
    });

    let insertBody = {
      data: this.dataExcel,
    };

    // Crear un arreglo para almacenar los números de bien duplicados
    const duplicateNumbers = [];
    const correctMoney = [];
    const mon: any = [];
    const data1: any = [];
    const data2: any = [];
    for (let i = 0; i < this.dataExcel.length; i++) {
      data1.push([this.dataExcel[i].no_bien]);
      const data = this.dataExcel[i].no_bien;
      // mon.push([this.dataExcel[i].money]);

      let body = {
        goodNumber: data,
      };
      try {
        const resp = await this.detRelationConfiscationService
          .getById(body)
          .toPromise();

        // Verificar si el número de bien ya existe en la respuesta
        if (resp || resp['exists']) {
          duplicateNumbers.push(data); // Agregar el número de bien duplicado al arreglo
        }
      } catch (err) {}
    }

    for (let i = 0; i < this.dataExcel.length; i++) {
      data2.push([this.dataExcel[i].no_bien]);
      const dat = this.dataExcel[i].no_bien;

      // mon.push([this.dataExcel[i].money]);

      let dato = {
        screenkey: 'FRELDECOMISO',
        no_bien: dat,
        money: this.Only.get('radio').value,
      };
      try {
        const resp = await this.detRelationConfiscationService
          .money(dato)
          .toPromise();

        // Verificar si el número de bien ya existe en la respuesta
      } catch (err: any) {
        console.log(err);
        if (err.status === 400) {
          correctMoney.push(dat); // Agregar el número de bien duplicado al arreglo
        }
      }
    }

    // console.log(mon);

    // if (!mon.includes(1424) && !mon.includes(1426) && !mon.includes(1590)) {
    //   this.alert('warning', 'El Tipo de Moneda es Inválida', '');
    //   return;
    // }

    // Si se encontraron números de bien duplicados, mostrar la alerta y detener el proceso

    // Si no se encontraron números de bien duplicados, continuar con la inserción

    let insertResp;

    try {
      insertResp = await this.detRelationConfiscationService
        .Insert(insertBody)
        .toPromise();

      this.file.get('recordsProcessed').patchValue(insertResp['total']);
      this.file.get('processed').patchValue(insertResp['sucess']);
      this.file.get('wrong').patchValue(insertResp['error']);
      if (this.file.get('processed').value > 0) {
        this.alert('success', 'Registros Aprobados', '');
      }
    } catch (err) {
      // Verificar si err es de tipo HttpErrorResponse
      if (err instanceof HttpErrorResponse) {
        if (
          err.status === 500 ||
          (err.error && err.error.includes('column "undefined" does not exist'))
        ) {
          this.alert(
            'warning',
            'Archivo sin Información',
            'Asegúrese de Subir el Archivo Correcto'
          );
        } else {
          this.alert('error', 'Error desconocido.', '');
        }
      } else {
        this.alert('error', 'Error desconocido.', '');
      }
    }
    if (duplicateNumbers.length > 0) {
      this.alert(
        'warning',
        'El No. Bien que Intenta Ingresar ya Existe',
        duplicateNumbers.join(', ')
      );
      this.file.get('wrong').patchValue(insertResp['error']);
      this.file.get('processed').patchValue('0');
      this.file.get('recordsProcessed').patchValue(insertResp['total']);
      return;
    }

    if (correctMoney.length > 0) {
      this.alert(
        'warning',
        'Moneda incorrecta para los bienes:',
        correctMoney.join(', ')
      );
      this.file.get('wrong').patchValue(insertResp['error']);
      this.file.get('processed').patchValue('0');
      this.file.get('recordsProcessed').patchValue(insertResp['total']);
      return;
    }
  }

  getGoodFilter(money: number | string, goodNumber: number | string) {
    let body = {
      vcScreen: 'FRELDECOMISO',
      coinArray: money,
      goodNumber: goodNumber,
    };
    this.goodProcessService.getGoodAppraise(body).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getValidGood(goodNumber: number | string) {
    if (goodNumber) {
      this.params.getValue()['filter.goodNumber'] = goodNumber;
    }
    let params = {
      ...this.params.getValue(),
    };
    this.detRelationConfiscationService.getAllDetRel(params).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getConsecutive(year?: number | string) {
    this.detRelationConfiscationService.getAllMaxNoRelDec(year).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }
  openFile(): void {
    const forfeitureKey = this.form.get('forfeitureKey').value;

    const filter = new FilterParams();
    filter.addFilter('confiscationKey', forfeitureKey, SearchFilter.EQ);

    this.detRelationConfiscationService
      .getAllMore(filter.getParams())
      .subscribe({
        next: resp => {
          const data = resp.data[0];
          this.form.get('import').patchValue(data.amountDlls);
          this.form.get('pgr').patchValue(data.pgr);
          this.form.get('ssa').patchValue(data.ssa);
          this.form.get('pjf').patchValue(data.pjf);
          this.form.get('totalAmount').patchValue(data.totalAmount);
        },
        error: err => {
          const forfeitureKey = this.form.get('forfeitureKey').value;
          if (!forfeitureKey) {
            this.alert('warning', 'Ingrese Cve. Decomiso', '');
            return;
          }

          if (
            err.status === 400 ||
            err.message.includes('No se encontrarón registros')
          ) {
            this.alert('warning', 'No se encontraron registros', '');
            return;
          }
        },
      });
  }
  cleanFilter() {
    this.form.get('import').setValue(null);
    this.form.get('pgr').setValue(null);
    this.form.get('ssa').setValue(null);
    this.form.get('pjf').setValue(null);
    this.form.get('totalAmount').setValue(null);
    this.form.get('forfeitureKey').setValue(null);
    this.dataIdentifier();
  }
  clean() {
    this.file.get('recordsProcessed').setValue(null);
    this.file.get('processed').setValue(null);
    this.file.get('wrong').setValue(null);
    this.file.get('recordRead').setValue(null);
    this.source.reset();
    this.dataExcel = [];
    this.unt = false;
    this.source.load(this.dataExcel);
  }

  cleanOnly() {
    this.Only.get('radio').setValue(null);
    this.Only.get('nobien').setValue(null);
    this.until = false;
    this.dato.reset();
    this.file.get('recordsProcessed').setValue(null);
    this.file.get('processed').setValue(null);
    this.file.get('wrong').setValue(null);
    this.file.get('recordRead').setValue(null);
  }

  onlyGood() {
    console.log(this.Only.get('radio').value);
    console.log(this.form.get('forfeitureKey').value);
  }

  validateMoney() {
    if (this.Only.get('radio').value === null) {
      this.alert('warning', 'Se debe seleccionar un tipo de modena', '');
      return;
    }

    if (this.Only.get('nobien').value === null) {
      this.alert('warning', 'Debe ingresar el No. Bien.', '');
      return;
    }
    const bien = this.Only.get('nobien').value.join(',');
    let params = {
      ...this.params.getValue(),
    };

    params['filter.goodId'] = `$in:${this.Only.get('nobien').value}`;
    params['filter.goodClassNumber'] = `$eq:${this.Only.get('radio').value}`;
    let showAlert = true;
    let alerta = true;
    const mon: any = [];
    this.goodServices.getByExpedientAndParams_(params).subscribe({
      next: resp => {
        for (let i = 0; i < resp.data.length; i++) {
          if (resp.data[i].status === 'NET' || resp.data[i].status === 'PEA') {
            const dat = resp.data[i].goodId;
            console.log(resp.data[i].goodId);
            mon.push(dat);
            alerta = false;
          }
        }
        console.log(alerta);
        if (alerta === false) {
          this.alert(
            'warning',
            'El estatus del Bien no es válido',
            mon.join(', ')
          );
        } else {
          this.only();
        }
      },
      error: err => {
        this.alert('warning', 'El clasificador del Bien no es válido', '');
        showAlert = false;
        return;
      },
    });
    console.log(this.flag);
  }

  validateStatus() {
    let params = {
      ...this.params.getValue(),
    };

    params['filter.goodId'] = `$in:${this.Only.get('nobien').value}`;
    let showAlert = true;

    this.goodServices.getByExpedientAndParams_(params).subscribe({
      next: resp => {
        for (let i = 0; i < resp.data.length; i++) {
          if (resp.data[i].status === 'NET') {
            this.alert('warning', 'El estatus del Bien no es válido', '');
            showAlert = false;
            return;
          }
        }
      },
      error: err => {},
    });
  }

  only() {
    this.loading2 = true;
    console.log(this.Only.get('radio').value);
    console.log(this.form.get('forfeitureKey').value);
    console.log(this.Only.get('nobien').value);

    // Obtener el valor de this.form.get('forfeitureKey').value
    const forfeitureKeyValue = this.form.get('forfeitureKey').value;

    if (this.Only.get('radio').value === null) {
      this.alert('warning', 'Se debe seleccionar un tipo de modena', '');
      return;
    }

    if (this.Only.get('nobien').value === null) {
      this.alert('warning', 'Debe ingresar el No. Bien.', '');
      return;
    }
    // Actualizar el objeto DATA_BY con el nuevo valor
    const customData = {
      idD: forfeitureKeyValue,
    };

    let params = {
      ...this.params.getValue(),
    };

    params['filter.goodId'] = `$in:${this.Only.get('nobien').value}`;
    console.log(params);
    //this.
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.dataOnly2 = resp.data;
        this.dato.load(resp.data);
        this.until = true;
        this.loading2 = false;
        // Declarar un array para almacenar los valores
        for (let i = 0; i < this.dataOnly2.length; i++) {
          const value = this.dataOnly2[i].goodId;
          const fechaOriginal = this.dataOnly2[i].judicialDate;
          const fechaFormateada = new Date(fechaOriginal).toLocaleDateString(
            'es-ES'
          );
          console.log(fechaFormateada);
          console.log(value);
          this.goodIds.push({
            money: this.dataOnly2[i].goodClassNumber,
            no_bien: this.dataOnly2[i].goodId,
            fec_transferencia: fechaFormateada,
            fec_sentencia: this.dataOnly2[i].judicialLeaveDate,
            intereses: this.dataOnly2[i].quantityy,
            fec_of_tesofe: this.dataOnly2[i].tesofeDate,
            causa_penal: this.dataOnly2[i].expediente.preliminaryInquiry,
            autoridad: this.dataOnly2[i].expediente.authorityNumber,
            oficio_tesofe: this.dataOnly2[i].tesofeFolio,
          }); // Almacena el valor en el array
        }

        // Imprime todos los valores almacenados en el array
        console.log(this.goodIds);
      },
      error: (err: any) => {
        console.log(err);
        this.loading2 = false;
        this.alert('warning', 'No se encontraron registros', '');
      },
    });
  }

  dataIdentifier() {
    let params = {
      ...this.params.getValue(),
    };
    this.detRelationConfiscationService.getId(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.form.controls['forfeitureKey'].setValue(resp.identifier);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  async aproveOnly() {
    if (this.form.get('forfeitureKey').value === null) {
      this.alert('warning', 'Se debe ingresar la Cve Decomiso', '');
      return;
    }

    if (this.Only.get('radio').value === null) {
      this.alert('warning', 'Se debe seleccionar un tipo de modena', '');
      return;
    }

    if (this.Only.get('nobien').value === null) {
      this.alert('warning', 'Debe ingresar el No. Bien.', '');
      return;
    }

    const array: any = [];
    const user = this.authService.decodeToken();
    const clave = this.form.get('forfeitureKey').value;
    const useri = user.username.toUpperCase();

    this.goodIds.map((item: any) => {
      item['screenkey'] = 'FRELDECOMISO';
      item['toolbar_user'] = useri;
      item['clave_decom'] = clave;
    });

    let insertBody = {
      data: this.goodIds,
    };

    console.log(insertBody);

    const duplicateNumbers = [];
    const mon: any = [];
    const data1: any = [];
    for (let i = 0; i < this.dataOnly2.length; i++) {
      data1.push([this.goodIds]);
      const data = this.goodIds[i].no_bien;
      // mon.push([this.dataExcel[i].money]);

      let body = {
        goodNumber: data,
      };
      console.log(body);

      try {
        const resp = await this.detRelationConfiscationService
          .getById(body)
          .toPromise();
        console.log(resp);

        // Verificar si el número de bien ya existe en la respuesta
        if (resp || resp['exists']) {
          duplicateNumbers.push(data); // Agregar el número de bien duplicado al arreglo
          console.log(duplicateNumbers);
        }
      } catch (err) {}
    }

    let insertResp;
    try {
      insertResp = await this.detRelationConfiscationService
        .Insert(insertBody)
        .toPromise();
      this.file.get('recordRead').patchValue(this.dataOnly2.length);
      this.file.get('recordsProcessed').patchValue(insertResp['total']);
      this.file.get('processed').patchValue(insertResp['sucess']);
      this.file.get('wrong').patchValue(insertResp['error']);
      if (this.file.get('processed').value > 0) {
        this.alert('success', 'Registro Aprobado', '');
      }
    } catch (err) {
      // Verificar si err es de tipo HttpErrorResponse
    }
    if (duplicateNumbers.length > 0) {
      this.alert(
        'warning',
        'El No. Bien que Intenta Ingresar ya Existe',
        duplicateNumbers.join(', ')
      );
      this.file.get('wrong').patchValue(insertResp['error']);
      this.file.get('processed').patchValue('0');
      this.file.get('recordsProcessed').patchValue(insertResp['total']);
      return;
    }
    if (this.file.get('wrong').value > 0) {
      this.alert('error', 'Error desconocido.', '');
    }
  }

  async buildFormaplicationData() {
    this.formaplicationData = this.fb.group({
      NoBien: [null],
      f_trnas: [null],
      f_sent: [null],
      Inte: [null],
      tesofeDate: [null],
      tesofeFolio: [null],
      appraisalCurrencyKey: [null],
      aut: [null],
      expedientecriminalCase: [null],
    });
    // this.formaplicationData.controls['postUserRequestCamnum'].disable();
    // this.formaplicationData.controls['delegationRequestcamnum'].disable();
    // this.formaplicationData.controls['authorizeDelegation'].disable();
    // this.formaplicationData.controls['authorizePostUser'].disable();
    // this.formaplicationData.controls['authorizeDate'].disable();
    // this.formaplicationData.controls['dateRequestChangeNumerary'].disable();

    // const paramsSender = new ListParams();
    // paramsSender.text = this.token.decodeToken().preferred_username;
    // await this.get___Senders(paramsSender);

    this.formaplicationData.controls;
  }
}
