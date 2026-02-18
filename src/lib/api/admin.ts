import apiClient from "./client";
import type {
  PaginatedResponse,
  User,
  Provider,
  Booking,
  PqrsTicket,
  DashboardStats,
  ServiceCategory,
  Payment,
  BookingStatusHistory,
  Evidence,
} from "./types";

// ==========================================
// Dashboard
// ==========================================

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>("/admin/dashboard");
}

// ==========================================
// Users
// ==========================================

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<PaginatedResponse<User>> {
  return apiClient.get<PaginatedResponse<User>>("/admin/users", params);
}

export async function getUserDetail(id: string): Promise<User> {
  return apiClient.get<User>(`/admin/users/${id}`);
}

export async function updateUserStatus(
  id: string,
  status: string,
  reason?: string
) {
  return apiClient.patch(`/admin/users/${id}/status`, { status, reason });
}

// ==========================================
// Providers
// ==========================================

export async function getProviders(params: {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: string;
}): Promise<PaginatedResponse<Provider>> {
  return apiClient.get<PaginatedResponse<Provider>>("/admin/providers", params);
}

export async function getProviderDetail(id: string): Promise<Provider> {
  return apiClient.get<Provider>(`/admin/providers/${id}`);
}

// Verification
export async function getVerificationQueue(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Provider>> {
  return apiClient.get<PaginatedResponse<Provider>>("/verification", params);
}

export async function getVerificationDetail(id: string): Promise<Provider> {
  return apiClient.get<Provider>(`/verification/${id}`);
}

export async function approveVerification(id: string) {
  return apiClient.patch(`/verification/${id}/approve`);
}

export async function rejectVerification(id: string, reason: string) {
  return apiClient.patch(`/verification/${id}/reject`, { reason });
}

// ==========================================
// Bookings
// ==========================================

export async function getBookings(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedResponse<Booking>> {
  return apiClient.get<PaginatedResponse<Booking>>("/admin/bookings", params);
}

export async function getBookingDetail(id: string): Promise<Booking> {
  return apiClient.get<Booking>(`/admin/bookings/${id}`);
}

export async function getBookingTimeline(
  id: string
): Promise<BookingStatusHistory[]> {
  return apiClient.get<BookingStatusHistory[]>(
    `/admin/bookings/${id}/timeline`
  );
}

export async function getBookingEvidence(
  id: string
): Promise<Record<string, Evidence[]>> {
  return apiClient.get<Record<string, Evidence[]>>(
    `/admin/bookings/${id}/evidence`
  );
}

export async function cancelBooking(id: string, reason: string) {
  return apiClient.patch(`/admin/bookings/${id}/cancel`, { reason });
}

// ==========================================
// PQRS
// ==========================================

export async function getPqrs(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
}): Promise<PaginatedResponse<PqrsTicket>> {
  return apiClient.get<PaginatedResponse<PqrsTicket>>("/admin/pqrs", params);
}

export async function getPqrsDetail(id: string): Promise<PqrsTicket> {
  return apiClient.get<PqrsTicket>(`/admin/pqrs/${id}`);
}

export async function assignPqrs(id: string) {
  return apiClient.patch(`/admin/pqrs/${id}/assign`);
}

export async function respondPqrs(id: string, content: string) {
  return apiClient.post(`/admin/pqrs/${id}/respond`, { content });
}

export async function resolvePqrs(
  id: string,
  body: { resolutionType: string; refundAmount?: number; resolution: string }
) {
  return apiClient.patch(`/admin/pqrs/${id}/resolve`, body);
}

export async function escalatePqrs(id: string, reason: string) {
  return apiClient.patch(`/admin/pqrs/${id}/escalate`, { reason });
}

// ==========================================
// Settings
// ==========================================

export async function getCategories(): Promise<ServiceCategory[]> {
  return apiClient.get<ServiceCategory[]>("/admin/categories");
}

export async function createCategory(body: {
  name: string;
  slug: string;
  description: string;
}) {
  return apiClient.post("/admin/categories", body);
}

export async function updateCategory(
  id: string,
  body: { name?: string; description?: string }
) {
  return apiClient.patch(`/admin/categories/${id}`, body);
}

export async function toggleCategory(id: string) {
  return apiClient.patch(`/admin/categories/${id}/toggle`);
}

export async function createService(
  categoryId: string,
  body: { name: string; slug: string; description: string; basePrice?: number }
) {
  return apiClient.post(`/admin/categories/${categoryId}/services`, body);
}

export async function updateService(
  id: string,
  body: { name?: string; description?: string; basePrice?: number }
) {
  return apiClient.patch(`/admin/services/${id}`, body);
}

export async function getSystemConfig() {
  return apiClient.get<{ key: string; value: string }[]>("/admin/config");
}

export async function updateSystemConfig(body: Record<string, string>) {
  return apiClient.patch("/admin/config", body);
}

export async function createAdmin(body: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  return apiClient.post("/admin/admins", body);
}

// ==========================================
// Reports
// ==========================================

interface RevenueReport {
  totalRevenue: number;
  totalCommission: number;
  totalTransactions: number;
  daily: { date: string; revenue: number; commission: number }[];
}

interface BookingsReport {
  total: number;
  completed: number;
  cancelled: number;
  statusDistribution: { status: string; count: number }[];
  daily: { date: string; count: number }[];
}

interface ProvidersReport {
  totalProviders: number;
  verifiedProviders: number;
  averageRating: number;
  verificationDistribution: { status: string; count: number }[];
  topProviders: {
    name: string;
    totalBookings: number;
    rating: number;
    verified: boolean;
  }[];
}

export async function getRevenueReport(params: {
  startDate: string;
  endDate: string;
}): Promise<RevenueReport> {
  return apiClient.get<RevenueReport>("/admin/reports/revenue", params);
}

export async function getBookingsReport(params: {
  startDate: string;
  endDate: string;
}): Promise<BookingsReport> {
  return apiClient.get<BookingsReport>("/admin/reports/bookings", params);
}

export async function getProvidersReport(params: {
  startDate: string;
  endDate: string;
}): Promise<ProvidersReport> {
  return apiClient.get<ProvidersReport>("/admin/reports/providers", params);
}

// ==========================================
// Payments
// ==========================================

export async function getPayments(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedResponse<Payment>> {
  return apiClient.get<PaginatedResponse<Payment>>("/admin/payments", params);
}
