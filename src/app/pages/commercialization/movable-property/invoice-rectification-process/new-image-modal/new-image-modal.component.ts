import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { ReportInvoiceService } from 'src/app/core/services/ms-reportinvoice/reportinvoice-service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-new-image-modal',
  templateUrl: './new-image-modal.component.html',
  styles: [
    `
      .file-add {
        background: #acadad;
        border-radius: 11px;
        cursor: pointer;
        border: 0px;
        padding: 50px;
        width: 225px;
        height: 150px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        position: relative;
      }

      .cancel-btn {
        cursor: pointer;
        position: absolute;
        color: #000000;
        top: 3px;
        right: -74px;
        z-index: 1;
      }

      .cancel-btn:active {
        color: #494949;
      }

      .cancel-btn:hover {
        color: #353232;
      }
    `,
  ],
})
export class NewImageModalComponent extends BasePage implements OnInit {
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  form: FormGroup = new FormGroup({});
  dataJob: any;
  jobNot: any;
  valData: boolean = false;
  year: any;
  imageBase64: string;
  image: File;
  image_: any = null;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private reportInvoiceService: ReportInvoiceService,
    private authService: AuthService,
    private fileBrowserService: FileBrowserService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log('dataJob', this.dataJob);

    this.getRegister();
  }

  private prepareForm() {
    this.form = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      lastName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      motherlastName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      idAuth: ['', [Validators.required]],
      date: [null, [maxDate(new Date()), Validators.required]],
      allotment: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      siab: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      total: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(1),
          // Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      cve: [null, [Validators.required]],
      image: [null],
    });
  }
  async getRegister() {
    let params = new ListParams();
    params['filter.jobNumber'] = `$eq:${this.dataJob.jobNot}`;
    params['filter.year'] = `$eq:${this.dataJob.year}`;
    this.loading = true;
    this.reportInvoiceService.getAll(params).subscribe({
      next: resp => {
        const data = resp.data[0];
        data.date = data.date ? data.date.split('-').reverse().join('/') : null;
        this.form.patchValue(data);
        this.form.patchValue({
          name: data.name,
          lastName: data.lastnamePat,
          motherlastName: data.lastnameMat,
          idAuth: data.authorize,
          allotment: data.batch,
          siab: data.siabSeveral,
          description: data.descriptionproduction,
          total: data.total,
          cve: data.cveProcess,
          image: data.imagesec,
        });
        this.valData = true;
        this.getImage();
      },
      error: err => {
        this.valData = false;
        this.loading = false;
      },
    });
  }
  async getImage() {
    let body = {
      userPassword: this.authService
        .decodeToken()
        .preferred_username.toUpperCase(),
      jobNumber: this.dataJob.jobNot,
      year: this.dataJob.year,
    };
    this.fileBrowserService.getRouteBillingAllBillingSiab(body).subscribe({
      next: async resp => {
        let image = resp.data[0];

        this.getImageBase64(image);
      },
      error: err => {
        this.loading = false;
        // this.alert('error', 'No se pudo generar la imagen', '');
      },
    });
  }

  async getImageBase64(body: any) {
    this.fileBrowserService.getRouteBillingBillingSiab(body).subscribe({
      next: async resp => {
        let base64 = resp;
        this.imageBase64 = 'data:image/png;base64,' + base64;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        // this.alert('error', 'No se pudo generar la imagen', '');
      },
    });
  }
  close() {
    this.modalRef.content.callback(this.form.value);
    this.modalRef.hide();
  }

  save() {
    const data = this.form.value;
    data.date =
      typeof data.date == 'string'
        ? data.date.split('/').reverse().join('-')
        : this.datePipe.transform(data.date, 'yyyy-MM-dd');
    let obj = {
      year: this.dataJob.year,
      jobNumber: this.dataJob.jobNot,
      name: data.name,
      lastnameMat: data.motherlastName,
      lastnamePat: data.lastName,
      authorize: data.idAuth,
      date: data.date,
      batch: data.allotment,
      siabSeveral: data.siab,
      descriptionproduction: data.description,
      total: data.total,
      cveProcess: data.cve,
      imagesec: new Date().getTime(),
    };

    this.saveData(obj);
  }

  async saveImage(formData: FormData) {
    this.fileBrowserService.getRouteBillingSavebillingSiab(formData).subscribe({
      next: async value => {
        this.alert('success', 'Se generó correctamente la imagen', '');
      },
      error: err => {
        this.alert('error', 'No se pudo generar la imagen', '');
      },
    });
  }

  async saveData(obj: any) {
    const formData = new FormData();
    formData.append(
      'userPassword',
      this.authService.decodeToken().preferred_username.toUpperCase()
    );
    formData.append('jobNumber', this.dataJob.jobNot);
    formData.append('year', this.dataJob.year);
    formData.append('file', this.image_);

    if (!this.valData) {
      this.reportInvoiceService.create(obj).subscribe({
        next: resp => {
          this.saveImage(formData);
        },
        error: err => {},
      });
    } else {
      this.reportInvoiceService.update(obj).subscribe({
        next: resp => {
          this.saveImage(formData);
        },
        error: err => {},
      });
    }
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

  base64ToFile(base64: string): File {
    const [datatype, data] = base64.split(',');
    const mime = datatype.match(/:(.*?);/)[1];
    const filename = `${+new Date()}${mime.replace(/\/+/, '.')}`;
    const bstr = atob(data);

    const u8arr = new Uint8Array(bstr.length);
    let n = bstr.length;
    while (n--) u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], filename, { type: mime });
  }
  cleanPhoto() {
    this.imageBase64 = null;
    this.image = null;
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1)
      return console.log('No files selected, or more than of allowed');
    this.fileUpload(event);
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = e => {
      // this.imageBase64 = e.target.result as string;
      // this.image = this.base64ToFile(e.target.result as string);
      this.image_ = files[0];

      // this.readExcel(files[0])};
    };
  }

  fileUpload(event: any) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1)
      return console.log('No files selected, or more than of allowed');
    const reader = new FileReader();
    reader.onload = e => {
      this.imageBase64 = e.target.result as string;
      this.image = this.base64ToFile(e.target.result as string);
    };
    if (event?.target) {
      reader.readAsDataURL(event.target.files[0] as File);
      this.image = event.target.files[0];
      this.image_ = files[0];
      console.log('this.image', this.image_);
    }
  }
}
