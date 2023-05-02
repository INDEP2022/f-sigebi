/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-report-access-user',
  templateUrl: './report-access-user.component.html',
  styleUrls: ['./report-access-user.component.scss'],
})
export class ReportAccessUserComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  items = new DefaultSelect<Example>();
  reporteUsuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  prepareForm() {
    this.reporteUsuarioForm = this.fb.group({
      usuario: [null, [Validators.required]],
    });
  }
  btnEjecutarReporte() {
    console.log('btnEjecutarReporte');
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
