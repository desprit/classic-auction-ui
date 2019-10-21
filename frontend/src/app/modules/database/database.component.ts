import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { Subject } from 'rxjs';

import { WowAHItem } from '../../../../../backend/src/shared/models/item.model';
import { ApiService } from 'app/shared/services/api.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.styl']
})
export class DatabaseComponent implements OnInit, OnDestroy {
  public updatedAt: string;
  public items: WowAHItem[];
  public totalItems: number = 0;
  public displayedColumns = [
    { width: '100px', label: 'icon' },
    { width: 'auto', label: 'name' },
    { width: '70px', label: 'count' },
    { width: '120px', label: 'bid' },
    { width: '120px', label: 'bid/1' },
    { width: '120px', label: 'buyout' },
    { width: '120px', label: 'buyout/1' },
    { width: '200px', label: 'updated' }
  ];
  public showOnlyLatestScan: boolean = true;
  private destroy$: Subject<boolean> = new Subject();
  private currentPage: number;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const page = params['page'] || 0;
      this.currentPage = page;
      this.searchPage(page, this.showOnlyLatestScan);
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
    this.searchPage(event.page, this.showOnlyLatestScan);
  }

  public onLatestScanChange(event) {
    this.searchPage(this.currentPage, this.showOnlyLatestScan);
  }

  private searchPage(page: number, onlyLatest: boolean) {
    this.databaseService.getItems(page, onlyLatest).subscribe(resp => {
      this.items = resp.items;
      this.totalItems = resp.totalItems;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
