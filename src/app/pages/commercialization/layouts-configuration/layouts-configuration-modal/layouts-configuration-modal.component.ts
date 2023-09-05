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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-layouts-configuration-modal',
  templateUrl: './layouts-configuration-modal.component.html',
  styles: [],
})
export class LayoutsConfigurationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Configuración de Diseños';
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
          Validators.required,
          // Validators.pattern(STRING_PATTERN),
          Validators.maxLength(500),
        ],
      ],
      indActive: [null],
      // idConsec: [null],
      // position: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // column: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // // mes: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // type: [null, [Validators.required]],
      // length: [new Date()],
      // constant: [null, [Validators.required]],
      // carFilling: [null, [Validators.required]],
      // justification: [null, [Validators.required]],
      // decimal: [null, [Validators.required]],
      // dateFormat: [null, [Validators.required]],
      // registryNumber: [null, [Validators.required]],
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

  create() {
    try {
      this.loading = false;
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
    } catch {
      console.error('Diseño no existe');
    }
  }
  update() {
    this.alertQuestion(
      'warning',
      'Actualizar Diseño',
      '¿Desea actualizar este diseño?'
    ).then(question => {
      if (question.isConfirmed) {
        // let params: IComerLayoutsW = {
        //   idConsec: this.provider.idConsec,
        //   carFilling: this.provider.carFilling,
        //   column: this.provider.column,
        //   constant: this.provider.constant,
        //   dateFormat: this.provider.dateFormat,
        //   decimal: this.provider.decimal,
        //   indActive: this.provider.indActive,
        //   justification: this.provider.justification,
        //   length: this.provider.length,
        //   position: this.provider.position,
        //   registryNumber: this.provider.registryNumber,
        //   type: this.provider.type,
        // };
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
