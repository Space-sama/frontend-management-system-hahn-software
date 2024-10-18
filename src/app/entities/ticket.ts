export interface Ticket {

  id: any;
  description: string;
  status: 'Open' | 'Closed';
  date: Date;

}
