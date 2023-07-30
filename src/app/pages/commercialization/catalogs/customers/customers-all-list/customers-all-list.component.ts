import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CUSTOMERS_LIST_COLUMNS } from '../customers-black-list/customers-list-columns';

@Component({
  selector: 'app-customers-all-list.component',
  templateUrl: './customers-all-list.component.html',
  styles: [],
})
export class CustomersAllListComponent extends BasePage implements OnInit {
  title: string = 'Todos los Clientes';
  customers: IRepresentative[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  edit: boolean = false;

  constructor(
    private customerService: CustomerService,
    private excelService: ExcelService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = CUSTOMERS_LIST_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'reasonName':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'maternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'blackList':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getCustomers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCustomers());
  }

  //Tabla con todos los clientes
  getCustomers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.customerService.getAllClients(params).subscribe({
      next: response => {
        this.customers = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Exportar lista blanca de clientes
  exportSelected(): void {
    const data = this.customers.map((row: any) => this.transFormColums(row));
    this.excelService.exportAsExcelFile(data, 'TodosLosClientes');
  }

  private transFormColums(row: any) {
    return {
      'Clave Cliente': row.id,
      'Nombre o Razón Social': row.reasonName,
      RFC: row.rfc,
      Calle: row.street,
      Ciudad: row.city,
      Colonia: row.colony,
      Delegación: row.delegation,
      'Código Postal': row.zipCode,
      País: row.country,
      Fax: row.fax,
      'Clave Vendedor': row.sellerId,
      Teléfono: row.phone,
      'E-mail': row.mailWeb,
      Estado: row.state,
      CURP: row.curp,
      'Lista Negra': row.blackList,
      'Apellido Paterno': row.paternalSurname,
      'Apellido Materno': row.maternalSurname,
      'Clave Municipal': row.municipalityId,
      'Clave Estatal': row.stateId,
      'Fecha de Lista Negra': row.blackListDate,
      'Fecha de Liberación': row.releaseDate,
      'Clave de Penalización': row.penaltyId,
      'Tipo de Persona': row.personType,
      'RFC Aprobado': row.approvedRfc,
      'Usuario Liberado': row.userFree,
      'Fecha Libera': row.freeDate,
      'No. Registro': row.registryNumber,
      'Clave de Actividad Económica': row.economicAgreementKey,
      'Tipo de Identificación': row.identificationType,
      'No. Identificación': row.identificationNumber,
      'Clave de Representante': row.agentId,
      'No. Exterior': row.outsideNumber,
      'No. Interior': row.insideNumber,
      Contraseña: row.password,
      Usuario: row.user,
      'CLABE Interbancaria': row.interbankKey,
      Banco: row.bank,
      Sucursal: row.branch,
      'Cuenta de Cheques': row.checksAccount,
      'Fecha Inicial de Penalización': row.penaltyInitDate,
      'Usuario Penalizado': row.penalizeUser,
    };
  }

  close() {
    this.modalRef.hide();
  }
}
