import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { ILot } from '../../models/ms-lot/lot.model';
@Injectable({
  providedIn: 'root',
})

export class LotService  extends HttpService {
    constructor(){
        super();
        this.microservice = LotEndpoints.BasePath;
    }

    getLotbyEvent(id: string | number, params?: ListParams) {
        const route = `${LotEndpoints.ComerLot}?filter.idEvent=${id}`; 
        return this.get(route, params);
    }
}