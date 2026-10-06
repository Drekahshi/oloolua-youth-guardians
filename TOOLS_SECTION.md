# 🧰 Conservation Tools Hub & Unified Suite

This directory contains the standalone **Tools Section** for the **Oloolua Forest Youth Guardians CFA** / **KAI Conservation Information Hub**.

---

## 🌟 What is Included in the Tools Suite?

The Tools Suite unifies 2 core conservation tools into one modular console:

1. **🛡️ Guardian Hub Console**
   - Live nursery stock metrics (current seedlings in stock, dynamic calculations).
   - Seedbed inventory & propagation capacity overview.
   - Live PostgreSQL (Neon DB) ledger stream.
   - Direct links to detailed inventory reports and logs.

2. **✍️ Record Activity Engine**
   - Quick in-line logger and modal logger.
   - Supported event types: `PROPAGATION`, `SOWING`, `POTTING`, `WEEDING`, `WATERING`, `PLANTING`, `SALE`, `DONATION`, `MORTALITY`.
   - Real-time stock balancing and Hedera Consensus Service (HCS) readiness.

---

## 📁 Modular Files Structure

If you want to push or copy just this tool component without the whole project:

```
oloolua-youth-guardians/
├── src/
│   ├── app/
│   │   └── tools/
│   │       └── page.tsx            # Main Unified Tools Suite Page
│   ├── components/
│   │   ├── ToolsDropdown.tsx       # Quick Navigation & Dropdown component
│   │   ├── RecordActivityModal.tsx # Interactive Activity Logger Modal
│   │   └── LiveActivityTracker.tsx # Real-time DB Event Feed
│   └── types/
│       └── kai.ts                  # Shared data models & TypeScript types
```

---

## 🚀 How to Run the Tools Suite

Start the Next.js development server:

```powershell
# From the oloolua-youth-guardians folder:
npm run dev -- -p 3002
```

Navigate to:
- **Tools Suite**: [http://localhost:3002/tools](http://localhost:3002/tools)
- **Guardian Portal**: [http://localhost:3002/portal](http://localhost:3002/portal)

---

## 📦 How to Push Only the Tools Module to GitHub

To commit and push just the Tools Section changes:

```powershell
# Stage only the Tools module files
git add src/app/tools/ src/components/ToolsDropdown.tsx src/components/Navigation.tsx src/components/Footer.tsx src/components/KaiTopBar.tsx TOOLS_SECTION.md

# Commit the tools feature
git commit -m "feat(tools): streamline tools suite to Guardian Hub and Record Activity"

# Push to your repository
git push origin main
```
