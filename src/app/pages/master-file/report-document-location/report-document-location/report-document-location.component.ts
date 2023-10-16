import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-report-document-location',
  templateUrl: './report-document-location.component.html',
  styles: [],
})
export class ReportDocumentLocationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  areaSele = new DefaultSelect();
  user1 = new DefaultSelect();
  delegation: any;
  subdelegation: any;
  constructor(
    private fb: FormBuilder,
    private departamentService: DepartamentService,
    private usersService: UsersService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, [Validators.required]],
      area: [null, [Validators.required]],
      loanedto: [null, [Validators.required]],
      expedient: [null, [Validators.required]],
      NoLoans: [null, [Validators.required]],
    });
  }

  getAllAreaDepataments(params: ListParams) {
    console.log('params: ', params);
    delete params['filter.description.$ilike:'];
    let name = params['search'];
    this.departamentService.getAllDepartamentByname(params, name).subscribe({
      next: resp => {
        this.areaSele = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.areaSele = new DefaultSelect();
      },
    });
  }

  getAllSegUser1(params: ListParams) {
    console.log('params: ', params);
    delete params['filter.name.$ilike:'];
    let name = params['search'];
    this.usersService.getAllSegUsers3(params, name).subscribe({
      next: resp => {
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  seleccionarDelegation(event: any) {
    console.log('event dele', event);
    this.delegation = event.id;
  }

  seleccionarSubDelegation(event: any) {
    console.log('event sub', event);
    this.subdelegation = event.id;
  }

  imprimir() {
    //let LV_USUARIO = this.form.get('loanFor').value + '' + this.form.get('dsarea').value
    let params = {
      p_no_expediente: this.form.get('expedient').value,
      p_usuario_prestamo: this.form.get('loanedto').value,
      p_no_prestamo: this.form.get('NoLoans').value,
      p_area: this.form.get('area').value,
      pn_deleg: this.delegation,
      pn_subdel: this.subdelegation,
    };
    this.siabService
      .fetchReport('RGERARGGUARDAVALO', params)
      // .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
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
        } else {
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
        }
      });
  }

  clear() {
    this.form.reset();
    this.delegation = null;
    this.subdelegation = null;
  }
}
