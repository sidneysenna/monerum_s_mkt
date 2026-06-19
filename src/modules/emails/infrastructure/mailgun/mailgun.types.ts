export interface MailgunSendMessageInput {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailgunSendMessageResult {
  id?: string;
  message?: string;
}
