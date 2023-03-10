import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { BasePage } from 'src/app/core/shared/base-page';
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
      norm: [null, [Validators.required]],
      article: [null],
      type: [null, [Validators.required]],
      destination: [null, [Validators.required]],
      characteristics: [null, [Validators.required]],
      merchandise: [null, [Validators.required]],
      fundament: [null, [Validators.required]],
      objective: [null, [Validators.required]],
      condition: [null],
      version: [null],
      status: [null],
    });
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
    this.normService.create(this.normForm.value).subscribe({
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
        this.normForm.controls['destination'].setValue(this.event.name);
      }
    });
  }
  update() {
    this.loading = true;
    this.normService.update(this.norm.id, this.normForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
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
