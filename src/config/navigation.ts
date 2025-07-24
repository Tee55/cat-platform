import {
  Bot,
  BookOpen,
  AudioWaveform,
  SquareTerminal,
  Command,
  GalleryVerticalEnd,
} from "lucide-react"

export const navigationData = {
  
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/logo/user.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Vulnerability Scan",
      url: "/vulnerability",
      icon: Bot,
    },
    {
      title: "Threat Intelligence",
      url: "/threat-intelligence",
      icon: BookOpen,
    },
    {
      title: "Critical Alert / Notify",
      url: "/critical-alert",
      icon: SquareTerminal,
    },
  ],
}