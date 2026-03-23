import "server-only";

import { getStore } from "../api/_lib/store";

function stripLargeInlineImage(value) {
  const text = String(value || "").trim();
  if (!text.startsWith("data:image/")) {
    return text;
  }

  const maxInlineLength = 30000;
  return text.length > maxInlineLength ? "" : text;
}

function toPublicInstitute(data) {
  const source = data || {};
  return {
    ...source,
    principal: {
      ...(source.principal || {}),
      photo: stripLargeInlineImage(source?.principal?.photo),
    },
    faculties: (source.faculties || []).map((item) => ({
      ...item,
      photo: stripLargeInlineImage(item?.photo),
    })),
    hero_slides: (source.hero_slides || []).map((item) => ({
      ...item,
      src: stripLargeInlineImage(item?.src),
    })),
    home_student_achievements: (source.home_student_achievements || []).map((item) => ({
      ...item,
      photo: stripLargeInlineImage(item?.photo),
    })),
    academic_content: undefined,
  };
}

export async function getServerPublicInstitute() {
  try {
    const store = await getStore();
    return toPublicInstitute(store?.instituteData || {});
  } catch {
    return null;
  }
}
