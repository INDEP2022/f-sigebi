import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-entry',
  templateUrl: './document-entry.component.html',
  styles: [],
})
export class DocumentEntryComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: string = 'Formato de Entrada de Documentación';
  expedints = new DefaultSelect<any>();
  users = new DefaultSelect<any>();
  fechaActual: Date = new Date();
  get user() {
    return this.authService.decodeToken().username;
  }
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private documentsService: DocumentsService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getExpedient({ page: 1, pageSize: 10 });
    this.getUsers({ page: 1, pageSize: 10 });
  }

  prepareForm() {
    this.form = this.fb.group({
      fecha: [null],
      horaInicio: [null],
      horaFin: [null],
      expediente: [null],
      usuario: [null],
    });
  }

  onReport1() {
    const params = {
      PARAMFORM: 'NO',
      PAR_FECHA: this.form.get('fecha').value,
      PAR_HORA_INI: this.form.get('horaInicio').value,
      PAR_HORA_FIN: this.form.get('horaFin').value,
      PAR_EXPEDIENTE: this.form.get('expediente').value,
      PAR_USUARIO: this.form.get('usuario').value,
    };
    this.downloadReport('blank', params);
  }

  getExpedient(params: ListParams) {
    const model = {
      tiParam3: 'SUPERUSUARIO', //this.user
    };
    this.documentsService.getExpedient(params, model).subscribe({
      next: (response: any) => {
        this.expedints = new DefaultSelect(response.data, response.count);
      },
      error: (error: any) => {
        this.expedints = new DefaultSelect([], 0);
      },
    });
  }

  onExpedintChange(event: any) {
    this.form.get('expediente').setValue(event.fileNumber);
    this.getUsers({ page: 1, pageSize: 10 });
  }

  getUsers(params: ListParams) {
    const model = {
      tiParam4: this.form.get('expediente').value,
      user: 'SUPERUSUARIO', //this.user
    };
    this.documentsService.getDatas(params, model).subscribe({
      next: (response: any) => {
        this.users = new DefaultSelect(response.data, response.count);
      },
      error: (error: any) => {
        this.users = new DefaultSelect([], 0);
      },
    });
  }

  onUserChange(event: any) {
    this.form.get('usuario').setValue(event.name);
  }

  cleanForm1() {
    this.form.reset();
  }

  /// 1) RGERARGENTRADADOC

  downloadReport(reportName: string, params: any) {
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
}
