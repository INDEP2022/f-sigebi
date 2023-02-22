import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParameterTiieService } from 'src/app/core/services/ms-parametercomer/parameter-tiie.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SearchUserFormComponent } from 'src/app/pages/request/programming-request-components/schedule-reception/search-user-form/search-user-form.component';
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
  id: number;
  tiiesList: any[];
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private parameterTiieService: ParameterTiieService,
    private programmingRequestService: ProgrammingRequestService,
    private modalService: BsModalService
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
      id: ['1062', [Validators.required]],
      tiieDays: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      tiieMonth: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      // mes: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      tiieYear: [null, [Validators.required]],
      registryDate: [new Date()],
      tiieAverage: [null, [Validators.required]],
      user: [null, [Validators.required]],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
    } else {
      this.edit = false;
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let params = {
      tiieDays: this.providerForm.controls['tiieDays'].value,
      tiieMonth: this.providerForm.controls['tiieMonth'].value,
      tiieYear: this.providerForm.controls['tiieYear'].value,
      tiieAverage: this.providerForm.controls['tiieAverage'].value,
      registryDate: this.providerForm.controls['registryDate'].value,
      user: this.providerForm.controls['user'].value,
    };
    this.handleSuccess();
    this.close();
  }

  handleSuccess() {
    this.loading = true;
    this.parameterTiieService.create(this.providerForm.value).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.loading = false;
        this.onConfirm.emit(this.providerForm.value);
        this.modalRef.hide();
        setTimeout(() => {
          this.onLoadToast('success', 'Registro exitoso', '');
        }, 2000);
      },
      // ,
      // error: error => {
      //   this.loading = false
      //   this.onLoadToast('error', 'Año duplicado', '');
      //   this.modalRef;
      // },
    });
  }
  getUserInfo() {
    this.programmingRequestService.getUserInfo().subscribe((data: any) => {
      this.nameUser = data.name;
    });
  }
  getUserSelect(user: ListParams) {}

  searchUser() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          data.map((item: any) => {
            this.providerForm.get('user').setValue(item.user);
          });
        }
      },
    };

    const searchUser = this.modalService.show(SearchUserFormComponent, config);
  }
  getTiies() {
    return this.tiiesList;
  }

  // update() {
  //   this.loading = true;
  //   this.parameterTiieService.update(, this.providerForm.value).subscribe(
  //     data => this.handleSuccess(),
  //     error => (this.loading = false)
  //   );
  // }
}
