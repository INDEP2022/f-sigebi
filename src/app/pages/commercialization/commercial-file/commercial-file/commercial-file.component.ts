import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-commercial-file',
  templateUrl: './commercial-file.component.html',
  styles: [],
})
export class CommercialFileComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  loading2 = this.loading;
  loading3 = this.loading;
  loadingText: string;
  viewPhoto: boolean = false;
  disabled: boolean = false;
  goodNumber: number;
  @Input() statusActaValue: string;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noGood: [null, [Validators.required]],
    });
  }

  fcom() {
    this.loading = true;
    let params = {
      Lst_path_report: this.form.controls['noGood'].value,
    };
    this.goodNumber = this.form.controls['noGood'].value;
    this.viewPhoto = true;
    this.downloadReport('blank', params);
  }

  ftec() {
    this.loading2 = true;
    let params = {
      Lst_path_report: this.form.controls['noGood'].value,
    };
    this.downloadReport('blank', params);
  }

  fie() {
    this.loading3 = true;
    let params = {
      Lst_path_report: this.form.controls['noGood'].value,
    };
    this.downloadReport('blank', params);
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando Reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
        this.loading2 = false;
        this.loading3 = false;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  clean() {
    window.scrollTo(0, 0);
    this.viewPhoto = false;
  }
  cleanBtn() {
    this.form.reset();
  }
}

/* 
private async getData() {
    this.files = [];
    // debugger;
    // this.lastConsecutive = 1;
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async response => {
          if (response) {
            console.log(response);
            // debugger;
            if (response) {
              this.files = [...response];
              // const index = last.indexOf('F');
              // this.lastConsecutive += +last.substring(index + 1, index + 5);
              const pufValidaUsuario = await this.pufValidaUsuario();
              if (pufValidaUsuario === 1) {
                this.errorMessage = null;
              } else {
                const noActa = await this.pufValidaProcesoBien();
                if (noActa) {
                  this.errorMessage =
                    'No tiene permisos de escritura debio a que el bien ya fue recibido por el acta ' +
                    noActa +
                    ' y esta se encuentra cerrada';
                  console.log(this.errorMessage);
                } else {
                  this.errorMessage = null;
                }
              }
            }
          }
        },
      });
  }

*/
