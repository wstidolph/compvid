export interface GoesTo {
  id?: string, // firestore key
  to: string, // short name or initials of person
  fullnameTo?:string, // longer name
  accordingTo: string
}
