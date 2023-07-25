import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIndicatorDeadline } from 'src/app/core/models/catalogs/indicator-deadline.model';
import { IParametersIndicators } from 'src/app/core/models/catalogs/parameters-indicators.model';
import { IndicatorDeadlineService } from 'src/app/core/services/catalogs/indicator-deadline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IndicatorDeadlinesParametersComponent } from '../indicator-deadlines-parameters/indicator-deadlines-parameters.component';

@Component({
  selector: 'app-indicator-deadlines-form',
  templateUrl: './indicator-deadlines-form.component.html',
  styles: [],
})
export class IndicatorDeadlinesFormComponent
  extends BasePage
  implements OnInit
{
  indicatorsDeadlines: IIndicatorDeadline;
  title: string = 'Plazo Indicador';
  edit: boolean = false;
  event: IParametersIndicators = null;
  indicatorDeadlinesModalForm: ModelForm<IIndicatorDeadline>;
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private indicatorDeadlineService: IndicatorDeadlineService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.indicatorDeadlinesModalForm = this.fb.group({
      id: [null],
      indicator: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      formula: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      deadline: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      usuario_creacion: [null],
      fecha_creacion: [null],
      usuario_modificacion: [null],
      fecha_modificacion: [null],
      estatus: [null],
      version: [null],
    });
    this.indicatorDeadlinesModalForm.controls['version'].setValue(1);
    this.indicatorDeadlinesModalForm.controls['estatus'].setValue(1);
    if (this.indicatorsDeadlines != null) {
      this.edit = true;
      this.indicatorDeadlinesModalForm.patchValue(this.indicatorsDeadlines);
    }
  }
  openParameters(context?: Partial<IndicatorDeadlinesParametersComponent>) {
    const modalRef = this.modalService.show(
      IndicatorDeadlinesParametersComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.indicatorDeadlinesModalForm.controls['indicator'].setValue(
          this.event.description
        );
      }
    });
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    if (
      this.indicatorDeadlinesModalForm.controls['formula'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.indicatorDeadlineService
      .create(this.indicatorDeadlinesModalForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.indicatorDeadlineService
      .update(
        this.indicatorsDeadlines.id,
        this.indicatorDeadlinesModalForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  close() {
    this.modalRef.hide();
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
