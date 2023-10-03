import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { LoanDocumentModalComponent } from '../loan-document-modal/loan-document-modal.component';
import { LoanDocumentSelectModalComponent } from '../loan-document-select-modal/loan-document-select-modal.component';
import { LOAN_DOCUMENT_COLUMNS } from './loan-monitor-columns';

@Component({
  selector: 'app-loan-document',
  templateUrl: './loan-document.component.html',
  styles: [],
})
export class LoanDocumentComponent extends BasePage implements OnInit {
  userFor: DefaultSelect = new DefaultSelect();
  user1: DefaultSelect = new DefaultSelect();
  user2: DefaultSelect = new DefaultSelect();
  departament = new DefaultSelect();
  areaSele = new DefaultSelect();
  form: FormGroup;
  data1: any[] = [];
  dataLocal: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  idloan: any;
  neworsave = 'Nuevo';
  idfile: any;
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private parametersService: ParametersService,
    private departamentService: DepartamentService,
    private expedientService: ExpedientService,
    private sanitizer: DomSanitizer,
    private siabService: SiabService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: LOAN_DOCUMENT_COLUMNS,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delet: true,
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.filterA();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      loanTo: [null, [Validators.required]],
      loanFor: [null, [Validators.required]],
      area: [null, [Validators.required]],
      AssignedTo: [null, [Validators.required]],
      NoLoans: [null],
      loanDate: [null],
      document: [null, Validators.required],
      adscritTo: [null, Validators.required],
      observations: [null, Validators.required],
    });
  }

  getAllSegUser1(params: ListParams) {
    console.log('params: ', params);
    delete params['filter.name.$ilike:'];
    let name = params['search'];
    this.usersService.getAllSegUsers3(params, name).subscribe({
      next: resp => {
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  getAllSegUser2(params: ListParams) {
    console.log('params: ', params);
    delete params['filter.name.$ilike:'];
    let name = params['search'];
    this.usersService.getAllSegUsers3(params, name).subscribe({
      next: resp => {
        this.user2 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user2 = new DefaultSelect();
      },
    });
  }

  getAllCatDepataments(params: ListParams) {
    console.log('params: ', params);
    delete params['filter.dsarea.$ilike:'];
    let name = params['search'];
    this.departamentService.getAllDepartament(params, name).subscribe({
      next: resp => {
        this.departament = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.departament = new DefaultSelect();
      },
    });
  }

  getAllAreaDepataments(params: ListParams) {
    console.log('params: ', params);
    delete params['filter.description.$ilike:'];
    let name = params['search'];
    this.departamentService.getAllDepartamentByname(params, name).subscribe({
      next: resp => {
        this.areaSele = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.areaSele = new DefaultSelect();
      },
    });
  }

  openSelect(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, loanNumber?: any, recordNumber?: any) => {
          console.log('callback ', loanNumber, ' ', recordNumber);

          if (loanNumber != null) {
            console.log('si hay id');
            this.prepareForm();
            this.loadDocumentSelected(loanNumber, recordNumber);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LoanDocumentSelectModalComponent, config);
  }

  loadDocumentSelected(loanNumber: number, recordNumber: number) {
    this.documentsService
      .getDocumentLoanByRecordAndLoan(loanNumber, recordNumber)
      .subscribe({
        next: response => {
          console.log('response => ', response);
          this.idfile = response.data[0].recordNumber;
          this.idloan = response.data[0].loanNumber;
          this.loadTable(response.data[0].loanNumber);
          this.loadUserFor(response.data[0].loanUser);
          this.loadUserTo(response.data[0].userReceives);
          this.loadDepartament(
            response.data[0].departmentLoanNumber,
            response.data[0].delegationLoanNumber,
            response.data[0].subdelegationLoanNumber
          );
          this.loadcveArea(response.data[0].cveAreaReceives);
          this.form.patchValue({
            observations: response.data[0].observations,
            loanDate: response.data[0].loanDate,
            NoLoans: response.data[0].loanNumber,
          });
        },
      });
  }

  loadUserFor(user: any) {
    this.usersService.getAllSegUsers4(user).subscribe({
      next: response => {
        //debugger;
        this.user1 = new DefaultSelect(response.data, response.count);
        console.log('response user For ', response, this.user1);
        this.form.get('loanFor').setValue(response.data[0].user);
      },
    });
  }

  loadUserTo(user: any) {
    this.usersService.getAllSegUsers4(user).subscribe({
      next: response => {
        this.user2 = new DefaultSelect(response.data, response.count);
        console.log('response user To ', response, this.user2);
        this.form.get('loanTo').setValue(response.data[0].user);
      },
    });
  }

  loadDepartament(
    departmentLoanNumber: any,
    delegationLoanNumber: any,
    subdelegationLoanNumber: any
  ) {
    let date = this.obtenerFechaActualEnFormatoDeseado();
    this.parametersService.getFaStageCreda(date).subscribe({
      next: response => {
        console.log('REsponse Etapa Edo ', response);
        this.departamentService
          .getAllDepartamentByparams(
            departmentLoanNumber,
            delegationLoanNumber,
            subdelegationLoanNumber,
            response.stagecreated
          )
          .subscribe({
            next: respon => {
              console.log('response load departament ', respon);
              this.departament = new DefaultSelect(respon.data, respon.count);
              this.form.get('AssignedTo').setValue(respon.data[0].id);
            },
          });
      },
    });
  }

  loadcveArea(cve: any) {
    this.departamentService.getDepartamentBycve(cve).subscribe({
      next: respon => {
        console.log('response load departament ', respon);
        this.areaSele = new DefaultSelect(respon.data, respon.count);
        this.form.get('area').setValue(respon.data[0].dsarea);
      },
    });
  }

  obtenerFechaActualEnFormatoDeseado(): string {
    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Se suma 1 al mes, ya que los meses en JavaScript van de 0 a 11.
    const día = String(fechaActual.getDate()).padStart(2, '0');

    const fechaEnFormatoDeseado = `${año}-${mes}-${día}`;

    return fechaEnFormatoDeseado;
  }

  loadTable(id: any) {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.data1 = [];
    this.dataLocal.load(this.data1);
    this.expedientService.getDocumentsLoans(this.idloan, params).subscribe({
      next: response => {
        console.log('respuesta tabla load --> ', response);
        for (let i = 0; i < response.data.length; i++) {
          let params = {
            folio: response.data[i].universal_folio,
            noRecord: response.data[i].no_file,
            documentType: response.data[i].document_type_description,
            documentDescription: response.data[i].document_description,
            devolutionDate: response.data[i].date_return_theoretical,
            devolutionDateReal: response.data[i].actual_return_date,
            no_loan: response.data[i].no_loan,
          };
          this.data1.push(params);
          this.dataLocal.load(this.data1);
          this.dataLocal.refresh;
          this.totalItems = response.count;
        }
      },
    });
  }

  filterA() {
    this.dataLocal
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'noRecord':
                field = 'filter.no_file';
                searchFilter = SearchFilter.EQ;
                break;
              case 'documentType':
                field = 'filter.document_type_description';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'documentDescription':
                field = 'filter.document_description';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'devolutionDate':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  field = 'filter.date_return_theoretical';
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'devolutionDateReal':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  field = 'filter.actual_return_date';
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.loadTable(this.idloan);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadTable(this.idloan));
  }

  newOrden() {
    if (this.neworsave == 'Nuevo') {
      this.form.reset();
      this.data1 = [];
      this.dataLocal.load(this.data1);
      this.neworsave = 'Guardar';
    } else if (this.neworsave == 'Guardar') {
      if (this.form.get('area').value == null) {
        this.alert('warning', 'Alerta', 'Seleccione un Area');
      } else if (this.form.get('AssignedTo').value == null) {
        this.alert('warning', 'Alerta', 'Selecciones a quien esta Adscrito');
      } else if (this.form.get('observations').value == null) {
        this.alert('warning', 'Alerta', 'Es necesaria una observación');
      } else if (this.form.get('loanFor').value == null) {
        console.log('loanFor ', this.form.get('loanFor').value);
        this.alert('warning', 'Alerta', 'Seleccione para quien es el préstamo');
      } else if (this.form.get('loanTo').value == null) {
        this.alert('warning', 'Alerta', 'Seleccione quien recibe');
      } else {
        let iddepartament = this.form.get('AssignedTo').value;
        this.getdepartament(iddepartament);
      }
    }
  }

  getdepartament(id: any) {
    this.departamentService.getDepartamentById(id).subscribe({
      next: respon => {
        console.log('response ==> ', respon);
        this.postPDD(
          respon.data[0].numDelegation,
          respon.data[0].numSubDelegation.id
        );
      },
    });
  }

  postPDD(delegation: any, subdelegation: any) {
    let params = {
      delegationLoanNumber: delegation,
      subdelegationLoanNumber: subdelegation,
      departmentLoanNumber: this.form.get('AssignedTo').value,
      loanUser: this.form.get('loanFor').value,
      loanDate: new Date(),
      observations: this.form.get('observations').value,
      userReceives: this.form.get('AssignedTo').value,
      cveAreaReceives: this.form.get('area').value,
    };
    this.documentsService.postDocumentsLoan(params).subscribe({
      next: response => {
        console.log('response Post -->', response);
        this.alert('success', 'Exitoso!', 'Se creo el registro exitosamente!');
        this.neworsave = 'Nuevo';
        this.idfile = response.recordNumber;
        this.idloan = response.loanNumber;
        const Real =
          response.loanDate != null ? new Date(response.loanDate) : null;
        const formattedfecReal = Real != null ? this.formatDate(Real) : null;
        this.form.patchValue({
          NoLoans: response.loanNumber,
          loanDate: formattedfecReal,
        });
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  cancelSave() {
    this.form.reset();
    this.neworsave = 'Nuevo';
  }

  formData(status: any) {
    console.log('status --->', status);
    this.openEdit(status);
  }

  openEdit(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, si: boolean) => {
          if (next == true && si == true) {
            console.log('es true');
            this.loadTable(this.idloan);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LoanDocumentModalComponent, config);
  }

  openNew(data?: any) {
    data = null;
    let config: ModalOptions = {
      initialState: {
        idloan: this.idloan,
        data,
        callback: (next: boolean, si: boolean) => {
          if (next == true && si == true) {
            console.log('es true');
            this.loadTable(this.idloan);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LoanDocumentModalComponent, config);
  }

  validImpresion() {
    let iddepartament = this.form.get('AssignedTo').value;
    this.departamentService.getDepartamentById(iddepartament).subscribe({
      next: respon => {
        console.log('response ==> ', respon);
        this.imprimir(
          respon.data[0].numDelegation,
          respon.data[0].numSubDelegation.id
        );
      },
    });
  }

  imprimir(numDelegation: any, numSubDelegation: any) {
    //let LV_USUARIO = this.form.get('loanFor').value + '' + this.form.get('dsarea').value
    let params = {
      p_no_expediente: this.idfile,
      p_usuario_prestamo: this.form.get('loanFor').value,
      p_no_prestamo: this.idloan,
      p_area: this.form.get('area').value,
      pn_deleg: numDelegation,
      pn_subdel: numSubDelegation,
    };
    this.siabService
      .fetchReport('RGERARGGUARDAVALO', params)
      // .fetchReportBlank('blank')
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
