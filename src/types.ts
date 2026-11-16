export interface ChildGuest {
  id: string
  name: string
  age: string
}

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
