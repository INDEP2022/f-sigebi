import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { NormsDestinationComponent } from '../norms-destination/norms-destination.component';
import { INorm } from './../../../../core/models/catalogs/norm.model';
import { NormService } from './../../../../core/services/catalogs/norm.service';

@Component({
  selector: 'app-norms-form',
  templateUrl: './norms-form.component.html',
  styles: [],
})
export class NormsFormComponent extends BasePage implements OnInit {
  normForm: FormGroup = new FormGroup({});
  title: string = 'Norma';
  edit: boolean = false;
  norm: INorm;
  items = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();
  type: any[];
  destination: any[];
  event: IGeneric = null;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private normService: NormService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.type = [
      { label: '6', value: '' },
      { label: '7', value: '' },
    ];
  }

  private prepareForm(): void {
    this.normForm = this.fb.group({
      id: [null],
      norm: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      article: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      type: [null],
      destination: [null],
      characteristics: [
        null,
        [Validators.maxLength(4000), Validators.pattern(STRING_PATTERN)],
      ],
      merchandise: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      fundament: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      objective: [
        null,
        [Validators.maxLength(4000), Validators.pattern(STRING_PATTERN)],
      ],
      condition: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      version: [null],
      status: [null],
      name: [null, [Validators.required]],
    });
    this.normForm.controls['version'].setValue(1);
    this.normForm.controls['status'].setValue(1);
    if (this.norm != null) {
      this.edit = true;
      console.log(this.norm);
      this.normForm.patchValue(this.norm);
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
    let form = {
      norm: this.normForm.controls['norm'].value,
      article: this.normForm.controls['article'].value,
      type: this.normForm.controls['type'].value,
      destination: this.normForm.controls['destination'].value,
      characteristics: this.normForm.controls['characteristics'].value,
      merchandise: this.normForm.controls['merchandise'].value,
      fundament: this.normForm.controls['fundament'].value,
      objective: this.normForm.controls['objective'].value,
      condition: this.normForm.controls['condition'].value,
      version: this.normForm.controls['version'].value,
      status: this.normForm.controls['status'].value,
    };
    if (
      this.normForm.controls['norm'].value.trim() === '' ||
      this.normForm.controls['destination'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.normService.create(form).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  openDestination(context?: Partial<NormsDestinationComponent>) {
    const modalRef = this.modalService.show(NormsDestinationComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.normForm.controls['destination'].setValue(this.event.keyId);
        this.normForm.controls['name'].setValue(this.event.description);
      }
    });
  }
  update() {
    this.loading = true;
    let form = {
      norm: this.normForm.controls['norm'].value,
      article: this.normForm.controls['article'].value,
      type: this.normForm.controls['type'].value,
      destination: this.normForm.controls['destination'].value,
      characteristics: this.normForm.controls['characteristics'].value,
      merchandise: this.normForm.controls['merchandise'].value,
      fundament: this.normForm.controls['fundament'].value,
      objective: this.normForm.controls['objective'].value,
      condition: this.normForm.controls['condition'].value,
      version: this.normForm.controls['version'].value,
      status: this.normForm.controls['status'].value,
    };
    this.normService.update(this.norm.id, form).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
