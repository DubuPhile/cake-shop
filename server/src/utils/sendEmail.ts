import { Resend, CreateEmailResponse } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailProps): Promise<CreateEmailResponse> => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};

export const OTPEmailStyle = (otp: string) => {
  return `<body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="padding: 30px 0; background: #f4f4f4"
    >
      <tr>
        <td align="center">
          <!-- Container -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background: #ffffff; border-radius: 10px; overflow: hidden"
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background: #111827;
                  color: #ffffff;
                  text-align: center;
                  padding: 20px;
                  font-size: 20px;
                  font-weight: bold;
                "
              >
                🔐 Secure OTP Verification
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding: 30px; text-align: center; color: #333">
                <h2 style="margin: 0 0 10px">Your Verification Code</h2>
                <p style="font-size: 14px; color: #555; line-height: 1.6">
                  Use the OTP below to complete your action. This code will
                  expire in <b>10 minutes</b>.
                </p>
                <!-- OTP Box -->
                <div style="margin: 25px 0">
                  <div
                    style="
                      display: inline-block;
                      background: #f3f4f6;
                      padding: 15px 25px;
                      font-size: 26px;
                      letter-spacing: 6px;
                      font-weight: bold;
                      border-radius: 8px;
                      color: #111827;
                    "
                  >
                    ${otp}
                  </div>
                </div>
                <!-- Button fallback -->
                <p style="font-size: 12px; color: #888">
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td
                style="
                  text-align: center;
                  padding: 15px;
                  font-size: 12px;
                  color: #999;
                  background: #fafafa;
                "
              >
                © 2026 Amiel Cake Shop. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`;
};
