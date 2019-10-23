import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { BuyingService } from './buying.service';

@Component({
  selector: 'app-buying',
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.styl']
})
export class BuyingComponent implements OnInit, OnDestroy {
  public displayedColumns: { width: string; label: string }[];
  public showInfoDialog: boolean;
  public data: any;
  private destroy$ = new Subject<void>();

  constructor(
    public buyingService: BuyingService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#565656'
        }
      ]
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
      this.buyingService.currentPage = page;
      this.buyingService.currentQuery = query;
      this.buyingService.getBuyingList();
    });
  }

  /**
   * Happens when user clicks pagination buttons
   * Change page, update url page parameter and request items from API
   */
  public onPageChange(event) {
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
  public onHistoryClick(itemId: string) {
    console.log(itemId);
    this.showInfoDialog = true;
  }

  /**
   * Unsubscribe before exit
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
