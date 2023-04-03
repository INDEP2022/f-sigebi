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
    private usersService: UsersService
  ) {}

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
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subdelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
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
    console.log(this.proceduralHistoryForm.value);
    const pdfurl =
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
      });
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
          return user;
        });

        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }
}
