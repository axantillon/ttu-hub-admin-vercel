/* eslint-disable @next/next/no-img-element */
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  emails: string | string[],
  subject: string,
  message: string,
  event: Event
) {
  const e = await resend.emails.send({
    from: "TTU@CR Hub <updates@ttucr-hub.app>",
    to: emails,
    subject: subject,
    // bcc: "mbarzuna@ttu.edu",
    react: <Email subject={subject} message={message} event={event} />,
  });

  if (e.error) {
    console.log(e);
    throw new Error("Failed to send email");
  }

  return e.data;
}

import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { Event } from "@prisma/client";
import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Text,
} from "@react-email/components";
import { formatInTimeZone } from "date-fns-tz";

export const Email = ({
  subject,
  message,
  event,
}: {
  subject: string;
  message: string;
  event: Event;
}) => {
  const badgeColor =
    EVENT_CATEGORIES.find((cat) => cat.name === event.category)?.color ||
    "#000000";

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <img
            style={{
              width: "100%",
              height: "250px",
              borderRadius: "12px",
              objectFit: "cover" as const,
              margin: "0 auto",
            }}
            src={`https://yyccawyordfhdjblwusu.supabase.co/storage/v1/object/public/${event.coverImg}?quality=75)`}
            alt="Event Cover"
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "8px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={dateBoxStyle}>
                <span style={dayStyle}>
                  {formatInTimeZone(
                    event.startTime,
                    "America/Costa_Rica",
                    "EEEE"
                  )}
                </span>
                <span style={monthStyle}>
                  {formatInTimeZone(
                    event.startTime,
                    "America/Costa_Rica",
                    "MMM"
                  )}
                </span>
                <span style={dateStyle}>
                  {formatInTimeZone(
                    event.startTime,
                    "America/Costa_Rica",
                    "dd"
                  )}
                </span>
              </div>

              <div
                style={{
                  ...badgeStyle,
                  backgroundColor: badgeColor,
                }}
              >
                {event.category}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginLeft: "24px" }}>
              <span
                style={{
                  fontSize: "2rem",
                  lineHeight: "2.25rem",
                  fontWeight: "700",
                }}
              >
                {event.name}
              </span>

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  lineHeight: "14px",
                  marginTop: "4px",
                  marginBottom: "6px",
                }}
              >
                {event.location}
              </span>

              <span style={{ fontSize: "12px", lineHeight: "14px"}}>
                {event.description}
              </span>
            </div>
          </div>
          <span style={titleStyle}>
            There&apos;s a new update for this event...
          </span>
          <div
            style={messageBox}
            dangerouslySetInnerHTML={{
              __html: message.replace(
                /<img/g,
                '<img style="display: block; margin: 0 auto; width: 375px;"'
              ),
            }}
          />
        </Container>
        <Text style={footer}>
          This email was sent by TTU@CR Hub. If you have any questions, please
          contact us.
        </Text>
      </Body>
    </Html>
  );
};

const badgeStyle = {
  width: "fit-content",
  display: "flex",
  alignItems: "center",
  padding: "2px 10px",
  fontSize: "12px",
  fontWeight: "600",
  lineHeight: "16px",
  borderRadius: "9999px",
  color: "#ffffff",
  zIndex: "10",
  marginTop: "8px",
};

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#F5F5F5",
  margin: "0 auto",
  padding: "0 48px",
  marginBottom: "64px",
  paddingBottom: "32px",
};

const messageBox = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "16px 24px",
  width: "390px",
  margin: "0 50px",
  marginTop: "16px",
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "20px",
};

const titleStyle = {
  fontSize: "16px",
  margin: "32px 24px 16px",
};

const dateBoxStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  width: "80px",
  height: "80px",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
};

const dayStyle = {
  fontSize: "12px",
  lineHeight: "14px",
};

const monthStyle = {
  fontSize: "24px",
  marginTop: "-10px",
  marginBottom: "-10px",
  lineHeight: "26px",
};

const dateStyle = {
  fontSize: "24px",
  lineHeight: "26px",
};
