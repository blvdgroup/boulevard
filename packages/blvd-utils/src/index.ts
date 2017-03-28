export enum Status {
  SUCCESS,
  FAILURE
}

export interface Result {
  status: Status,
  error?: string
}

export const reduceResults = (a: Result, b: Result) => a.status === Status.SUCCESS && b.status === Status.SUCCESS
    ? ({ status: Status.SUCCESS })
    : ({ status: Status.FAILURE, error: a.error || b.error })
