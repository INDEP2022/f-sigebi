import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CourtListComponent } from 'src/app/pages/parameterization/court-maintenance/court-list/court-list.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-court-maintenance',
  templateUrl: './court-maintenance.component.html',
  styles: [],
})
export class CourtMaintenanceComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({});
  edit: boolean = false;
  isPresent: boolean = false;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private courtServ: CourtService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      circuitCVE: [null, Validators.maxLength(15)],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      manager: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      street: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      numExterior: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      numInside: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      cologne: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      zipCode: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      delegationMun: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      numPhone: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(20)],
      ],
      numRegister: [{ value: null, disabled: true }],
      id: [{ value: null, disabled: true }],
    });
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: ICourt) => {
          if (next) {
            this.form.patchValue(data);
            this.edit = true;
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CourtListComponent, config);
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Eliminado correctamente', '');
      }
    });
  }

  confirm() {
    this.form.get('id').enable();
    if (this.form.value) {
      if (this.edit) {
        this.courtServ.updateCourt(this.form.value).subscribe({
          next: () => (
            this.onLoadToast('success', 'Juzgado', 'Se ha actualizado'),
            this.clean()
          ),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      } else {
        this.courtServ.create(this.form.value).subscribe({
          next: () => (
            this.onLoadToast('success', 'Juzgado', 'Se ha guardado'),
            this.clean()
          ),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    }
  }

  clean() {
    this.form.reset();
    this.edit = false;
  }
}
