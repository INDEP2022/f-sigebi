/** BASE IMPORT */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  selector: 'ngx-fact-abandonos-oficio',
  templateUrl: './fact-abandonos-oficio.component.html',
  styleUrls: ['./fact-abandonos-oficio.component.scss'],
})
export class FormFactAbandonosOficioComponent
  extends BasePage
  implements OnInit
{
  allForms: {
    formOficio: FormGroup;
    formCcpOficio: FormGroup;
    formOficiopageFin: FormGroup;
  };
  items = new DefaultSelect<Example>();

  @Input() formOficio: FormGroup;
  @Input() formCcpOficio: FormGroup;
  @Input() formOficiopageFin: FormGroup;

  @Output() formValues = new EventEmitter<any>();

  /** Tabla bienes */
  data2 = [
    {
      cveDocumento: 25,
      description: 'UNA BOLSA',
    },
  ];
  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      cveDocumento: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  /** Tabla bienes */

  constructor(private fb: FormBuilder, private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {}

  getDataFormOficio(formOficio: FormGroup): any {
    this.formOficio = formOficio;
    this.allForms.formOficio = this.formOficio;
    this.allForms.formCcpOficio = this.formCcpOficio;
    this.allForms.formOficiopageFin = this.formOficiopageFin;
    console.log(this.allForms);
    this.formValues.emit(this.allForms);
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
  /**
   * Formulario
   */
  // public returnField(form, field) { return form.get(field); }
  // public returnShowRequirements(form, field) {
  //   return this.returnField(form, field)?.errors?.required
  //   && this.returnField(form, field).touched;
  // }
}
