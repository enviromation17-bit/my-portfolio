import { z } from "zod";
export const LeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
  template: z.string().trim().max(80).optional(),
  honeypot: z.string().max(0),
});
export type Lead = z.infer<typeof LeadSchema>;
