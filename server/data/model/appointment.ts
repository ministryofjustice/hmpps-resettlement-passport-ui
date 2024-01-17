export type Appointment = {
  title: string
  contact: string
  date?: string
  location?: AppointmentLocation
}

export type AppointmentLocation = {
  buildingName?: string
  buildingNumber?: string
  streetName?: string
  district?: string
  town?: string
  county?: string
  postcode?: string
  description?: string
}

export type Appointments = {
  results?: Appointment[]
  error?: string
}
