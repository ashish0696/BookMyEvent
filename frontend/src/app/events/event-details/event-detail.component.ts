import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, EventItem } from '../events.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-event-detail',
		standalone: true,
		imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
	templateUrl: './event-detail.html',
	styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit {
	event?: EventItem; loading = true;
	constructor(private route: ActivatedRoute, private events: EventsService, private router: Router) {}
	ngOnInit(){
		const id = Number(this.route.snapshot.paramMap.get('id'));
		this.events.detail(id).subscribe({
			next: res => {
				if (res?.error) {
					this.loading = false;
				} else {
					this.event = res;
					this.loading = false;
				}
			},
			error: () => { this.loading = false; }
		});
	}

	goToBooking(){
		if(!this.event) return;
		const token = sessionStorage.getItem('jwt');
		if(!token){
			this.router.navigate(['/login'], { queryParams: { returnUrl: `/events/${this.event.id}/book` } });
			return;
		}
		this.router.navigate(['/events', this.event.id, 'book']);
	}
		back(){ this.router.navigate(['/events']); }
}
