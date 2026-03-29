import { z } from "zod";

export type ValidationMessages = {
  nameShort: string;
  emailInvalid: string;
  messageShort: string;
};

export const ptValidation: ValidationMessages = {
  nameShort: "Nome demasiado curto",
  emailInvalid: "Email inválido",
  messageShort: "Mensagem demasiado curta",
};

export const enValidation: ValidationMessages = {
  nameShort: "Name too short",
  emailInvalid: "Invalid email",
  messageShort: "Message too short",
};

export function createContactSchema(m: ValidationMessages) {
  return z.object({
    name: z.string().min(2, m.nameShort),
    email: z.string().email(m.emailInvalid),
    message: z.string().min(10, m.messageShort),
  });
}

// Default PT schema — keeps existing import surface intact
export const contactSchema = createContactSchema(ptValidation);

export type ContactFormData = z.infer<typeof contactSchema>;
