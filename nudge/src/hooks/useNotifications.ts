import { useEffect, useState } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const sendNotification = (title: string, body: string, companion: string) => {
    if (permission !== "granted") return;
    const n = new Notification(title, {
      body,
      icon: `/companion-${companion}.png`,
      badge: "/logo-nudge.png",
      tag: "nudge-reminder",
      renotify: true,
    });
    setTimeout(() => n.close(), 10000);
    return n;
  };

  useEffect(() => {
    if (permission === "default") requestPermission();
  }, []);

  return { permission, requestPermission, sendNotification };
}