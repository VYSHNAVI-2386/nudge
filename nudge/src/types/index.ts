export type Companion = string;

export type RepeatMode = "once" | "daily" | "weekdays" | "weekly";

export type Reminder = {
  id: string;
  title: string;
  time: string;
  companion: Companion;
  repeat: RepeatMode;
  recipient: string;
  message: string;
  createdAt: string;
  done: boolean;
};

export type Person = {
  id: string;
  name: string;
  emoji: string;
  companion: Companion;
};