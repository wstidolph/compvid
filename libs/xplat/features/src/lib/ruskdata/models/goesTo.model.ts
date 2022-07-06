/**
 * a specific targeting disposition
 */
export interface GoesTo {
  id?: string, // firestore key for teh GoesTo itself
  to: string, // short name or initials of person
  toId?: string, //user ID of the target, optional because might not be a system user
  toFullname?:string, // longer name
  accordingTo: string, // short name for gratnor
  accordingToId: string // user ID of grantor
}
