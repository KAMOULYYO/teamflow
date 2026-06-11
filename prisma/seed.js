const { PrismaClient } = require("@prisma/client")
const { PrismaNeon } = require("@prisma/adapter-neon")
const { Pool } = require("@neondatabase/serverless")
const bcrypt = require("bcryptjs")

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding TeamFlow Pro database…")

  // Clean existing data
  await prisma.activityLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.taskComment.deleteMany()
  await prisma.taskAttachment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  console.log("🗑️  Existing data cleared")

  const password = await bcrypt.hash("demo1234", 12)

  // ── USERS ──────────────────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Alex Johnson",   email: "demo@teamflowpro.com",  password, role: "ADMIN"  } }),
    prisma.user.create({ data: { name: "Sarah Kim",      email: "sarah@teamflowpro.com", password, role: "MEMBER" } }),
    prisma.user.create({ data: { name: "James Chen",     email: "james@teamflowpro.com", password, role: "MEMBER" } }),
    prisma.user.create({ data: { name: "Priya Nair",     email: "priya@teamflowpro.com", password, role: "MEMBER" } }),
    prisma.user.create({ data: { name: "Marcus Reed",    email: "marcus@teamflowpro.com",password, role: "MEMBER" } }),
    prisma.user.create({ data: { name: "Elena Vasquez",  email: "elena@teamflowpro.com", password, role: "MEMBER" } }),
    prisma.user.create({ data: { name: "Tom Clark",      email: "tom@teamflowpro.com",   password, role: "MEMBER" } }),
    prisma.user.create({ data: { name: "David Lim",      email: "david@teamflowpro.com", password, role: "MEMBER" } }),
  ])
  const [alex, sarah, james, priya, marcus, elena, tom, david] = users
  console.log("✅ 8 users created")

  // ── TEAMS ──────────────────────────────────────────────────────────────────
  const [engTeam, designTeam, productTeam] = await Promise.all([
    prisma.team.create({ data: { name: "Engineering", slug: "engineering", description: "Frontend, backend and infrastructure" } }),
    prisma.team.create({ data: { name: "Design",      slug: "design",      description: "Product design and brand"            } }),
    prisma.team.create({ data: { name: "Product",     slug: "product",     description: "Product management and strategy"     } }),
  ])
  console.log("✅ 3 teams created")

  // ── TEAM MEMBERS ───────────────────────────────────────────────────────────
  await Promise.all([
    prisma.teamMember.create({ data: { teamId: engTeam.id,    userId: alex.id,   role: "OWNER"   } }),
    prisma.teamMember.create({ data: { teamId: engTeam.id,    userId: james.id,  role: "ADMIN"   } }),
    prisma.teamMember.create({ data: { teamId: engTeam.id,    userId: sarah.id,  role: "MEMBER"  } }),
    prisma.teamMember.create({ data: { teamId: engTeam.id,    userId: marcus.id, role: "MEMBER"  } }),
    prisma.teamMember.create({ data: { teamId: designTeam.id, userId: priya.id,  role: "OWNER"   } }),
    prisma.teamMember.create({ data: { teamId: designTeam.id, userId: elena.id,  role: "MANAGER" } }),
    prisma.teamMember.create({ data: { teamId: designTeam.id, userId: sarah.id,  role: "MEMBER"  } }),
    prisma.teamMember.create({ data: { teamId: productTeam.id,userId: tom.id,    role: "OWNER"   } }),
    prisma.teamMember.create({ data: { teamId: productTeam.id,userId: david.id,  role: "ADMIN"   } }),
    prisma.teamMember.create({ data: { teamId: productTeam.id,userId: alex.id,   role: "MEMBER"  } }),
  ])
  console.log("✅ Team members linked")

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  const [webProj, mobileProj, apiProj, dsProj, analyticsProj, authProj] = await Promise.all([
    prisma.project.create({ data: { name: "Website Redesign",   description: "Complete overhaul of marketing site",   color: "#7c3aed", status: "ACTIVE",    teamId: engTeam.id,    creatorId: alex.id,  endDate: new Date("2026-06-30") } }),
    prisma.project.create({ data: { name: "Mobile App",         description: "iOS and Android app for customers",     color: "#2563eb", status: "ACTIVE",    teamId: engTeam.id,    creatorId: james.id, endDate: new Date("2026-07-15") } }),
    prisma.project.create({ data: { name: "API v2",             description: "REST API redesign with GraphQL",        color: "#059669", status: "ACTIVE",    teamId: engTeam.id,    creatorId: alex.id,  endDate: new Date("2026-06-20") } }),
    prisma.project.create({ data: { name: "Design System",      description: "Component library and design tokens",   color: "#ec4899", status: "ACTIVE",    teamId: designTeam.id, creatorId: priya.id, endDate: new Date("2026-06-12") } }),
    prisma.project.create({ data: { name: "Analytics Platform", description: "Custom BI and reporting dashboards",    color: "#f59e0b", status: "ACTIVE",    teamId: productTeam.id,creatorId: tom.id,   endDate: new Date("2026-08-01") } }),
    prisma.project.create({ data: { name: "Auth Service",       description: "SSO and identity management",           color: "#6366f1", status: "COMPLETED", teamId: engTeam.id,    creatorId: james.id, endDate: new Date("2026-05-28") } }),
  ])
  console.log("✅ 6 projects created")

  // ── TASKS ──────────────────────────────────────────────────────────────────
  const now = new Date()
  const d = (offsetDays) => { const dt = new Date(now); dt.setDate(dt.getDate() + offsetDays); return dt }

  const taskRows = [
    // Website Redesign
    { title: "Redesign homepage hero section",       description: "New gradient hero with animated elements and CTA",          status: "COMPLETED",   priority: "HIGH",   projectId: webProj.id,       assigneeId: priya.id,   creatorId: alex.id,  position: 1, dueDate: d(-15), labels: '["design","frontend"]' },
    { title: "Implement navigation component",       description: "Sticky nav with smooth scroll and mobile hamburger menu",   status: "COMPLETED",   priority: "MEDIUM", projectId: webProj.id,       assigneeId: james.id,  creatorId: alex.id,  position: 2, dueDate: d(-12), labels: '["frontend"]' },
    { title: "Pricing page A/B test",                description: "Test two pricing layouts with Vercel Analytics",            status: "IN_PROGRESS", priority: "HIGH",   projectId: webProj.id,       assigneeId: sarah.id,  creatorId: alex.id,  position: 3, dueDate: d(8),   labels: '["analytics","design"]' },
    { title: "SEO meta tags & sitemap audit",        description: "Update OG tags, sitemap.xml and robots.txt for all pages",  status: "TODO",        priority: "LOW",    projectId: webProj.id,       assigneeId: david.id,  creatorId: alex.id,  position: 4, dueDate: d(15),  labels: '["seo"]' },
    { title: "Page speed optimisation",              description: "Target Lighthouse score above 95 on all routes",            status: "TODO",        priority: "MEDIUM", projectId: webProj.id,       assigneeId: james.id,  creatorId: alex.id,  position: 5, dueDate: d(18),  labels: '["performance"]' },
    { title: "Write launch blog post",               description: "Announce new website with changelog and screenshots",       status: "BACKLOG",     priority: "LOW",    projectId: webProj.id,       assigneeId: elena.id,  creatorId: alex.id,  position: 6, labels: '["content"]' },

    // Mobile App
    { title: "Design system update for mobile",      description: "Align Figma tokens with new brand guidelines",             status: "IN_PROGRESS", priority: "HIGH",   projectId: mobileProj.id,    assigneeId: priya.id,  creatorId: james.id, position: 1, dueDate: d(3),   labels: '["design"]' },
    { title: "Push notification integration",        description: "Firebase FCM setup for iOS and Android targets",           status: "REVIEW",      priority: "URGENT", projectId: mobileProj.id,    assigneeId: marcus.id, creatorId: james.id, position: 2, dueDate: d(1),   labels: '["mobile","backend"]' },
    { title: "Offline mode — task caching",          description: "Cache tasks with SQLite on device, sync on reconnect",     status: "TODO",        priority: "HIGH",   projectId: mobileProj.id,    assigneeId: james.id,  creatorId: james.id, position: 3, dueDate: d(21),  labels: '["mobile"]' },
    { title: "Onboarding flow — 5 screens",          description: "Welcome, permissions, team setup, first task, dashboard", status: "IN_PROGRESS", priority: "MEDIUM", projectId: mobileProj.id,    assigneeId: priya.id,  creatorId: james.id, position: 4, dueDate: d(10),  labels: '["design","mobile"]' },
    { title: "Biometric authentication",             description: "Face ID / Touch ID via expo-local-authentication",         status: "TODO",        priority: "HIGH",   projectId: mobileProj.id,    assigneeId: marcus.id, creatorId: james.id, position: 5, dueDate: d(25),  labels: '["security","mobile"]' },
    { title: "App Store submission prep",            description: "Screenshots, description, privacy policy, review checklist",status: "BACKLOG",    priority: "MEDIUM", projectId: mobileProj.id,    assigneeId: tom.id,    creatorId: james.id, position: 6, labels: '["ops"]' },

    // API v2
    { title: "GraphQL schema design",                description: "Define all types, queries and mutations for v2 API",       status: "COMPLETED",   priority: "URGENT", projectId: apiProj.id,       assigneeId: alex.id,   creatorId: alex.id,  position: 1, dueDate: d(-20), labels: '["backend","api"]' },
    { title: "JWT authentication middleware",        description: "Validation + refresh token rotation with Redis",           status: "COMPLETED",   priority: "URGENT", projectId: apiProj.id,       assigneeId: james.id,  creatorId: alex.id,  position: 2, dueDate: d(-18), labels: '["backend","security"]' },
    { title: "Rate limiting on all endpoints",       description: "Sliding window 100 req/min per IP via Redis cluster",     status: "REVIEW",      priority: "HIGH",   projectId: apiProj.id,       assigneeId: marcus.id, creatorId: alex.id,  position: 3, dueDate: d(1),   labels: '["backend","security"]' },
    { title: "Webhook delivery system",              description: "Retry queue with exponential back-off, dead-letter queue",status: "IN_PROGRESS", priority: "HIGH",   projectId: apiProj.id,       assigneeId: james.id,  creatorId: alex.id,  position: 4, dueDate: d(9),   labels: '["backend"]' },
    { title: "API documentation (Swagger / OpenAPI)",description: "Auto-generate OpenAPI spec and publish to docs site",     status: "TODO",        priority: "MEDIUM", projectId: apiProj.id,       assigneeId: david.id,  creatorId: alex.id,  position: 5, dueDate: d(12),  labels: '["docs"]' },

    // Design System
    { title: "Audit all current components",         description: "Catalogue 60+ components, flag inconsistencies",          status: "COMPLETED",   priority: "HIGH",   projectId: dsProj.id,        assigneeId: priya.id,  creatorId: priya.id, position: 1, dueDate: d(-30), labels: '["design"]' },
    { title: "Define colour token system",           description: "Semantic tokens: primary, surface, feedback, etc.",       status: "COMPLETED",   priority: "HIGH",   projectId: dsProj.id,        assigneeId: elena.id,  creatorId: priya.id, position: 2, dueDate: d(-25), labels: '["design","tokens"]' },
    { title: "Typography scale",                     description: "Fluid type scale from 12 to 48px with line-height guide", status: "COMPLETED",   priority: "MEDIUM", projectId: dsProj.id,        assigneeId: priya.id,  creatorId: priya.id, position: 3, dueDate: d(-22), labels: '["design","tokens"]' },
    { title: "Button component variants",            description: "Primary, secondary, ghost, danger — all sizes + states",  status: "COMPLETED",   priority: "MEDIUM", projectId: dsProj.id,        assigneeId: sarah.id,  creatorId: priya.id, position: 4, dueDate: d(-12), labels: '["design","component"]' },
    { title: "Dark mode token mapping",              description: "Map every light token to its dark counterpart",           status: "IN_PROGRESS", priority: "HIGH",   projectId: dsProj.id,        assigneeId: elena.id,  creatorId: priya.id, position: 5, dueDate: d(2),   labels: '["design","tokens"]' },
    { title: "Publish Storybook to Chromatic",       description: "Deploy Storybook with Chromatic visual regression tests", status: "TODO",        priority: "MEDIUM", projectId: dsProj.id,        assigneeId: priya.id,  creatorId: priya.id, position: 6, dueDate: d(5),   labels: '["docs"]' },

    // Analytics
    { title: "Data warehouse schema design",         description: "Star schema for events, users and sessions tables",       status: "IN_PROGRESS", priority: "HIGH",   projectId: analyticsProj.id, assigneeId: marcus.id, creatorId: tom.id,  position: 1, dueDate: d(12),  labels: '["backend","data"]' },
    { title: "Dashboard builder UI",                 description: "Drag-drop widget layout with Recharts integration",       status: "TODO",        priority: "HIGH",   projectId: analyticsProj.id, assigneeId: priya.id,  creatorId: tom.id,  position: 2, dueDate: d(30),  labels: '["frontend","design"]' },
    { title: "Real-time event pipeline",             description: "Kafka → ClickHouse ingestion under 500ms p99 latency",   status: "BACKLOG",     priority: "MEDIUM", projectId: analyticsProj.id, assigneeId: james.id,  creatorId: tom.id,  position: 3, dueDate: d(40),  labels: '["backend","data"]' },
    { title: "CSV / PDF report export",              description: "One-click report export for any dashboard view",          status: "BACKLOG",     priority: "LOW",    projectId: analyticsProj.id, assigneeId: david.id,  creatorId: tom.id,  position: 4, labels: '["frontend"]' },

    // Auth Service (all completed)
    { title: "OAuth2 provider setup",                description: "Google, GitHub, and Microsoft SSO via Passport.js",      status: "COMPLETED",   priority: "URGENT", projectId: authProj.id,      assigneeId: james.id,  creatorId: james.id, position: 1, dueDate: d(-45), labels: '["backend","security"]' },
    { title: "Session management & CSRF protection", description: "Secure HTTP-only cookies with CSRF token validation",    status: "COMPLETED",   priority: "HIGH",   projectId: authProj.id,      assigneeId: alex.id,   creatorId: james.id, position: 2, dueDate: d(-40), labels: '["backend","security"]' },
    { title: "2FA with TOTP (Google Authenticator)", description: "RFC 6238-compliant TOTP implementation",                 status: "COMPLETED",   priority: "HIGH",   projectId: authProj.id,      assigneeId: marcus.id, creatorId: james.id, position: 3, dueDate: d(-35), labels: '["backend","security"]' },
    { title: "Immutable audit log service",          description: "Append-only log of all authentication events",           status: "COMPLETED",   priority: "MEDIUM", projectId: authProj.id,      assigneeId: james.id,  creatorId: james.id, position: 4, dueDate: d(-30), labels: '["backend"]' },
    { title: "External penetration test",            description: "Third-party security audit — 0 critical findings",      status: "COMPLETED",   priority: "URGENT", projectId: authProj.id,      assigneeId: alex.id,   creatorId: james.id, position: 5, dueDate: d(-25), labels: '["security"]' },
  ]

  const tasks = []
  for (const t of taskRows) {
    tasks.push(await prisma.task.create({ data: t }))
  }
  console.log(`✅ ${tasks.length} tasks created`)

  // ── COMMENTS ───────────────────────────────────────────────────────────────
  const comments = [
    { content: "Looks great! The gradient perfectly matches our new brand guidelines.", taskId: tasks[0].id,  userId: alex.id   },
    { content: "I've pushed the Figma file to the shared drive — please review before sign-off.", taskId: tasks[0].id,  userId: priya.id  },
    { content: "Nav is live on staging — please test on mobile viewport.",             taskId: tasks[1].id,  userId: james.id  },
    { content: "Tested on iPhone 14 and Galaxy S24, both look great! 🎉",             taskId: tasks[1].id,  userId: sarah.id  },
    { content: "FCM tokens are registering correctly in prod. Delivery rate is 98.4%.",taskId: tasks[7].id,  userId: marcus.id },
    { content: "Can we also add notification grouping? Android supports it natively.", taskId: tasks[7].id,  userId: james.id  },
    { content: "Rate limiter deployed to staging. Redis cluster is holding under load.", taskId: tasks[14].id, userId: marcus.id },
    { content: "LGTM — merge when CI is green ✅",                                    taskId: tasks[14].id, userId: alex.id   },
    { content: "Dark mode looks stunning — matches the Figma specs exactly.",          taskId: tasks[21].id, userId: sarah.id  },
    { content: "One issue: violet-900 token is slightly too dark on macOS True Tone.", taskId: tasks[21].id, userId: priya.id  },
    { content: "Webhook delivery is working in staging. Average latency is 42ms.",     taskId: tasks[15].id, userId: james.id  },
    { content: "Nice work on the retry logic — exponential back-off is elegant.",      taskId: tasks[15].id, userId: alex.id   },
  ]

  for (const c of comments) await prisma.taskComment.create({ data: c })
  console.log("✅ 12 comments created")

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  const notifications = [
    { type: "TASK_ASSIGNED",  title: "New task assigned",         message: "Push notification integration assigned to you",     userId: marcus.id, read: false },
    { type: "COMMENT_ADDED",  title: "Comment on your task",      message: "Alex commented on Rate limiting on all endpoints",  userId: marcus.id, read: false },
    { type: "TASK_ASSIGNED",  title: "New task assigned",         message: "Dark mode token mapping assigned to you",           userId: elena.id,  read: false },
    { type: "TASK_COMPLETED", title: "Task completed",            message: "Homepage hero redesign was marked complete 🎉",     userId: alex.id,   read: false },
    { type: "COMMENT_ADDED",  title: "Comment on your task",      message: "Priya commented on Dark mode token mapping",        userId: elena.id,  read: true  },
    { type: "TEAM_INVITE",    title: "Added to Product team",     message: "You've been added to the Product team as a Member", userId: alex.id,   read: true  },
    { type: "PROJECT_UPDATE", title: "Auth Service completed",    message: "Auth Service project marked as completed",          userId: james.id,  read: true  },
    { type: "TASK_ASSIGNED",  title: "New task assigned",         message: "SEO meta tags audit assigned to you",               userId: david.id,  read: false },
    { type: "MENTION",        title: "You were mentioned",        message: "Marcus mentioned you in Rate limiting PR review",   userId: alex.id,   read: false },
    { type: "TASK_COMPLETED", title: "Task completed",            message: "Authentication middleware marked complete",          userId: james.id,  read: true  },
  ]

  for (const n of notifications) await prisma.notification.create({ data: n })
  console.log("✅ 10 notifications created")

  // ── ACTIVITY LOGS ──────────────────────────────────────────────────────────
  const activities = [
    { action: "task.completed",  entityType: "Task",    entityId: tasks[0].id,  userId: priya.id,  metadata: JSON.stringify({ taskTitle: "Redesign homepage hero section" }) },
    { action: "comment.created", entityType: "Task",    entityId: tasks[7].id,  userId: marcus.id, metadata: JSON.stringify({ taskTitle: "Push notification integration" }) },
    { action: "task.moved",      entityType: "Task",    entityId: tasks[9].id,  userId: priya.id,  metadata: JSON.stringify({ from: "TODO", to: "IN_PROGRESS" }) },
    { action: "member.joined",   entityType: "Team",    entityId: engTeam.id,   userId: marcus.id, metadata: JSON.stringify({ teamName: "Engineering" }) },
    { action: "project.created", entityType: "Project", entityId: analyticsProj.id, userId: tom.id, metadata: JSON.stringify({ projectName: "Analytics Platform" }) },
    { action: "task.completed",  entityType: "Task",    entityId: tasks[28].id, userId: james.id,  metadata: JSON.stringify({ taskTitle: "Session management & CSRF" }) },
    { action: "task.created",    entityType: "Task",    entityId: tasks[4].id,  userId: alex.id,   metadata: JSON.stringify({ taskTitle: "Page speed optimisation" }) },
    { action: "task.completed",  entityType: "Task",    entityId: tasks[1].id,  userId: james.id,  metadata: JSON.stringify({ taskTitle: "Implement navigation component" }) },
    { action: "comment.created", entityType: "Task",    entityId: tasks[15].id, userId: james.id,  metadata: JSON.stringify({ taskTitle: "Webhook delivery system" }) },
    { action: "task.moved",      entityType: "Task",    entityId: tasks[14].id, userId: marcus.id, metadata: JSON.stringify({ from: "IN_PROGRESS", to: "REVIEW" }) },
  ]

  for (const a of activities) await prisma.activityLog.create({ data: a })
  console.log("✅ 10 activity logs created")

  console.log("\n🎉 Database seeded successfully!")
  console.log("\n📋 Tous les comptes utilisent le mot de passe: demo1234")
  console.log("   👑  demo@teamflowpro.com   — Alex Johnson (Admin)")
  console.log("   👩  sarah@teamflowpro.com  — Sarah Kim")
  console.log("   👨  james@teamflowpro.com  — James Chen")
  console.log("   👩  priya@teamflowpro.com  — Priya Nair")
  console.log("   👨  marcus@teamflowpro.com — Marcus Reed")
  console.log("   👩  elena@teamflowpro.com  — Elena Vasquez")
  console.log("   👨  tom@teamflowpro.com    — Tom Clark")
  console.log("   👨  david@teamflowpro.com  — David Lim")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
