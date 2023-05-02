/** BASE IMPORT */
import { Component, OnInit } from '@angular/core';
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
  selector: 'ngx-users-indicadores-usuario',
  templateUrl: './users-indicadores-usuario.component.html',
  styleUrls: ['./users-indicadores-usuario.component.scss'],
})
export class UsersIndicadoresUsuarioComponent
  extends BasePage
  implements OnInit
{
  items = new DefaultSelect<Example>();
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      consecutivo: { title: 'Consecutivo' },
      descripcion: { title: 'Descripción' },
      area: { title: 'Área' },
    },
  };

  data = [
    {
      consecutivo: 'Consecutivo',
      descripcion: 'Descripción',
      area: 'Área',
    },
  ];
  form: FormGroup;

  constructor(private exampleService: ExampleService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  prepareForm() {
    this.form = this.fb.group({
      tipoUsuario: ['', [Validators.maxLength(11)]], // 2 id - 100 desc char
    });
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
