import axios from "axios";
import {
  createSupportTicket,
  fetchMyTickets,
  fetchMyTicketById,
  replyToMyTicket,
  trackPublicTicket,
} from "./ticketApi";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  get: jest.fn(),
  post: jest.fn(),
}));

describe("Support Ticketing System (Requirements 14-2 & 14-3) Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("createSupportTicket", () => {
    test("sends JSON POST request when no attachments are passed", async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: { ticketNumber: "TCK-20260814-7083", status: "Open" },
        },
      });

      const payload = {
        subject: "Unable to upload resume",
        description: "Timeout error on checkout",
        category: "Technical",
        priority: "Medium",
        email: "candidate@example.com",
      };

      const res = await createSupportTicket(payload);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0][0]).toContain("tickets");
      expect(axios.post.mock.calls[0][1]).toEqual(payload);
      expect(res.data.success).toBe(true);
    });
  });

  describe("fetchMyTickets & fetchMyTicketById", () => {
    test("fetchMyTickets issues GET request with query params", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: [{ ticketNumber: "TCK-1" }] },
      });

      localStorage.setItem("token", "user_jwt_token");

      const res = await fetchMyTickets({ page: 1, limit: 10, status: "Open" });

      expect(axios.get).toHaveBeenCalledTimes(1);
      const url = axios.get.mock.calls[0][0];
      expect(url).toContain("tickets/my-tickets");
      expect(url).toContain("page=1");
      expect(url).toContain("status=Open");
      expect(res.data.success).toBe(true);
    });

    test("fetchMyTicketById issues GET request for single ticket", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: { _id: "tck123", ticketNumber: "TCK-1" } },
      });

      localStorage.setItem("token", "user_jwt_token");

      const res = await fetchMyTicketById("tck123");

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain("tickets/my-tickets/tck123");
      expect(res.data.success).toBe(true);
    });
  });

  describe("replyToMyTicket", () => {
    test("sends POST request to ticket reply endpoint", async () => {
      axios.post.mockResolvedValueOnce({
        data: { success: true, message: "Reply sent" },
      });

      localStorage.setItem("token", "user_jwt_token");

      const res = await replyToMyTicket("tck123", "Thank you, it works now!");

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0][0]).toContain("tickets/my-tickets/tck123/reply");
      expect(axios.post.mock.calls[0][1]).toEqual({
        message: "Thank you, it works now!",
      });
      expect(res.data.success).toBe(true);
    });
  });

  describe("trackPublicTicket", () => {
    test("issues public GET request with ticketNumber and email", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: { ticketNumber: "TCK-20260814-7083" } },
      });

      const res = await trackPublicTicket("TCK-20260814-7083", "candidate@example.com");

      expect(axios.get).toHaveBeenCalledTimes(1);
      const url = axios.get.mock.calls[0][0];
      expect(url).toContain("tickets/track");
      expect(url).toContain("ticketNumber=TCK-20260814-7083");
      expect(url).toContain("email=candidate%40example.com");
      expect(res.data.success).toBe(true);
    });
  });
});
