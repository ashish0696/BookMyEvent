import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EventsService, EventItem } from '../events.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css'
})
export class EventsListComponent implements OnInit {
  events: EventItem[] = [];
  filteredEvents: EventItem[] = [];
  searchTerm: string = '';
  loading = true;
  constructor(private eventsSvc:EventsService, private router:Router){}
  ngOnInit() {
    this.eventsSvc.list().subscribe({
      next: res => {
        if (res.error) {
          // Error can be shown in the template or handled otherwise
          setTimeout(() => { this.loading = false; }, 1000);
        } else {
          this.events = res;
          this.filteredEvents = res;
          setTimeout(() => { this.loading = false; }, 1000);
        }
      },
      error: err => {
  // Error can be shown in the template or handled otherwise
        setTimeout(() => { this.loading = false; }, 1000);
      }
    });
  }

  filterEvents() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term) ||
        (e.startDateTime && e.startDateTime.toString().toLowerCase().includes(term))
      );
    }
  }
  select(e:EventItem, ev:Event){
    ev.stopPropagation();
    const token = sessionStorage.getItem('jwt');
    if(!token){
      // require login before booking
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/events/${e.id}` } });
      return;
    }
    // already authenticated: navigate to event detail where booking UI exists
    this.router.navigate(['/events', e.id]);
  }
  open(e:EventItem){ this.router.navigate(['/events', e.id]); }
}
