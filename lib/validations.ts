import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nome demasiado curto"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Mensagem demasiado curta"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
