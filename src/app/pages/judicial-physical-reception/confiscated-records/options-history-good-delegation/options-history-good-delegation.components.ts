import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDetailWithIndEdo } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SelectElementComponent } from 'src/app/shared/components/select-element-smarttable/select-element';

@Component({
    selector: 'app-options-history-good-delegation',
    templateUrl: './option-history-good-delegation.component.html',
    styleUrls: []
})

export class OptionsHistoryGoodDelegation extends BasePage implements OnInit {
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    
}