import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription, Subject, Observable } from 'rxjs';
import { filter, map, debounceTime } from 'rxjs/operators';
import { ApiService } from 'app/shared/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.styl']
})
export class SearchComponent implements OnInit {
  private reset = new Subject<any>();
  private reset$ = this.reset.asObservable();
  private resetSubscription: Subscription;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.resetSubscription = this.reset$.subscribe(() => {
      this.searchInput.nativeElement.value = '';
    });
    const inputObservable = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      filter((e: KeyboardEvent) => !['Tab', 'AltLeft'].includes(e.code)),
      map((e: any) => e.target.value.trim()),
      debounceTime(500),
      filter((value: string) => value.length > 2)
    );
    inputObservable.subscribe((value: string) => this.submit(value));
  }

  private submit(value: string) {
    this.apiService.search(value).subscribe(resp => console.log(resp));
  }

  private resetInput() {
    this.reset.next();
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }
}
