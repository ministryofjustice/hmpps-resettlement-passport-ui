export type WorkerList = {
  assignedList: ResettlementWorker[]
  unassignedCount: number
}

type ResettlementWorker = {
  staffId: string
  firstName: string
  lastName: string
  count: number
}
