export const profileContent = {
  name: "Hanryck Brar",
  title: "Electrical Engineer",
  subtitle: "Aspiring AI Product Manager",
  location: "Vancouver, BC",
  lastUpdated: "2026-02-22",

  currentlyWorkingOn:
    "Building AI product applications, updated every day. Tracking what I am shipping, learning, and thinking about in real time.",

  currentFocusAreas: [
    "Multi-agent AI systems",
    "FPGA & embedded systems",
    "Product design + strategy",
    "Full-stack development"
  ],

  about:
    "Electrical Engineering student at UBC with a deep interest in AI product development. I build end-to-end, from FPGA circuits to full-stack web apps, and I am working toward a career in AI product management where engineering intuition meets product thinking.",

  contacts: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/Hanbrar",
      value: "@Hanbrar"
    },
    {
      id: "x",
      label: "X",
      href: "https://x.com/ItsHB17",
      value: "@ItsHB17"
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hanryck-brar/",
      value: "Hanryck Brar"
    }
  ],

  blocks: [
    {
      date: "2026-02-22",
      title: "Building York and testing it out, an AI ads generator.",
      context: "In progress, not sure if it will be a product"
    },
    {
      date: "02.15.26",
      title: "Enter NVIDIA 2026 GTC competition with deepconverge.ai",
      context: "Build"
    },
    {
      date: "02.16.26",
      title: "Rebrand from Kangaroo to deepconverge.ai",
      context: "Brand"
    },
    {
      date: "02.04.26",
      title: "Start Kangaroo multi-agentic debate platform",
      context: "Build"
    },
    {
      date: "09.09.24",
      title: "Started Electrical Engineering at UBC",
      context: "Education"
    }
  ],

  mainProject: {
    title: "DeepConverge",
    tagline: "Multi-Agentic AI Debate Platform",
    href: "https://deepconverge.ai",
    summary:
      "Full-stack multi-agentic debate platform featuring three AI agents, Advocate, Critic, and Judge, that reason collaboratively via real-time SSE streaming using NVIDIA Nemotron 30B. Includes waitlist-gated access, debate history replay, PDF export with LaTeX-to-Unicode math rendering, and toggleable convergent thinking mode.",
    tags: ["Multi-Agent AI", "Next.js 14", "Supabase", "PostgreSQL", "SSE Streaming", "Vercel"],
    status: "Live",
    date: "Feb 2026"
  },

  schoolProjects: [
    {
      title: "ARC4 Hardware Cracker",
      tagline: "Parallel Verilog Key-Search Engine · FPGA",
      summary:
        "High-throughput ARC4 key-cracking pipeline in Verilog with custom parallel processing, achieving 15M+ keys per second. Multi-core cracking units with on-chip memory buffering and timing-aware RTL optimization for maximum FPGA resource efficiency.",
      tags: ["FPGA", "Verilog", "RTL Design", "Parallel Processing"],
      status: "Dec 2025"
    },
    {
      title: "Autonomous Coin-Picking Robot",
      tagline: "Project Lead · 6-Person Team",
      summary:
        "STM32/PIC32-based robot with JDY-40 wireless communication and inductive sensing for autonomous coin detection and retrieval. PWM motor and servo control with dual-mode navigation for precise movement in a competitive environment.",
      tags: ["STM32", "Embedded C", "Robotics", "PCB Design"],
      status: "May 2025"
    }
  ]
}
