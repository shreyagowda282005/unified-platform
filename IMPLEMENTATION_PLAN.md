# 🧭 Full Implementation Plan

This plan translates the latest product requirements into actionable milestones. It covers backend data sources, API contracts, frontend wiring, and deployment considerations so every surface runs on live data with zero mock content.

---

## 1. Program Overview

| Area | Goal | Outputs |
| --- | --- | --- |
| Social Integrations | Pull real follower + engagement data from Instagram, TikTok, YouTube, Twitter | OAuth apps, token storage, nightly sync jobs, `/api/social/*` responses |
| Earnings & Campaign Data | Replace placeholder values with actual DB records | Mongo schemas, aggregate queries, `/api/influencer/overview`, `/api/brand/overview` |
| Frontend Experience | Responsive landing, dashboards, chat, portfolio, AI assistant, admin, auth | React pages powered by live APIs with loading + empty states |
| Mobile Responsiveness | Ensure every page stacks gracefully, with mobile nav affordances | CSS breakpoints, optional Flutter parity |
| Documentation | Keep dev setup discoverable for new contributors | `GETTING_STARTED.md`, `SOCIAL_MEDIA_SETUP.md`, `AI_ASSISTANT_SETUP.md`, this plan |

---

## 2. Backend Data & APIs

### 2.1 Data Model Extensions
- `users` collection: ensure fields for profile info, social links, rates, role, status.
- `influencerProfiles`: add `metrics` sub-document (followers, engagement, views, lastSynced).
- `campaigns`: track deadlines, requirements, invited influencers, spend, ROI.
- `earnings`/`payouts`: amounts, status, campaign reference, issuedOn.
- `analyticsSnapshots`: per user per day (growth, engagement, content mix).
- `messages`: preserve sender/receiver IDs, timestamps, attachments.

### 2.2 Social Metric Sync Services
| Platform | Scope Needed | Data Pulled | Frequency |
| --- | --- | --- | --- |
| Instagram Graph | `instagram_basic`, `pages_show_list` | Followers, engagement, top media | On login + nightly cron |
| TikTok API | `user.info.basic`, `user.info.stats` | Followers, video views, engagement | On login + nightly cron |
| YouTube Data API v3 | `youtube.readonly` | Subscribers, view counts, watch time | On login + nightly cron |
| Twitter API v2 | `tweet.read`, `users.read` | Followers, tweet engagement | On login + nightly cron |

Implementation steps:
1. Build `/api/social/{platform}/connect` + `/callback` routes (Instagram & YouTube already scaffolded).
2. Store `accessToken`, `refreshToken`, `expiresAt`, `scopes` per user.
3. Create reusable `socialMetricsService` that:
   - refreshes tokens when near expiry,
   - hits platform APIs,
   - normalizes data into `influencerProfiles.metrics`.
4. Add `socialMetricsSyncJob` (cron @ 1am UTC) + manual trigger on login.

### 2.3 Core API Endpoints
| Endpoint | Purpose |
| --- | --- |
| `GET /api/influencer/overview` | Profile completion %, earnings summary, applications, campaigns |
| `GET /api/influencer/analytics` | Time-series follower + engagement data, content performance |
| `GET /api/portfolio` / `POST /api/portfolio` | List & manage media items |
| `GET /api/brand/overview` | Campaign totals, applications, spend, ROI |
| `GET /api/brand/campaigns` | Paginated campaign cards |
| `GET /api/campaigns/:id` | Full campaign details + applicants |
| `GET /api/messaging/threads` + `GET /api/messaging/:threadId` | Chat list + thread history |
| `POST /api/messaging/:threadId/messages` | Send message (text/file) |
| `GET /api/analytics/overview` | Growth, engagement, views, ROI cards |
| `GET /api/analytics/charts` | Line/donut/bar chart datasets |
| `GET /api/admin/{users,campaigns,payments,reports}` | Admin tables |
| `POST /api/profile` | Save influencer/brand profile updates |

All endpoints must:
- Authenticate via JWT/session,
- Return loading-friendly payloads (e.g. `null` for missing sections),
- Include `updatedAt` for caching/throttling,
- Support pagination where needed.

---

## 3. Frontend Architecture

### 3.1 Global Improvements
- Introduce typed API hooks (`useInfluencerOverview`, `useBrandCampaigns`, etc.).
- Standardize loading, empty, and error states.
- Build card and chart primitives so styling is consistent.
- Add responsive grid utilities (e.g. `.grid-1-2`, `.grid-1-3`) to CSS.
- Ensure all CSS uses tokens (colors, spacing, shadows) for quick theming.

### 3.2 Page-by-Page Tasks
1. **Landing Page**
   - Replace hero with background + gradient overlay.
   - Add services cards & showcase, logos, footer.
   - Tie CTA buttons to `/signup?role=influencer|brand`.

2. **Influencer Dashboard**
   - Replace static cards with API-driven components.
   - Charts: integrate Recharts fed by `/api/influencer/analytics`.
   - Portfolio preview grid + CTA linking to portfolio page.
   - AI tips: surface data from `/api/ai/recommendations`.

3. **Portfolio Upload Page**
   - Instagram-style grid, responsive columns.
   - Upload modal (dropzone + metadata).
   - Post modal with edit/delete actions using portfolio APIs.

4. **Brand Dashboard**
   - KPI cards (campaigns, applications, spend, ROI).
   - Campaign list component with status chips.
   - Create Campaign button linking to form page.
   - Campaign details layout with requirements/applicants/chat hook.

5. **Messaging**
   - Chat list (avatars, previews, timestamps).
   - Thread view with bubble colors (already updated) + attachments.
   - Socket.io integration for live updates.

6. **AI Assistant Page**
   - Full-page chat using same hook as floating assistant.
   - Suggested prompts panel.
   - Persist conversation per user (local or via backend).

7. **Analytics**
   - Metrics cards + charts pulling `/api/analytics/*`.
   - Filters (date range, campaign).

8. **Admin Panel**
   - Tabs, tables with sorting/filtering, action menus.
   - Use shared table component.

9. **Auth Pages**
   - Shared card with toggles, Google button.
   - Role-specific signup fields.
   - Validation + API errors.

10. **Profile Settings**
    - Form sections bound to `/api/profile`.
    - Auto-save or explicit Save button with success toast.
    - Social link statuses reflecting OAuth connections.

11. **Mobile Adjustments**
    - Define breakpoints (e.g. 0-640, 641-1024, 1025+).
    - Stack cards, switch grids to 2-column, add bottom nav (if desired).
    - Use floating “+” for uploads on small screens.

---

## 4. Implementation Phases

1. **Backend Foundations (Week 1)**
   - Finish social OAuth flows for TikTok + Twitter.
   - Create metric sync jobs + storage.
   - Build overview/profile/campaign endpoints.

2. **Frontend Data Wiring (Week 2)**
   - Landing + Influencer Dashboard fully dynamic.
   - Portfolio page with upload modal.
   - Brand dashboard + campaign list wired to live APIs.

3. **Messaging, AI, Analytics (Week 3)**
   - Hook messaging to Socket.io backend.
   - Launch full AI assistant page.
   - Build analytics overview + charts with real data.

4. **Admin, Auth, Profile Polish (Week 4)**
   - Admin tables, auth refinements, profile settings auto-save.
   - Accessibility + responsive QA.

5. **Testing & Deployment (Week 5)**
   - Integration tests for endpoints.
   - Cypress/Playwright flows for key journeys.
   - Load testing for analytics endpoints.
   - Finalize docs & environment variables.

---

## 5. Environment Variables & Secrets

| Variable | Description |
| --- | --- |
| `INSTAGRAM_CLIENT_ID/SECRET` | Instagram Graph API |
| `YOUTUBE_CLIENT_ID/SECRET` | YouTube Data API |
| `TIKTOK_CLIENT_ID/SECRET` | TikTok Business API |
| `TWITTER_CLIENT_ID/SECRET` | Twitter API v2 |
| `BACKEND_URL` | Needed for OAuth callback construction |
| `FRONTEND_URL` | For redirecting after OAuth |
| `OPENAI_API_KEY` (optional) | AI assistant |
| `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY` | Existing config |

All secrets should be stored via `.env` + deployment provider secret managers.

---

## 6. Testing Strategy

- **Unit tests**: services for social sync, analytics aggregation, profile updates.
- **Integration tests**: API endpoints using Supertest + in-memory Mongo.
- **Frontend tests**: React Testing Library for critical components, Cypress for flows (login, dashboard, messaging, campaign creation).
- **Manual QA**: cross-browser (Chrome/Safari/Firefox), mobile viewport smoke tests.

---

## 7. Open Questions / Next Inputs Needed
1. Do we have existing TikTok/Twitter OAuth apps or should we create new ones?
2. Is there historical analytics data to seed the charts, or do we start collecting now?
3. Preferred charting library (currently Recharts) — ok to continue?
4. Should we support Flutter/mobile natively, or focus on responsive web for now?

Provide answers when available, but development can begin with placeholder responses and toggle once data is flowing.

---

## 8. Immediate Next Steps

1. Finalize and store all social API credentials (per `SOCIAL_MEDIA_SETUP.md`).
2. Approve Mongo schema additions (users, metrics, earnings, analytics).
3. Kick off Phase 1 tasks (OAuth flows + sync jobs + overview endpoints).
4. Begin designing landing + dashboard components in React with loading states.

Once these are in motion, we’ll update this plan with progress notes and link PRs to each checklist item.

---

This document will evolve; treat it as the single source of truth for scope and sequencing. Let me know if you want it broken into Jira tickets or GitHub issues.


