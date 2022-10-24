import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListParams } from '../../../../common/repository/interfaces/list-params';

@Component({
  selector: 'app-minpub-form',
  templateUrl: './minpub-form.component.html',
  styles: [],
})
export class MinpubFormComponent extends BasePage implements OnInit {
  minpubForm: FormGroup = new FormGroup({});
  title: string = 'MinPub';
  edit: boolean = false;
  minpub: IMinpub;
  items = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private minpubService: MinPubService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.minpubForm = this.fb.group({
      id: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      responsable: [null, [Validators.required]],
      no_ciudad: [null, [Validators.required]],
      calle: [null, [Validators.required]],
      no_interior: [null, [Validators.required]],
      no_exterior: [null, [Validators.required]],
      colonia: [null, [Validators.required]],
      codigo_postal: [null, [Validators.required]],
      deleg_munic: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      no_registro: [null, [Validators.required]],
    });
    if (this.minpub != null) {
      this.edit = true;
      let city: ICity = this.minpub.no_ciudad as ICity;
      this.minpubForm.patchValue({ ...this.minpub, no_ciudad: city?.idCity });
      this.minpub.no_ciudad
        ? (this.items = new DefaultSelect([city], 1))
        : this.getFromSelect({ inicio: 1, text: '' });
    } else {
      this.getFromSelect({ inicio: 1, text: '' });
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
    this.minpubService.create(this.minpubForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.minpubService.update(this.minpub.id, this.minpubForm.value).subscribe({
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

  getFromSelect(params: ListParams) {
    this.minpubService.getCities(params).subscribe((data: any) => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
