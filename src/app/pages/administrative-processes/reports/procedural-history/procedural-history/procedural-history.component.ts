import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

//Services
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-procedural-history',
  templateUrl: './procedural-history.component.html',
  styles: [],
})
export class ProceduralHistoryComponent extends BasePage implements OnInit {
  proceduralHistoryForm: ModelForm<any>;
  fromF: string = '';
  toT: string = '';
  isLoading = false;

  @Output() submit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private usersService: UsersService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private datePipe: DatePipe
  ) {
    super();
  }

  users$ = new DefaultSelect<ISegUsers>();

  filterForm: FormGroup = this.fb.group({
    user: [null],
  });

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.proceduralHistoryForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      modificationDateOf: [null, Validators.required],
      modificationDateTo: [null, Validators.required],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
    });
  }
  onSubmit() {
    if (!this.validarFechas()) {
      let params = {
        NO_BIEN_INI: this.proceduralHistoryForm.value.ofTheGood,
        NO_BIEN_FIN: this.proceduralHistoryForm.value.toGood,
        NO_DELEGACION: this.proceduralHistoryForm.value.delegation,
        NO_SUBDELSUBDELEGACION: this.proceduralHistoryForm.value.subdelegation,
        USUARIO: this.filterForm.value.user,
      };
      this.siabService
        .fetchReport('RGENADBSITPROCESB', params)
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
  }
  getUsers($params: ListParams) {
    console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          user.id = user.id;
          console.log('user ', user);
          return user;
        });

        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }

  cleanForm() {
    this.proceduralHistoryForm.reset();
    this.filterForm.reset();
  }

  validarFechas() {
    this.fromF = this.proceduralHistoryForm.value.modificationDateOf;
    this.toT = this.proceduralHistoryForm.value.modificationDateTo;
    if (this.fromF > this.toT) {
      this.onLoadToast(
        'warning',
        'La fecha final no puede ser menor a la incial'
      );
      return true;
    }
    return false;
  }
}
