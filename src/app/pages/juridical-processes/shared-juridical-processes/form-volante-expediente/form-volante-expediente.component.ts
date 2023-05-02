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
  selector: 'ngx-form-volante-expediente',
  templateUrl: './form-volante-expediente.component.html',
  styleUrls: ['./form-volante-expediente.component.scss'],
})
export class FormVolanteExpedienteComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() nombrePantalla: string;
  items = new DefaultSelect<Example>();

  public optionsTipoVolante = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Procesal', label: 'Procesal' },
    { value: 'Admin. Trans', label: 'Admin. Trans' },
    { value: 'Transferente', label: 'Transferente' },
  ];
  public botonOficio = false;
  public botonCaptura = false;

  //   public form: FormGroup;
  @Output() formValues = new EventEmitter<any>();
  @Output() oficioRelacionadoEvent = new EventEmitter<any>();
  @Output() capturaCopiasEvent = new EventEmitter<any>();
  constructor(private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {}

  mostrarInfo(): any {
    console.log(this.form.value);
    this.formValues.emit(this.form);
  }

  oficioRelacionado() {
    console.log('Oficio Relacionado');
    this.oficioRelacionadoEvent.emit(true);
  }

  capturaCopias() {
    console.log('Captura copias');
    this.capturaCopiasEvent.emit(true);
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
