type severity = "error" | "warning" | "info" | "success";

export default class AlertMessageFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(public severity: severity, public text: string) {}
}
