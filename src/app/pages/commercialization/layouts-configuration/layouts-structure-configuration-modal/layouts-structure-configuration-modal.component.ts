import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerLayouts,
  IL,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { LayoutsConfigService } from 'src/app/core/services/ms-parametercomer/layouts-config.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-layouts-structure-configuration-modal',
  templateUrl: './layouts-structure-configuration-modal.component.html',
  styles: [],
})
export class LayoutsStructureConfigurationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Estructura del Diseño No:';
  provider: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  edit: boolean = false;
  structureLayoutSelected: any;
  providerForm: FormGroup = new FormGroup({});
  id: number = 0;
  layoutsT: IComerLayouts;
  layout: IL;
  layoutList: IComerLayouts[] = [];
  @Output() onConfirm = new EventEmitter<any>();
  @Input()
  structureLayout: IComerLayouts;
  dataItems = new DefaultSelect();
  dataLayout: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService,
    private parameterModService: ParameterModService
  ) {
    super();
  }
  ngOnInit(): void {
    console.log(this.provider, this.id);
    this.prepareForm();
    // this.structureLayoutSelected = this.structureLayout;
    // this.inpuLayout = this.idLayout.toString().toUpperCase();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      idLayout: [null],
      idConsec: [null],
      position: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      column: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(35)],
      ],
      type: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      length: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(3),
        ],
      ],
      constant: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      carFilling: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      justification: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      decimal: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(2)],
      ],
      dateFormat: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(20)],
      ],
      // registryNumber: [null, [Validators.required]],
    });
    if (this.provider != undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
      this.providerForm.get('idLayout').setValue(this.provider.idLayout.id);
      this.providerForm.markAllAsTouched();
      console.log(this.providerForm.value);
    } else {
      this.edit = false;
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  async create() {
    let valid = await this.valFields();
    if (!valid) return;
    this.loading = false;
    let data = {
      ...this.providerForm.value,
      idLayout: this.id,
      indActive: this.providerForm.value.indActive == true ? 1 : 0,
    };
    delete data.id;
    this.layoutsConfigService.create(data).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert(
          'error',
          'Error al Crear',
          'Ocurrió un error al crear la estructura del diseño'
        );
      },
    });
  }
  async update() {
    let valid = await this.valFields();
    if (!valid) return;
    this.layoutsConfigService
      .update(this.providerForm.value.idLayout, this.providerForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.alert(
            'error',
            'Error al Actualizar',
            'Ocurrió un error al actualizar la estructura del diseño'
          );
          this.loading = false;
        },
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', `Estructura de Diseño ${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    this.close();
  }

  async valFields() {
    const {
      position,
      column,
      type,
      length,
      constant,
      carFilling,
      justification,
      decimal,
      dateFormat,
    } = this.providerForm.value;

    if (!position || position <= 0) {
      this.alert('warning', 'Posición errónea.', '');
      return false;
    }

    if (!length && length <= 0) {
      this.alert('warning', 'Longitud errónea.', '');
      return false;
    }

    if (!column && !constant) {
      this.alert(
        'warning',
        'Debe ingresar el Nombre de Columna o una Constante.',
        ''
      );
      return false;
    }
    if (!carFilling) {
      this.alert('warning', 'Debe ingresar el Caracter de Relleno', '');
      return false;
    }
    if (!justification) {
      this.alert('warning', 'Debe especificar la Tipo de Justificación.', '');
      return false;
    }
    if (type == 'NUMBER') {
      if (!decimal) {
        this.alert('warning', 'Debe especificar el Número de Decimales.', '');
        return false;
      } else if (decimal < 0) {
        this.alert('warning', 'Número de Decimales inválido.', '');
        return false;
      }
    }

    if (type == 'DATE') {
      if (!dateFormat) {
        this.alert('warning', 'Debe especificar el Formato de Fecha.', '');
        return false;
      } else {
        if (!this.validarFecha(dateFormat)) {
          this.alert(
            'warning',
            'Formato de Fecha inválido.',
            'Formato correcto dd/mm/yyyy'
          );
          return false;
        }
      }
    }
    return true;
  }

  validarFecha(fecha: any) {
    var partes = fecha.split('/');
    var dia = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1;
    var anio = parseInt(partes[2], 10);

    var fechaObj = new Date(anio, mes, dia);

    if (
      fechaObj.getFullYear() === anio &&
      fechaObj.getMonth() === mes &&
      fechaObj.getDate() === dia
    ) {
      return true;
    } else {
      return false;
    }
  }

  async getColumns(params: ListParams) {
    params['filter.table'] = `$eq:${this.dataLayout.table.toLowerCase()}`;
    if (params.text) params['filter.column'] = `$ilike:${params.text}`;

    this.parameterModService.aplicationVwColumnsBd(params).subscribe({
      next: response => {
        console.log(response);
        this.dataItems = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.dataItems = new DefaultSelect([], 0);
      },
    });
  }

  changeOpt(event: any) {
    if (event) {
      if (event.type == 'numeric')
        this.providerForm.get('type').setValue('NUMBER');
      else if (event.type == 'date')
        this.providerForm.get('type').setValue('DATE');
      else this.providerForm.get('type').setValue(event.type);

      this.providerForm.get('length').setValue(event.length);
    } else {
      this.providerForm.get('type').setValue(null);
      this.providerForm.get('length').setValue(null);
    }
  }
}
