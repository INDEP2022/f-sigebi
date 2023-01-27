import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ITPenalty } from 'src/app/core/models/ms-parametercomer/penalty-type.model';
import { TPenaltyService } from 'src/app/core/services/ms-parametercomer/tpenalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-penalty-types-form',
  templateUrl: './penalty-types-form.component.html',
  styles: [],
})
export class PenaltyTypesFormComponent extends BasePage implements OnInit {
  // tipo any hasta que existan modelos o interfaces de la respuesta del backend
  penaltyTypeForm: FormGroup = new FormGroup({});
  title: string = 'Tipo Penalización';
  edit: boolean = false;
  penaltyType: ITPenalty;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private tpenaltyService: TPenaltyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.penaltyTypeForm = this.fb.group({
      id: [null],
      descPenalty: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      daysPenalty: [null, [Validators.required]],
      process: [null, [Validators.required, Validators.maxLength(1)]],
    });
    if (this.penaltyType != null) {
      this.edit = true;
      console.log(this.penaltyType);
      this.penaltyTypeForm.patchValue(this.penaltyType);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    // this.handleSuccess();
    console.log(this.penaltyTypeForm.value);
    this.tpenaltyService.create(this.penaltyTypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.onLoadToast(
          'error',
          this.title,
          `Error al conectar con el servidor`
        );
        this.loading = false;
        console.log(error);
      },
    });
  }

  update() {
    this.loading = true;
    // this.handleSuccess();
    this.tpenaltyService
      .update(this.penaltyType.id, this.penaltyTypeForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.onLoadToast(
            'error',
            this.title,
            `Error al conectar con el servidor`
          );
          this.loading = false;
          console.log(error);
        },
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
