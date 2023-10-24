import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-documentation-goods-dialog',
  templateUrl: './documentation-goods-dialog.component.html',
  styles: [],
})
export class DocumentationGoodsDialogComponent
  extends BasePage
  implements OnInit
{
  documentsDictumXStateMForm: ModelForm<IDocumentsDictumXStateM>;
  documentsDictumXStateM: IDocumentsDictumXStateM | any;

  title: string = 'Documentación de bien';
  edit: boolean = false;
  users$ = new DefaultSelect<ISegUsers>();
  selectExpedient = new DefaultSelect();
  selectGood = new DefaultSelect();
  selectDictNumber = new DefaultSelect();
  dataCreate: { officialNumber: number; typeDictum: number } | null = null;
  @Input() dictation: IDictation;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private documentService: DocumentsDictumStatetMService,
    private expedientsService: ExpedientService,
    private goodService: GoodService,
    private dictationService: DictationService,
    private token: AuthService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getExpedients(new ListParams());
    this.getGoods(new ListParams());
    this.getDictNumbers(new ListParams());
  }

  getDictNumbers(params: ListParams) {
    this.dictationService.getAll(params).subscribe({
      next: data =>
        (this.selectDictNumber = new DefaultSelect(data.data, data.count)),
    });
  }

  getExpedients(params: ListParams) {
    this.expedientsService.getAll(params).subscribe({
      next: data =>
        (this.selectExpedient = new DefaultSelect(data.data, data.count)),
    });
  }

  getGoods(params: ListParams) {
    this.goodService.getAll(params).subscribe({
      next: data =>
        (this.selectGood = new DefaultSelect(data.data, data.count)),
    });
  }

  private prepareForm() {
    this.documentsDictumXStateMForm = this.fb.group({
      officialNumber: [null],
      typeDictum: ['', Validators.required],
      expedientNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      stateNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      key: [
        '',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      dateReceipt: [null, [Validators.required]],
      userReceipt: ['', [Validators.required, Validators.maxLength(15)]],
      insertionDate: [null, [Validators.required]],
      userInsertion: ['', [Validators.required, Validators.maxLength(30)]],
      notificationDate: [null, [Validators.required]],
      secureKey: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
    });

    if (this.dataCreate) {
      this.documentsDictumXStateMForm.patchValue(this.dataCreate);
      this.documentsDictumXStateMForm
        .get('insertionDate')
        .patchValue(new Date());
      this.documentsDictumXStateMForm
        .get('userInsertion')
        .patchValue(this.token.decodeToken().preferred_username);
    }

    if (this.documentsDictumXStateM != null) {
      console.log(this.documentsDictumXStateM);
      this.edit = true;
      this.documentsDictumXStateMForm.patchValue(this.documentsDictumXStateM);
      this.documentsDictumXStateMForm
        .get('key')
        .patchValue(this.documentsDictumXStateM.key.key);
      this.documentsDictumXStateMForm
        .get('expedientNumber')
        .patchValue(this.documentsDictumXStateM.expedientNumber);
      this.documentsDictumXStateMForm
        .get('stateNumber')
        .patchValue(this.documentsDictumXStateM.stateNumber);
    }
  }

  close() {
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
          const name = this.documentsDictumXStateMForm.get('userReceipt').value;
          const data = response.data.filter(m => {
            m.id == name;
          });
          console.log(data[0]);
          this.documentsDictumXStateMForm
            .get('userReceipt')
            .patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const data: IDocumentsDictumXStateM = this.documentsDictumXStateMForm.value;

    this.documentService
      .create(this.documentsDictumXStateMForm.value)
      .subscribe({
        next: data => {
          this.handleSuccess();
          this.alert('success', 'Se ha creado el documento correctamente.', '');
          this.loading = false;
          this.close();
        },
        error: error => {
          this.loading = false;
          this.onLoadToast(
            'error',
            ' Los Datos Ingresados son Incorrectos.',
            `Por favor de Verificar`
          );
          this.close();
        },
      });
  }

  update() {
    this.loading = true;

    this.documentService
      .update(this.documentsDictumXStateMForm.value)
      .subscribe({
        next: data => {
          // this.handleSuccess();
          this.alert(
            'success',
            'Se ha actualizado el documento correctamente.',
            ''
          );
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.alert('error', 'Error', 'Error actualizando documento');
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
}
