import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { Minpub } from 'src/app/core/models/parameterization/parametrization.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MaintenanceListComponent } from '../maintenance-list/maintenance-list.component';

@Component({
  selector: 'app-maintenance-of-public-ministries',
  templateUrl: './maintenance-of-public-ministries.component.html',
  styles: [],
})
export class MaintenanceOfPublicMinistriesComponent
  extends BasePage
  implements OnInit
{
  //form!: FormGroup;
  form: FormGroup;
  formData: Minpub = {} as Minpub;
  edit: boolean = false;
  selectCity = new DefaultSelect();
  minpub: any;
  title: string = 'Ministerio Público';
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  data1: any;
  SubDelegationDetail2: any;
  delegationDetail2: any;
  stateDetail2: any;
  constructor(
    private readonly fb: FormBuilder,
    private readonly maintenceService: MinPubService,
    private readonly serviceDeleg: DelegationService,
    private readonly serviceSubDeleg: SubdelegationService,
    private readonly serviceFederation: EntFedService,
    private readonly modalService: BsModalService,
    private serviceCity: CityService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: IMinpub) => {
          if (next) {
            this.edit = next;
            this.form.patchValue(data);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceListComponent, config);
  }

  private buildForm() {
    this.form = this.fb.group({
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      manager: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      street: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      insideNumber: [
        null,
        [
          //Validators.required,
          Validators.maxLength(10),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      outNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      colony: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      delegNunic: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      zipCode: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      idCity: [null, [Validators.required]],
      entity: [null],
      delegation: [null],
      subDelegation: [null],
      cityNumber: [null],
      id: [null],
    });

    if (this.minpub != null) {
      this.edit = true;
      this.getCitiesFilter(new ListParams(), this.minpub.idCity);
      //this.form.controls['idCity'].setValue(this.minpub.idCity);
      this.form.patchValue(this.minpub);
      console.log(this.SubDelegationDetail2);

      this.form.get('entity').disable();
      this.form.get('delegation').disable();
      this.form.get('subDelegation').disable();
    }

    setTimeout(() => {
      this.getCities(new ListParams());
    }, 1000);

    this.form.get('entity').disable();
    this.form.get('delegation').disable();
    this.form.get('subDelegation').disable();
  }

  /*public confirm() {
    this.form.get('cityNumber').patchValue(this.form.controls['idCity'].value);
    if (this.form.valid) {
      this.loading = true;
      if (this.edit) {
        this.maintenceService.update('', this.form.value).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido actualizado con éxito', '');
            this.clean();
          },
          error: error => {
            this.loading = false;
            this.onLoadToast('error', error.erro.message, '');
            console.log(error);
          },
        });
      } else {
        const filter = new FilterParams();
        const { description } = this.form.value;

        filter.removeAllFilters();
        filter.addFilter('description', description, SearchFilter.EQ);

        this.maintenceService.getAllWithFilters(filter.getParams()).subscribe({
          next: resp => {
            if (resp.data.length > 0) {
              this.loading = false;
              this.onLoadToast('error', 'Descripción ya registrada', '');
            } else {
              this.maintenceService.create(this.form.value).subscribe({
                next: () => {
                  this.onLoadToast('success', 'Ha sido creado con éxito', '');
                  this.clean();
                },
                error: error => {
                  this.loading = false;
                  this.onLoadToast('error', error.erro.message, '');
                },
              });
            }
          },
          error: err => {
            this.loading = false;
            this.onLoadToast('error', err.error.message, '');
          },
        });
      }
    }
  }

  public updateEntity(data: any) {
    if (data) {
      if (typeof data.state == 'string') {
        this.getEntidad(data.state);
      } else {
        this.form.get('entity').patchValue(data.state.descCondition);
      }
      console.log(data);
      this.getDelegation(data.noDelegation);
      this.getSubDelegation(data.noSubDelegation);
    }
  }

  private getEntidad(id: number) {
    this.serviceFederation.getById(id).subscribe({
      next: data => this.form.get('entity').patchValue(data.otWorth),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getDelegation(delegation: number) {
    const params = new ListParams();
    params['filter.id'] = delegation;
    params['filter.etapaEdo'] = 1;

    this.serviceDeleg.getAll(params).subscribe({
      next: data => {
        this.form.get('delegation').patchValue(data.data[0].description);
      },
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getSubDelegation(subDelegation: number) {
    this.serviceSubDeleg.getById(subDelegation).subscribe({
      next: data => this.form.get('subDelegation').patchValue(data.description),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }*/

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.maintenceService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', error.erro.message, '');
      },
    });
  }

  update() {
    this.maintenceService.update('', this.form.value).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', error.erro.message, '');
        console.log(error);
      },
    });
  }

  clean() {
    this.form.reset();
    this.edit = false;
    this.loading = false;
  }

  getCities(param: ListParams) {
    this.serviceCity.getAll(param).subscribe({
      next: res => {
        console.log(res.data);
        this.selectCity = new DefaultSelect(res.data, res.count);
      },
      error: err => {
        this.selectCity = new DefaultSelect();
      },
    });
  }

  getCitiesFilter(param: ListParams, id?: string | number) {
    if (id) {
      param['filter.idCity'] = `$eq:${id}`;
    }
    this.serviceCity.getAll(param).subscribe({
      next: res => {
        this.selectCity = new DefaultSelect(res.data, res.count);
        this.data1 = res.data;
        this.onCitiesChange(this.data1[0]);
      },
      error: err => {
        this.selectCity = new DefaultSelect();
      },
    });
  }

  onCitiesChange(subdelegation: any) {
    if (subdelegation) {
      console.log(subdelegation);
      let SubDelegationDetail1: any = subdelegation.SubDelegationDetail;
      let delegationDetail1: any = subdelegation.delegationDetail;
      let stateDetail: any = subdelegation.stateDetail;
      this.form.controls['delegation'].setValue(delegationDetail1.description);
      this.form.controls['subDelegation'].setValue(
        SubDelegationDetail1.description
      );
      //this.getEntidad(subdelegation.state);
      this.form.controls['entity'].setValue(stateDetail.descCondition);
    } else {
      this.form.controls['delegation'].setValue(null);
      this.form.controls['subDelegation'].setValue(null);
      this.form.controls['entity'].setValue(null);
    }
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
