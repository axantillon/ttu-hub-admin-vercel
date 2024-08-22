/* eslint-disable @next/next/no-img-element */
"use server";

import { getAllUsers } from "@/db/users";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { Event } from "@prisma/client";
import { Head, Html, Preview, Text } from "@react-email/components";
import { formatInTimeZone } from "date-fns-tz";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email Functions
export async function sendNewEventEmail(event: Event, sender: string) {

  const emails = (await getAllUsers()).map((u) => `${u.username}@ttu.edu`);

  const e = await resend.emails.send({
    from: "TTU@CR Hub <updates@ttucr-hub.app>",
    to: emails,
    subject: `${event.name} - Check it out!`,
    bcc: sender,
    react: (
      <Email
        subject={`${event.name} - Check it out!`}
        event={event}
      />
    ),
  });

  if (e.error) {
    console.log(e);
    throw new Error("Failed to send email");
  }

  return e.data;
}

export async function sendUpdateEmail(
  sender: string,
  emails: string | string[],
  message: string,
  event: Event
) {
  const e = await resend.emails.send({
    from: "TTU@CR Hub <updates@ttucr-hub.app>",
    to: emails,
    subject: `${event.name} - New message`,
    bcc: sender,
    react: (
      <Email
        subject={`New message in ${event.name}`}
        message={message}
        event={event}
      />
    ),
  });

  if (e.error) {
    console.log(e);
    throw new Error("Failed to send email");
  }

  return e.data;
}

const Email = ({
  subject,
  message,
  event,
}: {
  subject: string;
  message?: string;
  event: Event;
}) => {
  const badgeColor =
    EVENT_CATEGORIES.find((cat) => cat.name === event.category)?.color ||
    "#000000";

  const imgUrl = event.coverImg ? `https://yyccawyordfhdjblwusu.supabase.co/storage/v1/object/public/${event.coverImg}?quality=75)` : null;

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <div style={main}>
        <div style={container}>
          {imgUrl ? (
            <img style={coverImageStyle} src={imgUrl} alt="Event Cover" />
          ) : (
            <div style={coverImageStyle} />
          )}
          <div style={eventInfoContainer}>
            <div style={dateAndCategoryContainer}>
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

              <div style={timeBoxStyle}>
                <span style={timeTextStyle}>
                  {formatInTimeZone(
                    event.startTime,
                    "America/Costa_Rica",
                    "K:mm aa"
                  )}
                </span>
              </div>
            </div>

            <div style={eventDetailsContainer}>
              <span style={eventNameStyle}>{event.name}</span>
              <span style={eventLocationStyle}>{event.location}</span>
              {message && <span style={eventDescriptionStyle} title={event.description}>{event.description}</span>}
              {event.category && (
                <div style={{ ...badgeStyle, backgroundColor: badgeColor }}>
                  {event.category}
                </div>
              )}
            </div>
          </div>

          {message ? (
            <>
              <p style={titleStyle}>
                There&apos;s a new message for this event...
              </p>
              <div
                style={messageBox}
                dangerouslySetInnerHTML={{
                  __html: message.replace(
                    /<img/g,
                    '<img style="display: block; margin: 0 auto; max-width: 300px; height: auto; object-fit: contain;"'
                  ),
                }}
              />
            </>
          ) : (
            <p style={titleStyle}>{event.description}</p>
          )}
          <br />
          <a href={`https://ttucr-hub.app/event/${event.id}`} style={linkStyle}>
            Check it out in the app!
          </a>
        </div>
        <Text style={footer}>
          This email was sent by TTU@CR Hub. If you have any questions, please
          contact us.
        </Text>
      </div>
    </Html>
  );
};

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#F5F5F5",
  margin: "0 auto",
  maxWidth: "450px",
  marginBottom: "64px",
  paddingBottom: "32px",
};

const messageBox = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "16px 24px",
  maxWidth: "390px",
  margin: "0 32px",
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
  margin: "16px 24px",
};

const timeBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "4px 8px",
  borderRadius: "16px",
  backgroundColor: "#D1D5DB",
  marginTop: "6px",
};

const timeTextStyle = {
  fontSize: "12px",
  lineHeight: "1",
  textAlign: "center" as const,
  fontWeight: "400",
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

const coverImageStyle = {
  height: "176px",
  aspectRatio: "330/176",
  borderRadius: "0 0 12px 12px",
  objectFit: "cover" as const,
  margin: "0 auto",
  width: "100%",
  backgroundColor: "#D1D5DB",
};

const eventInfoContainer = {
  display: "flex",
  alignItems: "center",
  margin: "8px 16px",
};

const dateAndCategoryContainer = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
};

const eventDetailsContainer = {
  display: "flex",
  flexDirection: "column" as const,
  marginLeft: "24px",
};

const eventNameStyle = {
  fontSize: "2rem",
  lineHeight: "2.25rem",
  fontWeight: "700",
};

const eventLocationStyle = {
  ...dayStyle,
  display: "flex",
  alignItems: "center",
  marginTop: "4px",
  marginBottom: "6px",
};

const eventDescriptionStyle = {
  ...dayStyle,
  maxWidth: '2750px', // Adjust this value as needed
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const badgeStyle = {
  width: "fit-content",
  padding: "2px 8px",
  fontSize: "10px",
  lineHeight: "12px",
  fontWeight: "600",
  borderRadius: "9999px",
  color: "#ffffff",
  zIndex: "10",
  marginTop: "6px",
  textAlign: "center" as const,
};

const linkStyle = {
  textDecoration: 'underline',
  color: '#3B82F6',
  paddingTop: '24px',
  textAlign: 'center' as const,
  display: 'block',
  margin: '0 auto',
  width: 'fit-content',
  fontSize: '10px',
};