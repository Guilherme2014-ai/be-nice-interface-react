export default interface IAlertMessage {
  severity: "error" | "warning" | "info" | "success";
  text: string;
}
