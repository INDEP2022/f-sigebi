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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-layouts-configuration-modal',
  templateUrl: './layouts-configuration-modal.component.html',
  styles: [],
})
export class LayoutsConfigurationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Configuración de Diseño';
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
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService,
    private parameterModService: ParameterModService
  ) {
    super();
  }
  ngOnInit(): void {
    console.log(this.provider);
    this.prepareForm();
    // this.structureLayoutSelected = this.structureLayout;
    // this.inpuLayout = this.idLayout.toString().toUpperCase();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      id: [null],
      descLayout: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      screenKey: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(32),
        ],
      ],
      table: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(32),
        ],
      ],
      criterion: [
        null,
        [
          // Validators.pattern(STRING_PATTERN),
          Validators.maxLength(500),
        ],
      ],
      indActive: [null],
    });
    if (this.provider != undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
      this.providerForm
        .get('indActive')
        .setValue(this.provider.indActive == '1' ? true : 0);
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
    console.log(this.providerForm.value);
    this.edit ? this.update() : this.create();
  }

  async create() {
    this.loading = false;
    let valTable = await this.validateTable(this.providerForm.value.table);
    if (!valTable) {
      return this.alert('warning', 'Tabla o Vista inexistente.', '');
    }

    let data = {
      ...this.providerForm.value,
      indActive: this.providerForm.value.indActive == true ? 1 : 0,
    };
    delete data.id;
    this.layoutsConfigService.createH(data).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert(
          'error',
          'Error al Crear',
          'Ocurrió un error al crear el diseño'
        );
        return;
      },
    });
  }
  update() {
    this.providerForm.value.indActive =
      this.providerForm.value.indActive == true ? 1 : 0;
    this.layoutsConfigService
      .updatelayoutSH(this.provider.id, this.providerForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.alert(
            'error',
            'Error al Actualizar',
            'Ocurrió un error al actualizar el diseño'
          );
          this.loading = false;
        },
      });
  }
  async validateTable(tabla: string) {
    let params = new ListParams();
    params['filter.table'] = `$eq:${tabla.toLowerCase()}`;
    return new Promise((resolve, reject) => {
      this.parameterModService.aplicationVwColumnsBd(params).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'actualizado' : 'guardado';
    this.alert('success', `Diseño ${message} correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    this.close();
  }

  async getColumns(params: ListParams) {
    if (params.text)
      params['filter.table'] = `$ilike:${params.text.toLowerCase()}`;

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
}
