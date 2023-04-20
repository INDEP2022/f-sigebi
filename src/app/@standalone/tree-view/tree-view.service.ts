import { Injectable } from '@angular/core';
import { ITreeItem } from 'src/app/core/interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class TreeViewService {
  selected: ITreeItem;
  constructor() {}
}
