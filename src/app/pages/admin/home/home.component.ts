import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AppState } from './../../../app.reducers';
import { EXCEL_TO_JSON_COLUMNS } from './constants/excel-to-json-columns';
import { JSON_TO_CSV } from './constants/json-to-csv';
import { ExampleModalComponent } from './example-modal.component';

interface IExcelToJson {
  id: number;
  utf8: string;
  column1: string;
  column2: number;
  column3: string;
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
  jsonToCsv = JSON_TO_CSV;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private excelService: ExcelService,
    private store: Store<AppState>
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXCEL_TO_JSON_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.store.select('count').subscribe({
      next: data => {
        this.counter = data;
      },
      error: err => {
        console.error(err);
      },
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
  }
  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-sm', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(ExampleModalComponent, config);
  }
  chargeFile(event: any) {
    console.log(event.files);
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
  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
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
      console.log(this.data);
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
}
