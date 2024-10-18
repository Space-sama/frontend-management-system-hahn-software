import { Routes } from '@angular/router';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketFormComponent } from './tickets/ticket-form/ticket-form.component';

export const routes: Routes = [
  {
    path: "tickets",
    component: TicketsComponent
  },
  {
    path:"ticket-form",
    component: TicketFormComponent
  },
  {
    path:'ticket/:id',
    component: TicketFormComponent
}
];
