import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';

import { BuyingService } from '../buying.service';
import { ApiService } from 'app/shared/services/api.service';

@Component({
  selector: 'app-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.styl']
})
export class TableControlsComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  public qualities: SelectItem[];
  public strategies: SelectItem[];
  public itemTypes: SelectItem[];
  public searchValue: string;
  public updatedAt: string;

  constructor(
    public apiService: ApiService,
    public buyingService: BuyingService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Request time of the most recent update
    this.apiService.getUpdateTime().subscribe(ts => {
      this.updatedAt = ts;
    });
    this.qualities = [
      { label: 'qualities (*)', value: '*' },
      { label: 'common', value: 'common' },
      { label: 'uncommon', value: 'uncommon' },
      { label: 'rare', value: 'rare' },
      { label: 'epic', value: 'epic' }
    ];
    this.itemTypes = [
      { label: 'item types (*)', value: '*' },
      { label: 'herbs', value: 'common' },
      { label: 'ores', value: 'uncommon' },
      { label: 'gear', value: 'rare' },
      { label: 'consumables', value: 'consumables' }
    ];
    this.strategies = [
      { label: 'strategies (*)', value: '*' },
      { label: 'buyouts', value: 'buyouts' },
      { label: 'bids', value: 'bids', disabled: true },
      { label: 'crafting', value: 'crafting', disabled: true }
    ];
    this.resetFilters();
  }

  /**
   * Reset all search filters
   */
  public resetFilters() {
    this.buyingService.selectedQuality = '*';
    this.buyingService.selectedItemsType = '*';
    this.buyingService.selectedStrategy = '*';
  }

  /**
   * Happens when user clicks reset button
   * Reset all search filters and query
   */
  public onResetClick() {
    this.buyingService.currentPage = 0;
    this.resetFilters();
    this.submit('');
    this.searchValue = '';
    // this.searchInput.nativeElement.value = '';
  }

  /**
   * Happens when autocomplete action is executed
   * Send API request to get suggestions
   */
  public onComplete(event: { originalEvent: any; query: string }) {
    this.buyingService.autocomplete(event.query).subscribe(suggestions => {
      this.buyingService.suggestions = suggestions;
    });
  }

  /**
   * Happens when user clicks suggestion
   * Send API request to get items
   */
  public onSuggestionSelected(value: string) {
    this.submit(value);
  }

  /**
   * Send API request to get items, update url query parameter
   */
  public submit(value: string) {
    this.buyingService.currentQuery = value;
    this.buyingService.getBuyingList();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { query: value, page: this.buyingService.currentPage },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Happens when user clears input field
   */
  public onClear() {
    this.submit('');
  }
}
