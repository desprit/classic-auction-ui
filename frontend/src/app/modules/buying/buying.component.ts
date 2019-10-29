import { Component, OnInit, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { formatDate } from '@angular/common';

import { BuyingService } from './buying.service';
import { convertToGold } from '../../../../../backend/src/shared/utils';

const COLORS = {
  max: '#ff0000',
  min: '#00ff00',
  avg: '#0000ff'
};

@Component({
  selector: 'app-buying',
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.styl']
})
export class BuyingComponent implements OnInit, OnDestroy {
  public displayedColumns: { width: string; label: string }[];
  public showInfoDialog: boolean;
  public data: any;
  public options: any;
  public expandedRows: string[];
  private destroy$ = new Subject<void>();

  constructor(
    public buyingService: BuyingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit() {
    this.expandedRows = [];
    this.data = {
      labels: [],
      datasets: []
    };
    this.showInfoDialog = false;
    this.buyingService.totalItems = 0;
    this.displayedColumns = [
      { width: '80px', label: 'icon' },
      { width: 'auto', label: 'name' },
      { width: '70px', label: 'count' },
      { width: '120px', label: 'buyout' },
      { width: '120px', label: 'profit' },
      { width: '80px', label: 'profitPct' },
      { width: '80px', label: 'history' }
    ];
    // Get items for the current page
    this.activatedRoute.queryParams.subscribe(params => {
      const page = params['page'] || 0;
      const query = params['query'] || '';
      this.buyingService.searchValue = query;
      this.buyingService.currentPage = page;
      this.buyingService.currentQuery = query;
      this.buyingService.getBuyingList();
    });
    this.options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (value: number) => {
                return convertToGold(value);
              }
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              callback: (value: number) => {
                return formatDate(value * 1000, 'MMM-dd HH:mm', 'en-EN');
              }
            }
          }
        ]
      }
    };
  }

  /**
   * Happens when user the arrow down icon
   * Expand the row
   */
  public onExpandRowClick(itemId: string) {
    if (this.expandedRows.includes(itemId)) {
      this.expandedRows = this.expandedRows.filter(i => i !== itemId);
    } else {
      this.expandedRows.push(itemId);
    }
  }

  /**
   * Happens when user clicks pagination buttons
   * Change page, update url page parameter and request items from API
   */
  public onPageChange(event) {
    this.expandedRows = [];
    this.buyingService.currentPage = event.page;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: event.page },
      queryParamsHandling: 'merge'
    });
    this.buyingService.getBuyingList();
  }

  /**
   * Happens when user clicks row info icon
   * Open dialog with additional info for the row
   */
  public openHistory(itemId: string) {
    this.buyingService.getItemsHistory(itemId).subscribe(resp => {
      const newData = {
        labels: resp.history.map(h => h.updatedAt),
        datasets: ['min', 'avg', 'max'].map(t => {
          return {
            label: t,
            data: resp.history.map(h => h[t]),
            fill: false,
            borderColor: COLORS[t]
          };
        })
      };
      this.data = newData;
      this.showInfoDialog = true;
    });
  }

  /**
   * Unsubscribe before exit
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
