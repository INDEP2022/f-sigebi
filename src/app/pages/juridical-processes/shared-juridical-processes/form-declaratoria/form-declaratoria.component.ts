/** BASE IMPORT */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  selector: 'ngx-form-declaratoria',
  templateUrl: './form-declaratoria.component.html',
  styleUrls: ['./form-declaratoria.component.scss'],
})
export class FormDeclaratoriaComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() nombrePantalla: string;

  //   public form: FormGroup;
  @Output() formValues = new EventEmitter<any>();

  items = new DefaultSelect<Example>();
  constructor(private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {}

  mostrarInfoDeclaratoria(): any {
    console.log(this.form.value);
    this.formValues.emit(this.form);
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
  /**
   * Formulario
   */
  // public returnField(field) { return this.form.get(field); }
  // public returnShowRequirements(field) { return this.returnField(field)?.errors?.required && this.returnField(field).touched; }
}
