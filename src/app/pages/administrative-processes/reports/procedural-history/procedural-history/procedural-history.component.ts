import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

//Services
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { ParagraphService } from 'src/app/core/services/catalogs/paragraph.service';
import { Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@Component({
  selector: 'app-procedural-history',
  templateUrl: './procedural-history.component.html',
  styles: [],
})
export class ProceduralHistoryComponent implements OnInit {
  proceduralHistoryForm: ModelForm<any>;
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private usersService: UsersService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) { }

  users$ = new DefaultSelect<ISegUsers>();

  filterForm: FormGroup = this.fb.group({
    user: [null],
  });

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.proceduralHistoryForm = this.fb.group({
      delegation: [
        null,
        [Validators.required],
      ],
      subdelegation: [
        null,
        [Validators.required],
      ],
      modificationDateOf: [null, Validators.required],
      modificationDateTo: [null, Validators.required],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
      users: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }
  onSubmit() {
    // Log y url con parámetros quemados
    console.log("Usuario ", this.filterForm.value);

    const DateOf = new Date(this.proceduralHistoryForm.value.modificationDateOf);
    const formattedDateOf = this.formatDate(DateOf);

    const DateTo = new Date(this.proceduralHistoryForm.value.modificationDateTo);
    const formattedDateTo = this.formatDate(DateTo);

    let params = {
      PN_BIENINI: this.proceduralHistoryForm.value.ofTheGood,
      PN_BIENFIN: this.proceduralHistoryForm.value.toGood,
      PN_DELG: this.proceduralHistoryForm.value.delegation,
      PN_SUBDEL: this.proceduralHistoryForm.value.subdelegation,
      PF_FECINI: formattedDateOf,
      PF_FECFIN: formattedDateTo,
      PC_USUARIO: this.filterForm.value.user
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => { },
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
            callback: (data: any) => { },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });
    /*const pdfurl =
  'http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf';

const downloadLink = document.createElement('a');
downloadLink.href = pdfurl;
downloadLink.target = '_blank';
downloadLink.click();

let params = { ...this.proceduralHistoryForm.value };
for (const key in params) {
  if (params[key] === null) delete params[key];
}

this.siabService
  .getReport(SiabReportEndpoints.FGENADBSITPROCESB, params)
  .subscribe({
    next: response => {
      console.log(response);
      window.open(pdfurl, 'Reporte de Impresion de Volantes');
    },
    error: () => {
      window.open(pdfurl, 'Reporte de Impresion de Volantes');
    },
  });*/
  }
  formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
  }
  getUsers($params: ListParams) {
    console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          user.id = user.id;
          console.log("user ", user)
          return user;
        });

        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }

  cleanForm() {
    this.proceduralHistoryForm.reset();
    this.filterForm.reset();
  }
}
