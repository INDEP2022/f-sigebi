import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICopiesOfficialOpinion1 } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-copy-documentation-goods-dialog',
  templateUrl: './copy-documentation-goods-dialog.component.html',
  styles: [],
})
export class CopyDocumentationGoodsDialogComponent
  extends BasePage
  implements OnInit
{
  copiesOfficialForm: ModelForm<ICopiesOfficialOpinion1>;
  copiesOfficial: ICopiesOfficialOpinion1;
  dataCreate: { numberOfDicta: number; typeDictamination: number } | null =
    null;
  users$ = new DefaultSelect<ISegUsers>();
  title: string = 'Copia de Oficio';
  edit: boolean = false;

  selectDictNumber = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private copiesOfficialService: CopiesOfficialOpinionService,
    private dictationService: DictationService,
    private usersService: UsersService
  ) {
    super();
  }

  getDictNumbers(params: ListParams) {
    this.dictationService.getAll(params).subscribe({
      next: data =>
        (this.selectDictNumber = new DefaultSelect(data.data, data.count)),
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDictNumbers(new ListParams());
  }

  private prepareForm() {
    this.copiesOfficialForm = this.fb.group({
      numberOfDicta: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      typeDictamination: ['', [Validators.required, Validators.maxLength(15)]],
      copyDestinationNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      recipientCopy: ['', [Validators.required, Validators.maxLength(15)]],
      namePersonExt: ['', [Validators.required, Validators.maxLength(45)]],
      personExtInt: ['', [Validators.required, Validators.maxLength(45)]],
    });

    if (this.dataCreate) {
      this.copiesOfficialForm.patchValue(this.dataCreate);
    }

    if (this.copiesOfficial != null) {
      this.edit = true;
      this.copiesOfficialForm.patchValue(this.copiesOfficial);
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

    this.copiesOfficialService.create(this.copiesOfficialForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.onLoadToast(
          'error',
          ' Los Datos Ingresados son Incorrectos.',
          `Por favor de Verificar`
        );
        console.log(error);
        this.close();
        this.loading = false;
      },
    });
  }

  update() {
    this.loading = true;
    console.log(this.copiesOfficialForm.value);
    this.copiesOfficialService.update(this.copiesOfficialForm.value).subscribe({
      next: data => {
        this.handleSuccess();
      },
      error: error => {
        this.onLoadToast(
          'error',
          error,
          `Error guardando los datos, verifique`
        );
        console.log(error);
        this.close();
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.copiesOfficialForm.get('personExtInt').value;
          const data = response.data.filter(m => {
            m.id == name;
          });
          console.log(data[0]);
          this.copiesOfficialForm.get('personExtInt').patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
}
