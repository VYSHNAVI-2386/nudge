import cron from "node-cron";
import { prisma } from "../utils/prisma.js";
import { sendPushNotification } from "./notifications.js";

export function startScheduler() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hh}:${mm}`;
    const day = now.getDay();

    const reminders = await prisma.reminder.findMany({
      where: { isActive: true, time: currentTime },
      include: { user: true, recipient: true },
    });

    for (const r of reminders) {
      if (r.repeat === "weekdays" && (day === 0 || day === 6)) continue;
      if (r.repeat === "once") {
        await prisma.reminder.update({ where: { id: r.id }, data: { isActive: false } });
      }
      await prisma.reminderLog.create({ data: { reminderId: r.id } });
      if (r.user.fcmToken) {
        await sendPushNotification(r.user.fcmToken, {
          title: "A nudge from someone who cares 💛",
          body: r.message,
        });
      }
    }
  });

  console.log("✅ Scheduler started");
}