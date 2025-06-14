import { Resend } from "resend";

type SendEmailProps = {
  to: string;
  subject: string;
  text: string;
};

const resend = new Resend(Bun.env.RESEND_API_KEY);

// FIXME: this is a bottleneck
// This one can takes >3s to complete
export const sendEmail = async ({ to, subject, text }: SendEmailProps) => {
  return resend.emails.send({
    from: "OpenCatchup <onboarding@mail.hisam.dev>",
    to: [to],
    subject,
    text,
  });
};
