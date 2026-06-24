import { unstable_cache } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";

// Shared cached settings getter used by the root layout AND the route loading
// fallback. Same cache key + tag means the loading screen reuses the layout's
// already-cached read (no extra DB round-trip), so the spinner can show the
// real clinic logo without slowing first paint.
export const getLayoutSettings = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      return await ClinicSettings.findOne()
        .select("clinicName logo favicon phone whatsapp email address workingHours facebook instagram youtube linkedin createdAt updatedAt")
        .lean();
    } catch (err) {
      console.error("Layout settings load err:", err);
      return null;
    }
  },
  ["public-layout-settings"],
  // Tagged so an admin settings save can bust this immediately via
  // revalidateTag(); without the tag, revalidatePath() leaves this
  // unstable_cache entry stale (footer/navbar show old info until the 300s TTL).
  { revalidate: 300, tags: ["public-layout-settings"] }
);
