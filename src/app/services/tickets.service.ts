import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ticket } from '../entities/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private webApiUrl = 'http://localhost:5109/api/Ticket';
  constructor(private httpClient: HttpClient) { }

    getAllTickets(): Observable<Ticket[]> {
      return this.httpClient.get<Ticket[]>(this.webApiUrl).pipe(
        map(tickets => tickets.map(ticket => ({
          ...ticket
        })))
      );
    }

    addOneTicket = (data:Ticket) => this.httpClient.post(this.webApiUrl, data);

    getOneTicket = (id:number):Observable<Ticket> => this.httpClient.get<Ticket>(this.webApiUrl+'/'+id);

    deleteOneTicket = (id:number) => this.httpClient.delete(this.webApiUrl+'/'+id);

    editOneTicket=(id:number, data:Ticket):Observable<Ticket>=> this.httpClient.put<Ticket>(this.webApiUrl+'/'+id, data);
}

