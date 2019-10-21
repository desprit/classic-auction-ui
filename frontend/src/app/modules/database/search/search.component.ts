import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, map, debounceTime, takeUntil } from 'rxjs/operators';

import { ApiService } from 'app/shared/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.styl']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

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
  }

  private submit(value: string) {
    this.apiService.search(value).subscribe(resp => console.log(resp));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
