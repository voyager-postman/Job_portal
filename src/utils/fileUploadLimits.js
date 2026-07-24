export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE_BYTES = 2 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const bytesToMb = (bytes) =>
  Math.round((bytes / (1024 * 1024)) * 10) / 10;

export const isFileWithinSizeLimit = (file, maxBytes) =>
  Boolean(file) && file.size <= maxBytes;

export const validateImageFile = (file, t, options = {}) => {
  const maxBytes = options.maxBytes ?? MAX_IMAGE_SIZE_BYTES;

  if (!file) {
    return { ok: false, message: null };
  }

  if (file.type && !IMAGE_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      message:
        t?.("profile.only_image_allowed") || "Only image files are allowed.",
    };
  }

  if (!isFileWithinSizeLimit(file, maxBytes)) {
    const maxMb = bytesToMb(maxBytes);
    return {
      ok: false,
      message:
        t?.("profile.file_too_large_named", { name: file.name, max: maxMb }) ||
        `File "${file.name}" is too large. Max size is ${maxMb}MB.`,
    };
  }

  return { ok: true };
};

export const validateDocumentFile = (file, t, options = {}) => {
  const maxBytes = options.maxBytes ?? MAX_DOCUMENT_SIZE_BYTES;

  if (!file) {
    return { ok: false, message: null };
  }

  if (file.type && !DOCUMENT_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      message:
        t?.("profile.only_pdf_doc_allowed") ||
        "Only PDF, DOC, and DOCX files are allowed.",
    };
  }

  if (!isFileWithinSizeLimit(file, maxBytes)) {
    return {
      ok: false,
      message:
        t?.("profile.file_too_large_named_simple", { name: file.name }) ||
        t?.("header.file_too_large") ||
        `File "${file.name}" is too large. Max size is 2MB.`,
    };
  }

  return { ok: true };
};

export const validateChatAttachmentFile = (file, t) => {
  if (!file) {
    return { ok: false, message: null };
  }

  if (file.type?.startsWith("image/")) {
    return validateImageFile(file, t);
  }

  if (file.type?.startsWith("video/")) {
    if (!isFileWithinSizeLimit(file, MAX_VIDEO_SIZE_BYTES)) {
      const maxMb = bytesToMb(MAX_VIDEO_SIZE_BYTES);
      return {
        ok: false,
        message:
          t?.("profile.file_too_large_named", { name: file.name, max: maxMb }) ||
          `File "${file.name}" is too large. Max size is ${maxMb}MB.`,
      };
    }
    return { ok: true };
  }

  return validateDocumentFile(file, t);
};

export const filterValidImageFiles = (files, t, onError) => {
  const valid = [];

  for (const file of files) {
    const result = validateImageFile(file, t);
    if (result.ok) {
      valid.push(file);
    } else if (result.message) {
      onError?.(result.message);
    }
  }

  return valid;
};
