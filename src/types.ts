export interface ChildGuest {
  id: string
  name: string
  age: string
}

export const AGE_PRESETS = ['1 ano', '2 anos', '3 anos', '4 anos', '5+ anos'] as const
export type QuickAgeOption = (typeof AGE_PRESETS)[number]

export interface RSVPData {
  id: string
  timestamp: string
  guestName: string
  phone: string
  attending: 'yes' | 'no'
  hasAdults: boolean
  adultGuests: string
  adultCount: number
  hasChildren: boolean
  children: ChildGuest[]
  message?: string
}
