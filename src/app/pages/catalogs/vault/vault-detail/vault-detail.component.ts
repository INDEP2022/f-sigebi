import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SafeService } from '../../../../core/services/catalogs/safe.service';

@Component({
  selector: 'app-vault-detail',
  templateUrl: './vault-detail.component.html',
  styles: [],
})
export class VaultDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  vault: any;

  public states = new DefaultSelect();
  public cities = new DefaultSelect();
  public municipalities = new DefaultSelect();
  public localities = new DefaultSelect();

  @Output() refresh = new EventEmitter<true>();

  public get id() {
    return this.form.get('idSafe');
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private safeService: SafeService,
    private stateService: StateOfRepublicService,
    private cityService: CityService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      idSafe: ['', Validators.required],
      manager: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      description: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      ubication: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      registerNumber: [null, Validators.compose([Validators.pattern('')])],
      municipalityCode: [null, Validators.compose([Validators.pattern('')])],
      localityCode: [null, Validators.compose([Validators.pattern('')])],
      stateCode: [null, Validators.compose([Validators.pattern('')])],
      cityCode: [null, Validators.compose([Validators.pattern('')])],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      const { descState, nameCity, municipalityName, localityName } =
        this.vault;
      this.form.patchValue(this.vault);
      this.id.disable();
      //TODO: Revisar con backend que regrese el objeto de bodega completo para poder pintar la informacion en los select
      // this.states = new DefaultSelect([descState], 1);
      // this.cities = new DefaultSelect([nameCity], 1);
      // this.municipalities = new DefaultSelect([municipalityName], 1);
      // this.localities = new DefaultSelect([localityName], 1);
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
    this.safeService.create(this.form.value).subscribe(
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

    this.safeService.update(this.vault.idSafe, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  getStates(params: ListParams) {
    this.stateService.getAll(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  getCities(params: ListParams) {
    this.cityService.getAll(params).subscribe(data => {
      this.cities = new DefaultSelect(data.data, data.count);
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
