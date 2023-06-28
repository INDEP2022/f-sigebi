import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGetSigned } from 'src/app/core/models/ms-dictation/dictation-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { Ssf3SignatureElecDocsService } from 'src/app/core/services/ms-electronicfirm/ms-ssf3-signature-elec-docs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ELECTRONICSIGNATURE_COLUMNS } from './electronic-signature-columns';

@Component({
  selector: 'app-electronic-signature',
  templateUrl: './electronic-signature.component.html',
  styles: [],
})
export class ElectronicSignatureComponent extends BasePage implements OnInit {
  data1: IGetSigned[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  electronicSignatureForm: ModelForm<any>;
  dictaminationSelect: IGetSigned;
  enableSend: boolean = false;
  loadingText: string = '';
  get userAuth() {
    return this.authService.decodeToken().preferred_username;
  }
  constructor(
    private fb: FormBuilder,
    private readonly ssf3SignatureElecDocsService: Ssf3SignatureElecDocsService,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private dictationService: DictationService
  ) {
    super();
    this.settings.hideSubHeader = false;
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ELECTRONICSIGNATURE_COLUMNS,
    };
  }
  ngOnInit(): void {
    this.prepareForm();
    this.electronicSignatureForm.disable();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDictamen());
  }
  private prepareForm() {
    this.electronicSignatureForm = this.fb.group({
      no_expediente: [null],
      no_volante: [null],
    });
  }

  getDictamen() {
    this.loading = true;
    this.dictationService.getSigned(this.params.getValue()).subscribe({
      next: resp => {
        this.data1 = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Ha ocurrido un error',
          'Error al obtener la lista de dictáminaciones'
        );
      },
    });
  }

  change(event: any) {
    console.log(event);
    this.enableSend = false;
    this.dictaminationSelect = event;
    this.electronicSignatureForm
      .get('no_expediente')
      .patchValue(event.no_expediente);
    this.electronicSignatureForm.get('no_volante').patchValue(event.no_volante);
  }

  async print() {
    if (this.dictaminationSelect === undefined) {
      this.alert(
        'info',
        'Información',
        'Debe seleccionar un registro de la tabla'
      );
      return;
    }
    const n_COUNT: number = 0; //await this.ssf3SignatureElecDocsCount(0,'');
    if (n_COUNT > 0) {
      this.PUP_CONSULTA_PDF_BD_SSF3();
    } else if (n_COUNT === 0) {
      const n_COUNT: number = await this.dictaminaCount(
        this.dictaminationSelect.no_of_dicta,
        this.dictaminationSelect.estatus_of
      );
      console.log(n_COUNT);
      if (n_COUNT > 0) {
        /// mandar a llamar al reporte R_FIRMA_DICTAMASIV
        this.downloadReport('blank', null);
        if (this.dictaminationSelect.remitente === this.userAuth) {
          this.enableSend = true;
        }
      }
    }
  }

  async send() {
    if (this.dictaminationSelect.remitente !== this.userAuth) {
      this.alert(
        'warning',
        'Usuario inválido',
        'Usuario inválido para realizar la firma.'
      );
      return;
    }
    if (this.dictaminationSelect.firma !== 'S/FIRMA') {
      this.alert(
        'warning',
        'Dictámen firmado',
        'El dictámen se encuentra previamente firmado.'
      );
      return;
    }
    this.PUP_GENERA_XML();
  }

  ssf3SignatureElecDocsCount(documentNumber: number, natureDocument: string) {
    return new Promise<number>((res, _rej) => {
      const params: _Params = {};
      params['filter.documentNumber'] = `$eq:${documentNumber}`;
      this.ssf3SignatureElecDocsService.getAllFiltered(params).subscribe({
        next: resp => res(resp.count),
        error: err => res(0),
      });
    });
  }

  dictaminaCount(noOfDicta: number | string, statusOf: string) {
    return new Promise<number>((res, _rej) => {
      const model = {
        dictumNum: noOfDicta,
        statusOf: statusOf,
      };
      this.dictationService.blkControlPrintWhenButtonPressed(model).subscribe({
        next: resp => {
          console.log(resp);
          res(resp.count);
        },
        error: err => res(0),
      });
    });
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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
  PUP_CONSULTA_PDF_BD_SSF3() {}
  PUP_GENERA_XML() {
    this.onLoadToast('success', 'Firmando ....');
  }
}
