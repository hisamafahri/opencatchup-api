import { Resend } from "resend";

type SendEmailProps = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmailProps) => {
  const resend = new Resend(Bun.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "OpenCatchup <onboarding@mail.hisam.dev>",
    to: [to],
    subject,
    text,
  });
};
