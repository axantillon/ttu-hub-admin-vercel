import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AUTHORIZED_EMAILS, DegreeList } from "./consts";

export const extractUsername = (email: string) => email.split("@")[0];

export const getDegreeByKey = (key: string) =>
  DegreeList.find((degree) => degree.value === key);

export const isAllowedEmail = (email: string) =>
  (AUTHORIZED_EMAILS || "").includes(email);

export const detectOS = () => {
  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
};

export const uploadEventsImage = async (
  file: File,
  eventName: string,
  eventCategory: string
) => {
  const supabase = createClientComponentClient();

  const bucket = "events";

  // Call Storage API to upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(
      `${eventCategory.replace(/\s/g, "")}/${eventName.replace(/\s/g, "")}/${
        file.name
      }`,
      file
    );

  // Handle error if upload failed
  if (error) {
    if (error.message.includes("already exists")) return `events/${file.name}`;
    console.log(error);
    throw new Error("Failed to upload image");
  }

  return data.fullPath;
};
