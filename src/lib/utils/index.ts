import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AUTHORIZED_EMAILS, DegreeList } from "./consts";

export const extractUsername = (email: string) => email.split("@")[0];

export const getDegreeByKey = (key: string) =>
  DegreeList.find((degree) => degree.value === key);

export const isAllowedEmail = (email: string) =>
  process.env.NODE_ENV === "development" || AUTHORIZED_EMAILS.includes(email);

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

const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const maxWidth = 1024;
    const maxHeight = 768;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (aspectRatio > 4 / 3) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        } else {
          reject(new Error("Canvas to Blob conversion failed"));
        }
      }, file.type);
    };
    img.onerror = (error) => reject(error);
    img.src = URL.createObjectURL(file);
  });
};

export const sanitizePathSegment = (segment: string): string => {
  return segment
    .replace(/[^a-z0-9]/gi, '_')  // Replace non-alphanumeric characters with underscore
    .replace(/_+/g, '_')          // Replace multiple underscores with a single one
    .replace(/^_|_$/g, '')        // Remove leading and trailing underscores
    .toLowerCase()                // Convert to lowercase
    .slice(0, 50);                // Limit length to 50 characters
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
};

export const uploadEventsImage = async (
  file: File,
  eventName: string,
  eventCategory: string
) => {
  const supabase = createClientComponentClient();

  const bucket = "events";

  const resizedFile = await resizeImage(file);

  const sanitizedCategory = sanitizePathSegment(eventCategory);
  const sanitizedEventName = sanitizePathSegment(eventName);
  const fileExtension = getFileExtension(resizedFile.name);
  const sanitizedFileName = `${sanitizePathSegment(resizedFile.name.slice(0, -fileExtension.length))}${fileExtension}`;

  const uploadPath = `${sanitizedCategory}/${sanitizedEventName}/${sanitizedFileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(uploadPath, resizedFile, {
      upsert: true,
    });

  // Handle error if upload failed
  if (error) {
    if (error.message.includes("already exists")) return `events/${file.name}`;
    console.log(error);
    throw new Error("Failed to upload image");
  }

  return data.fullPath;
};

export const base64ToFile = (base64String: string, filename: string) => {
  // Remove the data URL prefix
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  // Decode the base64 string
  const binaryData = atob(base64Data);

  // Create an array buffer from the binary data
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the array buffer
  const blob = new Blob([arrayBuffer], { type: "image/webp" });

  // Create a File object from the Blob
  return new File([blob], filename, { type: "image/webp" });
};