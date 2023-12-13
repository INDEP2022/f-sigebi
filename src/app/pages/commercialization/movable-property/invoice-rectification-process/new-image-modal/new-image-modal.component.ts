import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { ReportInvoiceService } from 'src/app/core/services/ms-reportinvoice/reportinvoice-service';
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
export class NewImageModalComponent implements OnInit {
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  form: FormGroup = new FormGroup({});
  dataJob: any;
  jobNot: any;
  valData: boolean = false;
  year: any;
  imageBase64: string;
  image: File;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private reportInvoiceService: ReportInvoiceService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
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
      image: [null, [Validators.required]],
    });
  }
  async getRegister() {
    let params = new ListParams();
    params['filter.jobNumber'] = `$eq:${this.jobNot}`;
    // params['filter.year'] = `$eq:${this.year}`;
    this.reportInvoiceService.getAll(params).subscribe({
      next: resp => {
        const data = resp.data[0];
        this.form.patchValue({
          name: data.name,
          lastName: data.lastnamePat,
          motherlastName: data.lastnameMat,
          idAuth: data.authorize,
          date: data.date,
          allotment: data.batch,
          siab: data.siabSeveral,
          description: data.descriptionproduction,
          total: data.total,
          cve: data.cveProcess,
          image: data.imagesec,
        });
        this.valData = true;
      },
      error: err => {
        this.valData = false;
      },
    });
  }
  close() {
    this.modalRef.content.callback(this.form.value);
    this.modalRef.hide();
  }

  save() {
    const data = this.form.value;

    let obj = {
      year: new Date().getFullYear(),
      jobNumber: this.jobNot,
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
      imagesec: data.image,
    };

    if (this.valData) {
      this.reportInvoiceService.create(obj).subscribe({
        next: resp => {},
        error: err => {},
      });
    } else {
      this.reportInvoiceService.update(obj).subscribe({
        next: resp => {},
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

  fileUpload(event: any) {
    const reader = new FileReader();
    reader.onload = e => {
      this.imageBase64 = e.target.result as string;
      this.image = this.base64ToFile(e.target.result as string);
    };
    if (event?.target) reader.readAsDataURL(event.target.files[0] as File);
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
}
