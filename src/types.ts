export interface Student {
  id: string;
  name: string;
  isAttending: boolean;
  paidAmount: number;
  oneLiner: string;
  messageToTeacher: string;
  isAnonymous: boolean;
  createdAt: number;
  order?: number;
  password?: string;
  teacherReply?: string;
  teacherReplyName?: string;
}

export interface AppConfig {
  teacherSurname: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventMapLink: string;
  totalBill: number;
  attendingFee: number;
  absentFee: number;
}
