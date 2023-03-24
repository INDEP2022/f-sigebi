import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPaymentConcept } from '../../models/catalogs/payment-concept.model';
@Injectable({
  providedIn: 'root',
})
export class PaymentConceptService
  extends HttpService
  implements ICrudMethods<IPaymentConcept>
{
  private readonly route: string = ENDPOINT_LINKS.PaymentConcept;
  constructor(private paymentConceptRepository: Repository<IPaymentConcept>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IPaymentConcept>> {
    return this.paymentConceptRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IPaymentConcept> {
    return this.paymentConceptRepository.getById(this.route, id);
  }

  create(model: IPaymentConcept): Observable<IPaymentConcept> {
    return this.paymentConceptRepository.create(this.route, model);
  }

  update(id: string | number, model: IPaymentConcept) {
    const route = `${ENDPOINT_LINKS.PaymentConcept}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.paymentConceptRepository.remove(this.route, id);
  }
}
