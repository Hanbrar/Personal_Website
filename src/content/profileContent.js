export const profileContent = {
  name: "Hanryck Brar",
  title: "Electrical Engineer",
  subtitle: "Aspiring AI Product Manager",
  location: "Vancouver, BC",
  lastUpdated: "2026-03-02",

  currentlyWorkingOn:
    "Building AI product applications, updated every day. Tracking what I am shipping, learning, and thinking about in real time.",

  currentFocusAreas: [
    "Multi-agent AI systems",
    "FPGA and embedded systems",
    "Product design and strategy",
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
      date: "2026-03-02",
      title: "Launched PolyOpus, a live AI trading experiment on Polymarket.",
      context: "Deployed"
    },
    {
      date: "2026-02-22",
      title: "Building York and testing it out, an AI ads generator.",
      context: "In progress, not sure if it will be a product"
    },
    {
      date: "2026-02-15",
      title: "Entered NVIDIA GTC 2026 competition with deepconverge.ai",
      context: "Build"
    },
    {
      date: "2026-02-16",
      title: "Rebrand from Kangaroo to deepconverge.ai",
      context: "Brand"
    },
    {
      date: "2026-02-04",
      title: "Started Kangaroo multi-agentic debate platform",
      context: "Build"
    },
    {
      date: "2024-09-09",
      title: "Started Electrical Engineering at UBC",
      context: "Education"
    }
  ],

  featuredProjects: [
    {
      title: "PolyOpus",
      tagline: "Autonomous AI Trading on Polymarket",
      href: "https://polyopus-production.up.railway.app/",
      summary:
        "Open experiment testing whether Claude can compound $200 to $2,000 through live sports prediction market trades. Every cycle is transparent: research, reasoning, execution, and live PnL are published on the public dashboard.",
      stack: [
        "Claude Sonnet",
        "Firecrawl",
        "Polymarket CLOB and Gamma APIs",
        "FastAPI and WebSocket",
        "React 18, Tailwind CSS, Chart.js",
        "SQLite",
        "Docker and Railway"
      ],
      tags: ["Autonomous Agents", "Prediction Markets", "FastAPI", "React", "Railway"],
      status: "Deployed",
      date: "Mar 2026",
      cta: "View PolyOpus"
    },
    {
      title: "DeepConverge",
      tagline: "Multi-Agent AI Debate Platform",
      href: "https://deepconverge.ai",
      summary:
        "Full-stack multi-agent debate platform with Advocate, Critic, and Judge agents streaming real-time reasoning. Includes waitlist access, debate history replay, PDF export, and a convergent thinking mode.",
      stack: ["Next.js 14", "NVIDIA Nemotron 30B", "Supabase", "PostgreSQL", "SSE", "Vercel"],
      tags: ["Multi-Agent AI", "Next.js", "Supabase", "PostgreSQL", "SSE Streaming", "Vercel"],
      status: "Live",
      date: "Feb 2026",
      cta: "Visit DeepConverge"
    }
  ],

  schoolProjects: [
    {
      title: "ARC4 Hardware Cracker",
      tagline: "Parallel Verilog Key-Search Engine on FPGA",
      summary:
        "High-throughput ARC4 key-cracking pipeline in Verilog with custom parallel processing, achieving 15M+ keys per second. Multi-core cracking units with on-chip memory buffering and timing-aware RTL optimization for maximum FPGA resource efficiency.",
      tags: ["FPGA", "Verilog", "RTL Design", "Parallel Processing"],
      status: "Dec 2025"
    },
    {
      title: "Autonomous Coin-Picking Robot",
      tagline: "Project Lead on 6-Person Team",
      summary:
        "STM32 and PIC32 based robot with JDY-40 wireless communication and inductive sensing for autonomous coin detection and retrieval. PWM motor and servo control with dual-mode navigation for precise movement in a competitive environment.",
      tags: ["STM32", "Embedded C", "Robotics", "PCB Design"],
      status: "May 2025"
    }
  ]
}
