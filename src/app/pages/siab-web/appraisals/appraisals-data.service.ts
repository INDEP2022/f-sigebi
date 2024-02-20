import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppraisalsDataService {
  cancelsData: any[] = [];
  valuedsData: any[] = [];
  selectedRowsCancel: Array<any> = [];
  selectedRowsValues: Array<any> = [];
  constructor() {}
}
