import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITiieV1 } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterTiieService } from 'src/app/core/services/ms-parametercomer/parameter-tiie.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import {
  DOUBLE_PATTERN,
  NUM_POSITIVE,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-filter-date-picker',
  templateUrl: './filter-date-picker.component.html',
  styles: [],
})
export class FilterDatePickerComponent extends BasePage implements OnInit {
  public override bsConfig: Partial<BsDatepickerConfig>;
  @Input() onChangeInp: any;
  @Input() placeholder: any;
  title: string = 'Registro de Interés';
  inputControl = new FormControl('');

  //providerForm: ModelForm<ITiieV1>;
  providerForm: FormGroup = new FormGroup({});
  provider: ITiieV1;
  edit: boolean = false;
  userSelect = new DefaultSelect();
  minDate = new Date('2011');
  maxDate = new Date('2025');
  maxValor: number = 99;
  miFormulario: FormGroup;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private parameterTiieService: ParameterTiieService
  ) {
    super();
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: 'YYYY',
        minMode: 'year' as BsDatepickerViewMode,
      }
    );

    this.providerForm = this.fb.group({
      tiieDays: [null, Validators.required],
    });
  }

  get tiieDays() {
    return this.providerForm.get('tiieDays') as FormControl;
  }
  ngOnInit(): void {
    /*this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(this.delay))
      .subscribe((value: string) => {
        if (this.inputControl.status === 'VALID') {
          this.query = value !== null ? this.inputControl.value : '';
          this.query = new DatePipe('en-EN').transform(
            this.query,
            'dd/MM/yyyy',
            'UTC'
          );
          this.setFilter();
        }
      });*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      id: [null],
      tiieDays: [
        null,
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE),
          Validators.max(31),
        ],
      ],
      tiieMonth: [null, [Validators.required]],
      // mes: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      tiieYear: [null, [Validators.required]],
      registryDate: [null],
      tiieAverage: [
        null,
        [
          Validators.required,
          Validators.pattern(DOUBLE_PATTERN),
          Validators.min(1),
          Validators.max(99.9999),
        ],
      ],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      console.log(this.provider);
      this.provider.tiieDays = Math.trunc(this.provider.tiieDays);
      this.provider.tiieAverage = Math.trunc(this.provider.tiieAverage);
      this.getUserInfo(new ListParams(), this.provider.user);
      //Set select value
      //this.searchUser({ text: this.provider.user });
      this.providerForm.patchValue(this.provider);
    }
    this.providerForm.controls['registryDate'].setValue(new Date());
    setTimeout(() => {
      this.getUserInfo(new ListParams());
    }, 1000);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  getUserInfo(params: ListParams, id?: string | number) {
    if (id) {
      params['filter.user'] = id;
    }
    this.securityService.getAllUsersTracker(params).subscribe({
      next: response => {
        this.userSelect = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        this.userSelect = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  validateDate(event: Date) {
    if (event) {
      const primerDiaMes = new Date(event.getFullYear(), event.getMonth(), 1);
      const primerDiaMesSiguiente = new Date(primerDiaMes);
      primerDiaMesSiguiente.setMonth(primerDiaMes.getMonth() + 1);
      const duracionMesMilisegundos =
        primerDiaMesSiguiente.getTime() - primerDiaMes.getTime();
      const numeroDias = Math.floor(
        duracionMesMilisegundos / (1000 * 60 * 60 * 24)
      );
      this.maxValor = numeroDias;
      this.cambiarValidacion(numeroDias);
      console.log(numeroDias);
    }
  }

  cambiarValidacion(maxValue: number) {
    // Establecer nuevos validadores (por ejemplo, Validators.min y Validators.max)
    this.tiieDays.setValidators([
      Validators.required,
      Validators.pattern(NUM_POSITIVE),
      Validators.min(1),
      Validators.max(maxValue),
    ]);

    // Validar con los nuevos validadores
    this.tiieDays.updateValueAndValidity();
  }

  /*actualizarValidador() {
    const validadores = [Validators.required];

    if (this.maxValor) {
      validadores.push(Validators.max(this.maxValor));
    }

    this.miNumeroInput.setValidators(validadores);
    this.miNumeroInput.updateValueAndValidity();
  }*/

  /*getUserInfoUpdate(params: ListParams, id?:string | number) {

    this.securityService.getAllUsersTracker(params).subscribe({
      next: response => {
        this.userSelect = new DefaultSelect(response.data, response.count);
      }, error: err => {
        this.userSelect = new DefaultSelect();
        this.loading = false;
      }
    });
  }*/
  //getUserSelect(user: ListParams) { }

  // searchUser() {
  //   let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
  //   this.loading = false;
  //   config.initialState = {
  //     callback: (data: any) => {
  //       if (data) {
  //         data.map((item: any) => {
  //           console.log(item);
  //           this.providerForm
  //             .get('user')
  //             .setValue(item.firstName + ' ' + item.lastName);
  //         });
  //       }
  //     },
  //   };

  //   const searchUser = this.modalService.show(SearchUserFormComponent, config);
  // }

  /*searchUser(event: any) {
    console.log('search' + JSON.stringify(event));
    this.params.getValue()['search'] = event.text;
    this.usersService.getAllSegUsers(this.params.getValue()).subscribe({
      next: data => {
        data.data.map(data => {
          data.name = `${data.id}- ${data.name}`;
          return data;
        });
        this.selectUser = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectUser = new DefaultSelect();
      },
    });
  }*/

  create() {
    this.loading = true;
    let year = this.providerForm.value.tiieYear;
    var date = new Date(year);
    year = date.getFullYear();
    this.providerForm.value.tiieYear = year;

    let month = this.providerForm.value.tiieMonth;
    var date = new Date(month);
    month = date.getMonth() + 1;
    this.providerForm.value.tiieMonth = month;
    //console.log(this.providerForm.value);
    this.parameterTiieService.create(this.providerForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        let errorFixed = '';
        if (
          error.error.message.includes(
            'duplicate key value violates unique constraint'
          )
        ) {
          errorFixed = 'Mes y Año TIIE Duplicado';
        } else {
          if (Array.isArray(error.error.message)) {
            errorFixed = error.error.message[0];
          } else {
            errorFixed = error.error.message;
          }
        }
        this.onLoadToast('error', errorFixed, '');
        return;
      },
    });
  }

  update() {
    let year = this.providerForm.value.tiieYear;
    var date = new Date(year);
    year = date.getFullYear();
    this.providerForm.value.tiieYear = year;

    let month = this.providerForm.value.tiieMonth;
    var date = new Date(month);
    month = date.getMonth() + 1;
    this.providerForm.value.tiieMonth = month;

    this.parameterTiieService
      .update(this.provider.id, this.providerForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          let errorFixed = '';
          if (
            error.error.message.includes(
              'duplicate key value violates unique constraint'
            )
          ) {
            errorFixed = 'Mes y Año TIIE Duplicado';
          } else {
            if (Array.isArray(error.error.message)) {
              errorFixed = error.error.message[0];
            } else {
              errorFixed = error.error.message;
            }
          }
          this.onLoadToast('error', errorFixed, '');
        },
      });

    /*this.alertQuestion(
      'warning',
      'Actualizar',
      '¿Desea Actualizar Este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.parameterTiieService
          .update(this.provider.id, this.providerForm.value)
          .subscribe({
            next: data => this.handleSuccess(),
            error: error => {
              this.loading = false;
              let errorFixed = '';
              if (
                error.error.message.includes(
                  'duplicate key value violates unique constraint'
                )
              ) {
                errorFixed = 'Mes y Año TIIE Duplicado';
              } else {
                if (Array.isArray(error.error.message)) {
                  errorFixed = error.error.message[0];
                } else {
                  errorFixed = error.error.message;
                }
              }
              this.onLoadToast('error', errorFixed, '');
            },
          });
      }
    });*/
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    //this.onConfirm.emit(true);
    this.modalRef.content.callback(true);
    this.close();
  }
}
