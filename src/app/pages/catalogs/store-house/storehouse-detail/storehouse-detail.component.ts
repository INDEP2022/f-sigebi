import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { StorehouseService } from '../../../../core/services/catalogs/storehouse.service';

@Component({
  selector: 'app-storehouse-detail',
  templateUrl: './storehouse-detail.component.html',
  styles: [],
})
export class StorehouseDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  storehouse: any;

  public states = new DefaultSelect();
  public municipalities = new DefaultSelect();
  public localities = new DefaultSelect();

  @Output() refresh = new EventEmitter<true>();

  public get id() {
    return this.form.get('idStorehouse');
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private storehouseService: StorehouseService,
    private stateService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      idStorehouse: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      manager: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.maxLength(255),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      description: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.maxLength(255),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      municipality: [
        null,
        Validators.compose([Validators.pattern(''), Validators.maxLength(255)]),
      ],
      locality: [
        null,
        Validators.compose([Validators.pattern(''), Validators.maxLength(255)]),
      ],
      ubication: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.maxLength(255),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      idEntity: [null, Validators.compose([Validators.maxLength(255)])],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.storehouse);
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
    this.storehouseService.create(this.form.value).subscribe(
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

    this.storehouseService
      .update(this.storehouse.idStorehouse, this.form.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }

  getStates(params: ListParams) {
    this.stateService.getAll(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  getMunicipalities(params: ListParams) {
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  getLocalities(params: ListParams) {
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }
}
