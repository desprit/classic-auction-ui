import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyingService } from './buying.service';
import { Subject, fromEvent } from 'rxjs';

import { WowAHItem } from '../../../../../backend/src/shared/models/item.model';
import { ApiService } from 'app/shared/services/api.service';
import { filter, map, debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-buying',
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.styl']
})
export class BuyingComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  private destroy$ = new Subject<void>();
  public updatedAt: string;
  public items: WowAHItem[];
  public totalItems: number = 0;
  public displayedColumns = [
    { width: '80px', label: 'icon' },
    { width: 'auto', label: 'name' },
    { width: '70px', label: 'count' },
    { width: '90px', label: 'buyout' },
    { width: '90px', label: 'profit' },
    { width: '90px', label: 'profitPct' }
  ];
  public onlyBuyouts: boolean = true;
  private currentPage: number;
  private currentQuery: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private buyingService: BuyingService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const inputObservable = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      filter((e: KeyboardEvent) => !['Tab', 'AltLeft'].includes(e.code)),
      map((e: any) => e.target.value.trim()),
      debounceTime(500),
      filter((value: string) => value.length > 2)
    );
    inputObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => this.submit(value));
    this.activatedRoute.queryParams.subscribe(params => {
      const page = params['page'] || 0;
      const query = params['query'] || '';
      this.currentPage = page;
      this.currentQuery = query;
      this.searchPage(query, page);
    });
    this.apiService.getUpdateTime().subscribe(ts => {
      this.updatedAt = ts;
    });
  }

  public onPageChange(event) {
    this.currentPage = event.page;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: event.page },
      queryParamsHandling: 'merge' // remove to replace all query params by provided
    });
    this.searchPage(this.currentQuery, event.page);
  }

  public onOnlyBuyoutsChange() {
    console.log('123');
  }

  private searchPage(query: string, page: number) {
    this.buyingService.getBuyingList(query, page).subscribe(resp => {
      this.items = resp.items;
      this.totalItems = resp.totalItems;
      console.log(this.totalItems);
    });
  }

  private submit(value: string) {
    this.currentQuery = value;
    this.searchPage(value, this.currentPage);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { query: value },
      queryParamsHandling: 'merge' // remove to replace all query params by provided
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
