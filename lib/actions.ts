"use server";

import { contactSchema } from "./validations";

// Para activar o envio real:
// 1. Adicionar RESEND_API_KEY ao .env.local
// 2. Descomentar o bloco Resend abaixo
export async function sendContact(data: unknown) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Verifica os campos." };
  }

  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "website@rodrigoalarcao.pt",
  //   to: "alarcao.rodrigo@gmail.com",
  //   subject: `Contacto de ${parsed.data.name}`,
  //   text: `De: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
  // });

  console.log("[Contacto recebido]", parsed.data);
  return { success: true };
}
