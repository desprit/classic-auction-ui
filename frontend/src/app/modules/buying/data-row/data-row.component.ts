import { Component, Input, Output, EventEmitter } from '@angular/core';

import { environment } from 'app/../environments/environment';

@Component({
  selector: '[appDataRow]',
  templateUrl: './data-row.component.html',
  styleUrls: ['./data-row.component.styl']
})
export class DataRowComponent {
  @Input() item: any;
  @Input() isNested: boolean;
  @Input() expanded: boolean = false;
  @Output() openHistory = new EventEmitter();
  public domain: string = environment.baseUrl;

  constructor() {}
  public onHistoryClick() {
    this.openHistory.emit(this.item.itemId);
  }
}
