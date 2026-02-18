// ==========================================
// Generic
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==========================================
// Enums (mirror Prisma)
// ==========================================

export type UserRole = "CLIENT" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export type VerificationStatus =
  | "PENDING_DOCUMENTS"
  | "DOCUMENTS_SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type DocumentType =
  | "CEDULA_FRONT"
  | "CEDULA_BACK"
  | "SELFIE_WITH_CEDULA"
  | "RUT"
  | "CERTIFICATION"
  | "ANTECEDENTES"
  | "BANK_CERTIFICATE";

export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type BookingStatus =
  | "REQUESTED"
  | "QUOTED"
  | "ACCEPTED"
  | "PROVIDER_EN_ROUTE"
  | "IN_PROGRESS"
  | "EVIDENCE_UPLOADED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type CancelledBy = "CLIENT" | "PROVIDER" | "ADMIN" | "SYSTEM";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED"
  | "EXPIRED";

export type EvidenceType = "BEFORE" | "DURING" | "AFTER" | "DISPUTE";

export type PqrsType = "PETITION" | "COMPLAINT" | "CLAIM" | "SUGGESTION";

export type PqrsStatus =
  | "OPEN"
  | "IN_REVIEW"
  | "WAITING_RESPONSE"
  | "ESCALATED"
  | "RESOLVED"
  | "REOPENED"
  | "CLOSED";

export type PqrsPriority = "HIGH" | "MEDIUM" | "LOW";

export type PqrsResolutionType =
  | "FULL_REFUND"
  | "PARTIAL_REFUND"
  | "NO_REFUND"
  | "CREDIT"
  | "SUSPENSION";

export type SenderRole = "CLIENT" | "PROVIDER" | "ADMIN";

// ==========================================
// Models
// ==========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  // Populated by getUserDetail
  provider?: Provider | null;
  bookingsAsClient?: Booking[];
  reviews?: Review[];
}

export interface Provider {
  id: string;
  userId: string;
  bio?: string | null;
  verificationStatus: VerificationStatus;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  address?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  documents?: ProviderDocument[];
  bankAccount?: BankAccount | null;
  services?: ProviderService[];
}

export interface ProviderDocument {
  id: string;
  providerId: string;
  type: DocumentType;
  url: string;
  status: DocumentStatus;
  rejectionReason?: string | null;
  uploadedAt: string;
  reviewedAt?: string | null;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  documentType: string;
  documentNumber: string;
  isVerified: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  services?: Service[];
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice?: number | null;
  isActive: boolean;
  category?: ServiceCategory;
}

export interface ProviderService {
  id: string;
  providerId: string;
  serviceId: string;
  price: number;
  description?: string | null;
  isActive: boolean;
  service?: Service;
}

export interface Booking {
  id: string;
  clientId: string;
  providerId?: string | null;
  serviceId?: string | null;
  categoryId?: string | null;
  status: BookingStatus;
  address: string;
  scheduledAt: string;
  description: string;
  quotedPrice?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  cancelledBy?: CancelledBy | null;
  createdAt: string;
  updatedAt: string;
  client?: User;
  provider?: Provider;
  service?: Service;
  category?: ServiceCategory;
  payment?: Payment | null;
  evidences?: Evidence[];
  statusHistory?: BookingStatusHistory[];
  review?: Review | null;
  pqrsTickets?: PqrsTicket[];
}

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  fromStatus?: BookingStatus | null;
  toStatus: BookingStatus;
  changedBy: string;
  note?: string | null;
  createdAt: string;
  user?: User;
}

export interface Payment {
  id: string;
  bookingId: string;
  externalId?: string | null;
  method?: string | null;
  status: PaymentStatus;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  providerAmount: number;
  currency: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface Evidence {
  id: string;
  bookingId: string;
  type: EvidenceType;
  url: string;
  thumbnailUrl?: string | null;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  client?: User;
}

export interface PqrsTicket {
  id: string;
  radicado: string;
  bookingId?: string | null;
  createdById: string;
  assignedToId?: string | null;
  type: PqrsType;
  category: string;
  subject: string;
  status: PqrsStatus;
  priority: PqrsPriority;
  resolution?: string | null;
  resolutionType?: PqrsResolutionType | null;
  refundAmount?: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  booking?: Booking;
  createdBy?: User;
  assignedTo?: User | null;
  messages?: PqrsMessage[];
}

export interface PqrsMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: SenderRole;
  content: string;
  createdAt: string;
  sender?: User;
  attachments?: PqrsAttachment[];
}

export interface PqrsAttachment {
  id: string;
  messageId: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

// ==========================================
// Dashboard
// ==========================================

export interface StatValue {
  value: number;
  change?: number;
}

export interface DashboardStats {
  stats: {
    activeBookings: StatValue;
    todayRevenue: StatValue;
    newUsersToday: StatValue;
    openPqrs: StatValue;
    pendingVerifications: StatValue;
    totalUsers: StatValue;
    totalProviders: StatValue;
  };
  charts: {
    weeklyBookings: {
      currentWeek: { date: string; count: number }[];
      previousWeek: { date: string; count: number }[];
    };
    statusDistribution: { status: string; count: number }[];
    dailyRevenue: { date: string; total: number }[];
  };
  recentActivity: {
    type: string;
    message: string;
    time: string;
  }[];
}
