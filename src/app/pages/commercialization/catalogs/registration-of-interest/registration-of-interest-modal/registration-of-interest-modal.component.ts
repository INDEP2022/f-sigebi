import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { ITiieV1 } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterTiieService } from 'src/app/core/services/ms-parametercomer/parameter-tiie.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RegistrationOfInterestComponent } from '../registration-of-interest.component';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-registration-of-interest-modal',
  templateUrl: './registration-of-interest-modal.component.html',
  styles: [],
})
export class RegistrationOfInterestModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Registro de Intereses';
  provider: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  edit: boolean = false;
  providerForm: FormGroup = new FormGroup({});
  nameUser: string = '';
  id: number = 0;
  tiie: ITiieV1;
  selectUser = new DefaultSelect<IUser>();
  editUser: any;
  tiiesList: ITiieV1[] = [];
  @Input() registration: RegistrationOfInterestComponent;
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private parameterTiieService: ParameterTiieService,
    private programmingRequestService: ProgrammingRequestService,
    private modalService: BsModalService,
    private usersService: UsersService
  ) {
    super();
  }
  ngOnInit(): void {
    this.prepareForm();
    this.getUserInfo();
    this.getUserSelect(new ListParams());
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      id: [null],
      tiieDays: [
        null,
        [
          Validators.pattern(NUM_POSITIVE),
          Validators.min(1),
          Validators.max(31),
        ],
      ],
      tiieMonth: [
        null,
        [
          Validators.pattern(NUM_POSITIVE),
          Validators.min(1),
          Validators.max(12),
        ],
      ],
      // mes: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      tiieYear: [
        null,
        [Validators.pattern(NUM_POSITIVE), Validators.max(9999)],
      ],
      registryDate: [new Date()],
      tiieAverage: [
        null,
        [
          Validators.pattern(NUM_POSITIVE),
          Validators.min(1),
          Validators.max(99),
        ],
      ],
      user: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      console.log(this.provider);
      this.provider.tiieDays = Math.trunc(this.provider.tiieDays);
      this.provider.tiieAverage = Math.trunc(this.provider.tiieAverage);
      //Set select value
      this.searchUser({ text: this.provider.user });
      this.providerForm.patchValue(this.provider);
    } else {
      this.edit = false;
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  getUserInfo() {
    this.programmingRequestService.getUserInfo().subscribe((data: any) => {
      this.nameUser = data.name;
    });
  }
  getUserSelect(user: ListParams) {}

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

  searchUser(event: any) {
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
  }

  create() {
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
    this.alertQuestion(
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
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.onConfirm.emit(true);
    this.modalRef.content.callback(true);
    this.close();
  }
}
