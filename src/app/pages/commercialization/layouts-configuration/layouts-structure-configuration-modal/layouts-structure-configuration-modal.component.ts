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
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-layouts-structure-configuration-modal',
  templateUrl: './layouts-structure-configuration-modal.component.html',
  styles: [],
})
export class LayoutsStructureConfigurationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Estructura del Diseño';
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

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(35),
        ],
      ],
      // mes: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      type: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(15),
        ],
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(500),
        ],
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
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(2),
        ],
      ],
      dateFormat: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(20),
        ],
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
    console.log(this.providerForm.value);
    this.edit ? this.update() : this.create();
  }

  create() {
    try {
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
            'Ocurrió un Error al Crear la Estructura del Diseño'
          );
          return;
        },
      });
    } catch {
      console.error('Diseño no existe');
    }
  }
  update() {
    this.alertQuestion(
      'warning',
      'Actualizar Estructura del Diseño',
      '¿Desea Actualizar la Estructura del Diseño?'
    ).then(question => {
      if (question.isConfirmed) {
        this.layoutsConfigService
          .update(this.providerForm.value.idLayout, this.providerForm.value)
          .subscribe({
            next: data => this.handleSuccess(),
            error: error => {
              this.alert(
                'error',
                'Error al Actualizar',
                'Ocurrió un Error al Actualizar la Estructura del Diseño'
              );
              this.loading = false;
            },
          });
      }
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    // setTimeout(() => {
    //   this.alert('success', this.title, `${message} Correctamente`);
    // }, 2000);
    this.alert('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    // this.modalRef.content.callback(true);
    this.close();
  }
}
