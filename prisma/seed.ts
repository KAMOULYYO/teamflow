import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"
import path from "path"

const dbPath = path.join(process.cwd(), "prisma", "teamflow.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log("🌱 Seeding TeamFlow Pro database…")

  // ── 1. USERS ──────────────────────────────────────────────────────────────
  const password = await bcrypt.hash("demo1234", 12)

  const [alex, sarah, james, priya, marcus, elena, tom, david] = await Promise.all([
    prisma.user.upsert({
      where: { email: "demo@teamflowpro.com" },
      update: {},
      create: { name: "Alex Johnson", email: "demo@teamflowpro.com", password, role: "ADMIN", image: null },
    }),
    prisma.user.upsert({
      where: { email: "sarah@teamflowpro.com" },
      update: {},
      create: { name: "Sarah Kim", email: "sarah@teamflowpro.com", password, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "james@teamflowpro.com" },
      update: {},
      create: { name: "James Chen", email: "james@teamflowpro.com", password, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "priya@teamflowpro.com" },
      update: {},
      create: { name: "Priya Nair", email: "priya@teamflowpro.com", password, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "marcus@teamflowpro.com" },
      update: {},
      create: { name: "Marcus Reed", email: "marcus@teamflowpro.com", password, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "elena@teamflowpro.com" },
      update: {},
      create: { name: "Elena Vasquez", email: "elena@teamflowpro.com", password, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "tom@teamflowpro.com" },
      update: {},
      create: { name: "Tom Clark", email: "tom@teamflowpro.com", password, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "david@teamflowpro.com" },
      update: {},
      create: { name: "David Lim", email: "david@teamflowpro.com", password, role: "MEMBER" },
    }),
  ])
  console.log("✅ Users created")

  // ── 2. TEAMS ──────────────────────────────────────────────────────────────
  const [engTeam, designTeam, productTeam] = await Promise.all([
    prisma.team.upsert({
      where: { slug: "engineering" },
      update: {},
      create: { name: "Engineering", slug: "engineering", description: "Frontend, backend and infrastructure" },
    }),
    prisma.team.upsert({
      where: { slug: "design" },
      update: {},
      create: { name: "Design", slug: "design", description: "Product design and brand" },
    }),
    prisma.team.upsert({
      where: { slug: "product" },
      update: {},
      create: { name: "Product", slug: "product", description: "Product management and strategy" },
    }),
  ])
  console.log("✅ Teams created")

  // ── 3. TEAM MEMBERS ───────────────────────────────────────────────────────
  const teamMemberData = [
    { teamId: engTeam.id, userId: alex.id,   role: "OWNER"   },
    { teamId: engTeam.id, userId: james.id,  role: "ADMIN"   },
    { teamId: engTeam.id, userId: sarah.id,  role: "MEMBER"  },
    { teamId: engTeam.id, userId: marcus.id, role: "MEMBER"  },
    { teamId: designTeam.id, userId: priya.id,  role: "OWNER"  },
    { teamId: designTeam.id, userId: elena.id,  role: "MANAGER" },
    { teamId: designTeam.id, userId: sarah.id,  role: "MEMBER"  },
    { teamId: productTeam.id, userId: tom.id,   role: "OWNER"  },
    { teamId: productTeam.id, userId: david.id, role: "ADMIN"  },
    { teamId: productTeam.id, userId: alex.id,  role: "MEMBER" },
  ]

  for (const m of teamMemberData) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: m.teamId, userId: m.userId } },
      update: {},
      create: m,
    })
  }
  console.log("✅ Team members added")

  // ── 4. PROJECTS ───────────────────────────────────────────────────────────
  const projects = await Promise.all([
    prisma.project.create({ data: { name: "Website Redesign",    description: "Complete overhaul of marketing site",    color: "#7c3aed", teamId: engTeam.id,    creatorId: alex.id,  status: "ACTIVE",    endDate: new Date("2026-06-30") } }),
    prisma.project.create({ data: { name: "Mobile App",          description: "iOS and Android app for customers",      color: "#2563eb", teamId: engTeam.id,    creatorId: james.id, status: "ACTIVE",    endDate: new Date("2026-07-15") } }),
    prisma.project.create({ data: { name: "API v2",              description: "REST API redesign with GraphQL",         color: "#059669", teamId: engTeam.id,    creatorId: alex.id,  status: "ACTIVE",    endDate: new Date("2026-06-20") } }),
    prisma.project.create({ data: { name: "Design System",       description: "Component library and design tokens",    color: "#ec4899", teamId: designTeam.id, creatorId: priya.id, status: "ACTIVE",    endDate: new Date("2026-06-12") } }),
    prisma.project.create({ data: { name: "Analytics Platform",  description: "Custom BI and reporting dashboards",     color: "#f59e0b", teamId: productTeam.id,creatorId: tom.id,   status: "ACTIVE",    endDate: new Date("2026-08-01") } }),
    prisma.project.create({ data: { name: "Auth Service",        description: "SSO and identity management",            color: "#6366f1", teamId: engTeam.id,    creatorId: james.id, status: "COMPLETED", endDate: new Date("2026-05-28") } }),
  ])
  const [websiteProject, mobileProject, apiProject, designProject, analyticsProject, authProject] = projects
  console.log("✅ Projects created")

  // ── 5. TASKS ──────────────────────────────────────────────────────────────
  const taskData = [
    // Website Redesign
    { title: "Redesign homepage hero section",        description: "New gradient hero with animated elements and CTA",        status: "COMPLETED",  priority: "HIGH",   projectId: websiteProject.id, assigneeId: priya.id,  creatorId: alex.id,  position: 1, dueDate: new Date("2026-06-05"), labels: '["design","frontend"]' },
    { title: "Implement new navigation component",    description: "Sticky nav with smooth scroll and mobile hamburger",       status: "COMPLETED",  priority: "MEDIUM", projectId: websiteProject.id, assigneeId: james.id,  creatorId: alex.id,  position: 2, dueDate: new Date("2026-06-07"), labels: '["frontend"]' },
    { title: "Pricing page A/B test",                 description: "Test two pricing layouts with Vercel Analytics",           status: "IN_PROGRESS",priority: "HIGH",   projectId: websiteProject.id, assigneeId: sarah.id,  creatorId: alex.id,  position: 3, dueDate: new Date("2026-06-18"), labels: '["analytics","design"]' },
    { title: "SEO meta tags audit",                   description: "Update OG tags, sitemap and robots.txt",                   status: "TODO",       priority: "LOW",    projectId: websiteProject.id, assigneeId: david.id,  creatorId: alex.id,  position: 4, dueDate: new Date("2026-06-25"), labels: '["seo"]' },
    { title: "Page speed optimisation",               description: "Target Lighthouse score above 95 on all routes",           status: "TODO",       priority: "MEDIUM", projectId: websiteProject.id, assigneeId: james.id,  creatorId: alex.id,  position: 5, dueDate: new Date("2026-06-28"), labels: '["performance"]' },
    { title: "Write blog launch post",                description: "Announce new website with changelog and screenshots",      status: "BACKLOG",    priority: "LOW",    projectId: websiteProject.id, assigneeId: elena.id,  creatorId: alex.id,  position: 6, labels: '["content"]' },

    // Mobile App
    { title: "Design system update for mobile",       description: "Align Figma tokens with new brand guidelines",             status: "IN_PROGRESS",priority: "HIGH",   projectId: mobileProject.id,  assigneeId: priya.id,  creatorId: james.id, position: 1, dueDate: new Date("2026-06-13"), labels: '["design"]' },
    { title: "Push notification integration",         description: "Firebase FCM setup for iOS and Android",                   status: "REVIEW",     priority: "URGENT", projectId: mobileProject.id,  assigneeId: marcus.id, creatorId: james.id, position: 2, dueDate: new Date("2026-06-11"), labels: '["mobile","backend"]' },
    { title: "Offline mode — task caching",           description: "Cache tasks with SQLite on device, sync on reconnect",     status: "TODO",       priority: "HIGH",   projectId: mobileProject.id,  assigneeId: james.id,  creatorId: james.id, position: 3, dueDate: new Date("2026-07-01"), labels: '["mobile"]' },
    { title: "Onboarding flow — 5 screens",           description: "Welcome, permissions, team setup, first task, dashboard",  status: "IN_PROGRESS",priority: "MEDIUM", projectId: mobileProject.id,  assigneeId: priya.id,  creatorId: james.id, position: 4, dueDate: new Date("2026-06-20"), labels: '["design","mobile"]' },
    { title: "Biometric authentication",              description: "Face ID / Touch ID via expo-local-authentication",         status: "TODO",       priority: "HIGH",   projectId: mobileProject.id,  assigneeId: marcus.id, creatorId: james.id, position: 5, dueDate: new Date("2026-07-05"), labels: '["security","mobile"]' },
    { title: "App Store submission prep",             description: "Screenshots, description, privacy policy, review checklist",status: "BACKLOG",    priority: "MEDIUM", projectId: mobileProject.id,  assigneeId: tom.id,    creatorId: james.id, position: 6, labels: '["ops"]' },

    // API v2
    { title: "GraphQL schema design",                 description: "Define all types, queries and mutations for v2",           status: "COMPLETED",  priority: "URGENT", projectId: apiProject.id,     assigneeId: alex.id,   creatorId: alex.id,  position: 1, dueDate: new Date("2026-06-01"), labels: '["backend","api"]' },
    { title: "Authentication middleware",             description: "JWT validation + refresh token rotation",                  status: "COMPLETED",  priority: "URGENT", projectId: apiProject.id,     assigneeId: james.id,  creatorId: alex.id,  position: 2, dueDate: new Date("2026-06-03"), labels: '["backend","security"]' },
    { title: "Rate limiting on all endpoints",        description: "sliding window 100 req/min per IP via Redis",              status: "REVIEW",     priority: "HIGH",   projectId: apiProject.id,     assigneeId: marcus.id, creatorId: alex.id,  position: 3, dueDate: new Date("2026-06-11"), labels: '["backend","security"]' },
    { title: "Webhook delivery system",               description: "Retry queue with exponential back-off, dead-letter queue", status: "IN_PROGRESS",priority: "HIGH",   projectId: apiProject.id,     assigneeId: james.id,  creatorId: alex.id,  position: 4, dueDate: new Date("2026-06-19"), labels: '["backend"]' },
    { title: "API documentation with Swagger",        description: "Auto-generate OpenAPI spec from GraphQL schema",           status: "TODO",       priority: "MEDIUM", projectId: apiProject.id,     assigneeId: david.id,  creatorId: alex.id,  position: 5, dueDate: new Date("2026-06-22"), labels: '["docs"]' },

    // Design System
    { title: "Audit all current components",          description: "Catalogue 60+ components, flag inconsistencies",           status: "COMPLETED",  priority: "HIGH",   projectId: designProject.id,  assigneeId: priya.id,  creatorId: priya.id, position: 1, dueDate: new Date("2026-05-20"), labels: '["design"]' },
    { title: "Define colour token system",            description: "Semantic tokens: primary, surface, feedback, etc.",        status: "COMPLETED",  priority: "HIGH",   projectId: designProject.id,  assigneeId: elena.id,  creatorId: priya.id, position: 2, dueDate: new Date("2026-05-25"), labels: '["design","tokens"]' },
    { title: "Typography scale",                      description: "Fluid type scale from 12px to 48px with line-height",      status: "COMPLETED",  priority: "MEDIUM", projectId: designProject.id,  assigneeId: priya.id,  creatorId: priya.id, position: 3, dueDate: new Date("2026-05-28"), labels: '["design","tokens"]' },
    { title: "Button component variants",             description: "Primary, secondary, ghost, danger — all sizes + states",   status: "COMPLETED",  priority: "MEDIUM", projectId: designProject.id,  assigneeId: sarah.id,  creatorId: priya.id, position: 4, dueDate: new Date("2026-06-02"), labels: '["design","component"]' },
    { title: "Dark mode token mapping",               description: "Map every light token to its dark equivalent",             status: "IN_PROGRESS",priority: "HIGH",   projectId: designProject.id,  assigneeId: elena.id,  creatorId: priya.id, position: 5, dueDate: new Date("2026-06-12"), labels: '["design","tokens"]' },
    { title: "Publish Storybook",                     description: "Deploy Storybook to Vercel with Chromatic visual tests",   status: "TODO",       priority: "MEDIUM", projectId: designProject.id,  assigneeId: priya.id,  creatorId: priya.id, position: 6, dueDate: new Date("2026-06-15"), labels: '["docs"]' },

    // Analytics Platform
    { title: "Data warehouse schema",                 description: "Star schema for events, users, sessions tables",           status: "IN_PROGRESS",priority: "HIGH",   projectId: analyticsProject.id,assigneeId: marcus.id, creatorId: tom.id,  position: 1, dueDate: new Date("2026-06-22"), labels: '["backend","data"]' },
    { title: "Dashboard builder UI",                  description: "Drag-drop widget layout with Recharts integration",        status: "TODO",       priority: "HIGH",   projectId: analyticsProject.id,assigneeId: priya.id,  creatorId: tom.id,  position: 2, dueDate: new Date("2026-07-10"), labels: '["frontend","design"]' },
    { title: "Real-time event pipeline",              description: "Kafka → ClickHouse ingestion under 500ms latency",         status: "BACKLOG",    priority: "MEDIUM", projectId: analyticsProject.id,assigneeId: james.id,  creatorId: tom.id,  position: 3, dueDate: new Date("2026-07-20"), labels: '["backend","data"]' },
    { title: "Export to CSV / PDF",                   description: "One-click report export for any dashboard view",           status: "BACKLOG",    priority: "LOW",    projectId: analyticsProject.id,assigneeId: david.id,  creatorId: tom.id,  position: 4, labels: '["frontend"]' },

    // Auth Service (completed)
    { title: "OAuth2 provider setup",                 description: "Google, GitHub, and Microsoft SSO via Passport.js",        status: "COMPLETED",  priority: "URGENT", projectId: authProject.id,    assigneeId: james.id,  creatorId: james.id, position: 1, dueDate: new Date("2026-05-10"), labels: '["backend","security"]' },
    { title: "Session management",                    description: "Secure HTTP-only cookies, CSRF protection",                status: "COMPLETED",  priority: "HIGH",   projectId: authProject.id,    assigneeId: alex.id,   creatorId: james.id, position: 2, dueDate: new Date("2026-05-14"), labels: '["backend","security"]' },
    { title: "2FA with TOTP",                         description: "Google Authenticator-compatible TOTP implementation",      status: "COMPLETED",  priority: "HIGH",   projectId: authProject.id,    assigneeId: marcus.id, creatorId: james.id, position: 3, dueDate: new Date("2026-05-18"), labels: '["backend","security"]' },
    { title: "Audit log service",                     description: "Immutable append-only log of all auth events",            status: "COMPLETED",  priority: "MEDIUM", projectId: authProject.id,    assigneeId: james.id,  creatorId: james.id, position: 4, dueDate: new Date("2026-05-22"), labels: '["backend"]' },
    { title: "Penetration test",                      description: "External security audit — 0 critical findings",           status: "COMPLETED",  priority: "URGENT", projectId: authProject.id,    assigneeId: alex.id,   creatorId: james.id, position: 5, dueDate: new Date("2026-05-28"), labels: '["security"]' },
  ]

  const createdTasks = []
  for (const t of taskData) {
    const task = await prisma.task.create({ data: t })
    createdTasks.push(task)
  }
  console.log(`✅ ${createdTasks.length} tasks created`)

  // ── 6. COMMENTS ───────────────────────────────────────────────────────────
  const commentData = [
    { content: "Looks great! The gradient matches the new brand guidelines perfectly.",       taskId: createdTasks[0].id,  userId: alex.id   },
    { content: "I've pushed the Figma file to the shared drive, please review.",              taskId: createdTasks[0].id,  userId: priya.id  },
    { content: "Nav is live on staging — please test on mobile viewport.",                    taskId: createdTasks[1].id,  userId: james.id  },
    { content: "Tested on iPhone 14 and Samsung Galaxy S24, both look great!",               taskId: createdTasks[1].id,  userId: sarah.id  },
    { content: "FCM tokens are registering correctly in prod. Delivery rate is 98.4%.",       taskId: createdTasks[7].id,  userId: marcus.id },
    { content: "Can we also add notification grouping? Android supports it natively.",        taskId: createdTasks[7].id,  userId: james.id  },
    { content: "Rate limiter deployed to staging. Redis cluster is holding up under load.",   taskId: createdTasks[14].id, userId: marcus.id },
    { content: "Approved — merge when CI is green.",                                          taskId: createdTasks[14].id, userId: alex.id   },
    { content: "Dark mode looks stunning — matches the Figma specs exactly.",                 taskId: createdTasks[20].id, userId: sarah.id  },
    { content: "One issue: the violet-900 token is too dark on macOS True Tone displays.",   taskId: createdTasks[20].id, userId: priya.id  },
  ]

  for (const c of commentData) {
    await prisma.taskComment.create({ data: c })
  }
  console.log("✅ Comments created")

  // ── 7. NOTIFICATIONS ──────────────────────────────────────────────────────
  const notifData = [
    { type: "TASK_ASSIGNED", title: "New task assigned",         message: "Push notification integration has been assigned to you",  userId: marcus.id, read: false },
    { type: "COMMENT_ADDED", title: "New comment on your task",  message: "Alex commented on Rate limiting on all endpoints",        userId: marcus.id, read: false },
    { type: "TASK_ASSIGNED", title: "New task assigned",         message: "Dark mode token mapping has been assigned to you",        userId: elena.id,  read: false },
    { type: "TASK_COMPLETED",title: "Task completed",            message: "Homepage hero redesign was marked complete",              userId: alex.id,   read: false },
    { type: "COMMENT_ADDED", title: "Comment on your task",      message: "Priya commented on Dark mode token mapping",             userId: elena.id,  read: true  },
    { type: "TEAM_INVITE",   title: "Joined Product team",       message: "You've been added to the Product team as a Member",      userId: alex.id,   read: true  },
    { type: "PROJECT_UPDATE",title: "Auth Service completed",    message: "The Auth Service project has been marked as completed",  userId: james.id,  read: true  },
    { type: "TASK_ASSIGNED", title: "New task assigned",         message: "SEO meta tags audit has been assigned to you",           userId: david.id,  read: false },
  ]

  for (const n of notifData) {
    await prisma.notification.create({ data: n })
  }
  console.log("✅ Notifications created")

  // ── 8. ACTIVITY LOGS ──────────────────────────────────────────────────────
  const activityData = [
    { action: "task.completed",  entityType: "Task",    entityId: createdTasks[0].id,  userId: priya.id,  metadata: JSON.stringify({ taskTitle: "Redesign homepage hero section" }) },
    { action: "comment.created", entityType: "Task",    entityId: createdTasks[7].id,  userId: marcus.id, metadata: JSON.stringify({ taskTitle: "Push notification integration" }) },
    { action: "task.moved",      entityType: "Task",    entityId: createdTasks[8].id,  userId: priya.id,  metadata: JSON.stringify({ from: "TODO", to: "IN_PROGRESS" }) },
    { action: "member.joined",   entityType: "Team",    entityId: engTeam.id,          userId: marcus.id, metadata: JSON.stringify({ teamName: "Engineering" }) },
    { action: "project.created", entityType: "Project", entityId: analyticsProject.id, userId: tom.id,    metadata: JSON.stringify({ projectName: "Analytics Platform" }) },
    { action: "task.completed",  entityType: "Task",    entityId: createdTasks[27].id, userId: james.id,  metadata: JSON.stringify({ taskTitle: "Session management" }) },
    { action: "task.created",    entityType: "Task",    entityId: createdTasks[4].id,  userId: alex.id,   metadata: JSON.stringify({ taskTitle: "Page speed optimisation" }) },
  ]

  for (const a of activityData) {
    await prisma.activityLog.create({ data: a })
  }
  console.log("✅ Activity logs created")

  console.log("\n🎉 Database seeded successfully!")
  console.log("\n📋 Demo accounts (all use password: demo1234):")
  console.log("   👑  demo@teamflowpro.com     — Alex Johnson (Admin)")
  console.log("   👩  sarah@teamflowpro.com    — Sarah Kim")
  console.log("   👨  james@teamflowpro.com    — James Chen")
  console.log("   👩  priya@teamflowpro.com    — Priya Nair")
  console.log("   👨  marcus@teamflowpro.com   — Marcus Reed")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
