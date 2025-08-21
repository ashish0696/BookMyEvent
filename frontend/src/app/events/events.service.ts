import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface EventItem { id:number; title:string; location:string; startDateTime:string; seatMap:string[][]; imageUrl?: string }

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);
  base = 'http://localhost:3000';
  list(){ return this.http.get<any>(`${this.base}/events`).pipe(map(res => res.data)); }
  detail(id:number){ return this.http.get<any>(`${this.base}/events/${id}`).pipe(map(res => res.data[0])); }
  book(id:number, seatRow:number, seatCol:number){ return this.http.post<any>(`${this.base}/events/${id}/book`, { seatRow, seatCol }); }
  create(data:{title:string;location:string;startDateTime:string;rows:number;cols:number; imageUrl?: string}){ return this.http.post<any>(`${this.base}/events`, data).pipe(map(res => res.data[0])); }
  update(id:number, data:Partial<{title:string;location:string;startDateTime:string;rows:number;cols:number; imageUrl?: string}>){ return this.http.patch<any>(`${this.base}/events/${id}`, data).pipe(map(res => res.data[0])); }
  remove(id:number){ return this.http.delete<any>(`${this.base}/events/${id}`).pipe(map(res => res.data[0])); }
}
