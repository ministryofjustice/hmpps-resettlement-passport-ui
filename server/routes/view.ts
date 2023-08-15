export interface ErrorMessage {
  text: string
  href: string
}

export default interface View {
  get renderArgs(): { errors: ErrorMessage[] }
}
