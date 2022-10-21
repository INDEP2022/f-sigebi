import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CityService } from '../../../../core/services/catalogs/city.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styles: [],
})
export class CityDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  city: any;

  @Output() refresh = new EventEmitter<true>();

  public get cveState() {
    return this.form.get('cveState');
  }

  public get noRegister() {
    return this.form.get('noRegister');
  }

  public get id() {
    return this.form.get('idSafe');
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      idCity: ['', Validators.required],
      nameCity: [
        null,
        Validators.compose([
          Validators.pattern(
            '[a-zA-Z]((.|_|-)?[a-zA-ZáéíóúÁÉÍÓÚ\u0020]+){0,255}'
          ),
          Validators.required,
        ]),
      ],
      cveState: ['', Validators.required],
      noDelegation: [null, Validators.required],
      noSubDelegation: [null, Validators.required],
      legendOffice: [null, [Validators.required]],
      noRegister: [null, [Validators.required]],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.city);
      this.noRegister.disable();
      this.cveState.disable();
      this.form.controls['cveState'].setValue(this.city.state['cveState']);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    const {
      idCity,
      nameCity,
      noDelegation,
      noSubDelegation,
      legendOffice,
      cveState,
      noRegister,
    } = this.form.value;

    const newCity = {
      idCity,
      nameCity,
      noRegister,
      noDelegation,
      noSubDelegation,
      legendOffice,
      version: 1,
      creationUser: localStorage.getItem('name'),
      creationDate: new Date(),
      state: {
        cveState,
      },
    };

    this.cityService.create(newCity).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    const {
      idCity,
      nameCity,
      noDelegation,
      noSubDelegation,
      legendOffice,
      cveState,
    } = this.form.value;

    const cityToUpdate = {
      idCity,
      nameCity,
      noDelegation,
      noSubDelegation,
      legendOffice,
      version: 1,
      creationUser: localStorage.getItem('name'),
      creationDate: new Date(),
      state: {
        cveState,
      },
    };

    this.cityService.update(this.city.idCity, cityToUpdate).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }
}
