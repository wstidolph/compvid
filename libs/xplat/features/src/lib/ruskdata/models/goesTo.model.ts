/**
 * a specific targeting disposition
 */
export interface GoesTo {
  id?: string, // firebase key for the GoesTo itself
  gtoId?: string, // firebase key to the goesToOption
  shortName: string, // short name or initials of person
  toId?: string, //user ID of the target, optional because might not be a system user
  toFullname?:string, // longer name
  accordingTo: string, // short name for gratnor
  accordingToId: string // user ID of grantor
}
