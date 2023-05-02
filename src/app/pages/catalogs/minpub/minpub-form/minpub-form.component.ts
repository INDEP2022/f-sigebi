import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { CityService } from '../../../../core/services/catalogs/city.service';
import {
  PHONE_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';

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
  minpubValue: ICity;
  idCity: ICity;
  items = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private minpubService: MinPubService,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.minpubForm = this.fb.group({
      id: [null, []],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      manager: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cityNumber: [null, []],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      insideNumber: [null, [Validators.required]],
      outNumber: [null, [Validators.required]],
      colony: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      zipCode: [null, [Validators.required]],
      delegNunic: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      registryNumber: [null, []],
      city: [null, []],
      nameCity: [null, []],
    });
    if (this.minpub != null) {
      this.edit = true;
      //const idCity = this.minpub.idCity;
      this.idCity = this.minpub.city as ICity;
      console.log('Id Ciudad', this.idCity.idCity);
      this.minpubForm.patchValue(this.minpub);
      this.minpubForm.controls['city'].setValue(this.idCity.idCity);
    }
  }

  onValuesChange(minpubChange: ICity) {
    console.log(minpubChange);
    this.minpubValue = minpubChange;

    this.minpubForm.controls['nameCity'].setValue(minpubChange.nameCity);
    this.items = new DefaultSelect();
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
    this.minpubService.update2(this.minpubForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Trae lista de ciudades
  getFromSelect(params: ListParams) {
    this.cityService.getAll(params).subscribe((data: any) => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
