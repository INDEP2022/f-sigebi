import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { MassiveConversionPermissionsComponent } from '../massive-conversion-permissions/massive-conversion-permissions.component';
import { COLUMNS } from './columns';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

@Component({
  selector: 'app-massive-conversion',
  templateUrl: './massive-conversion.component.html',
  styles: [],
})
export class MassiveConversionComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();

    //Tabla de PREVISUALIZACIÓN DE DATOS
    this.settings = {
      ...this.settings,
      actions: { add: false, delete: true, edit: true },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      //Primer form
      package: [null, [Validators.required]],
      packageType: [null, [Validators.required]],
      amountKg: [null, [Validators.required]],
      status: [null, [Validators.required]],

      //Segundo form
      delegation: [null, [Validators.required]],
      goodClassification: [null, [Validators.required]],
      targetTag: [null, [Validators.required]],
      goodStatus: [null, [Validators.required]],
      measurementUnit: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],

      //Pestaña de "ESCANEO"
      scanFolio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],

      //Pestaña de "PÁRRAFOS"
      paragraphS: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphF: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //Párrrafo inicial
      paragraphL: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //Párrrafo final
    });

    //Formulario "NUEVO BIEN"
    this.form2 = this.fb.group({
      numberGood: [null, [Validators.required]],
      record: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      unit: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required]],
      check: [false],
    });
  }

  add() {
    console.log(this.form.value);
    //this.openModal();
  }

  edit(data: any) {
    //console.log(data)
    //this.openModal({ edit: true, paragraph });
  }

  showConfirmAlert() {
    // Validar que todos los campos estén diligenciados
    if (this.form.valid) {
      this.alertQuestion(
        'info',
        'Confirmación',
        '¿Está seguro de que el Paquete ya ha sido validado?'
      ).then(question => {
        if (question.isConfirmed) {
          console.log('Hola', question.isConfirmed);
          // Lógica a ejecutar si se confirma la acción
          // ...
          // Ejemplo: mostrar un mensaje de éxito
          Swal.fire('Validado', '', 'success');
        }
      });
    } else {
      // Mostrar mensaje de error
      Swal.fire(`Faltan datos necesarios para validar ${this.form}`);
    }
  }

  showAutorizateAlert() {
    // Validar que todos los campos estén diligenciados
    if (this.form.valid) {
      this.alertQuestion(
        'info',
        'Confirmación',
        '¿Está seguro de que el Paquete ya ha sido autorizado?'
      ).then(question => {
        if (question.isConfirmed) {
          // Lógica a ejecutar si se confirma la acción
          // ...
          // Ejemplo: mostrar un mensaje de éxito
          Swal.fire('Autorizado', '', 'success');
        }
      });
    } else {
      // Mostrar mensaje de error
      Swal.fire(`Existe inconsistencia en los bienes ${this.form}`);
    }
  }

  showCloseAlert() {
    // Validar que todos los campos estén diligenciados
    if (this.form.valid) {
      this.alertQuestion(
        'info',
        'Confirmación',
        '¿Está seguro en cerrar el Paquete?'
      ).then(question => {
        if (question.isConfirmed) {
          // Lógica a ejecutar si se confirma la acción
          // ...
          // Ejemplo: mostrar un mensaje de éxito
          Swal.fire('Autorizado', '', 'success');
        }
      });
    } else {
      // Mostrar mensaje de error
      Swal.fire(`Existe inconsistencia en los bienes... ${this.form} `);
    }
  }

  delete(data: any) {
    console.log(data);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openPermissions(data: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: false,
    };
    this.modalService.show(MassiveConversionPermissionsComponent, modalConfig);
  }
}
