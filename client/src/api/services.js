import API from "./axios";

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Donations
export const fetchAvailableDonations = () => API.get("/donations/available");
export const fetchMyDonations = () => API.get("/donations/my-donations");
export const createDonation = (data) => API.post("/donations", data);

// Requests
export const createRequest = (data) => API.post("/requests", data);
export const fetchMyRequests = () => API.get("/requests/ngo-requests");
export const fetchDonationRequests = () => API.get("/requests/donor-requests");
export const acceptRequest = (id) => API.put(`/requests/${id}/accept`);
export const rejectRequest = (id) => API.put(`/requests/${id}/reject`);

// Pickups & Deliveries
export const schedulePickup = (data) => API.post("/pickups", data);
export const fetchMyPickups = () => API.get("/pickups/ngo-pickups");
export const fetchAvailableDeliveries = () => API.get("/pickups/available-deliveries");
export const acceptDelivery = (id) => API.put(`/pickups/${id}/accept-delivery`);
export const fetchMyDeliveries = () => API.get("/pickups/my-deliveries");
export const updatePickupStatus = (id, status) => API.put(`/pickups/${id}/status`, { status });

// Admin
export const fetchAllUsers = () => API.get("/admin/users");
export const fetchAllDonations = () => API.get("/admin/donations");
export const fetchAllRequests = () => API.get("/admin/requests");
export const fetchAllPickups = () => API.get("/admin/pickups");