/**
 * Disposition targets
 */
export interface GoesToOption {
  id?: string, // GTO id (firebase doc ID)
  shortName: string,
  fullName?: string,
  uid?: string, // user ID in case the target is a user in the system
  categories: string[] // items this GTO is eleignle for
}
