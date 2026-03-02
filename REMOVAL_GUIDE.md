# 🚨 Dev Bypass Removal Guide

This guide helps you remove all development bypass features before deploying to production.

## Quick Removal Checklist

- [ ] Delete API endpoint
- [ ] Remove UI button from login page
- [ ] Clean up imports
- [ ] Remove environment variable
- [ ] Update documentation
- [ ] Test production build

---

## Step-by-Step Instructions

### Step 1: Delete Dev Login API

**File:** `src/app/api/auth/dev-login/route.ts`

**Action:** Delete the entire file

```bash
rm src/app/api/auth/dev-login/route.ts
```

---

### Step 2: Remove Dev Login UI

**File:** `src/app/(auth)/login/page.tsx`

**Remove these sections (marked with [DEV-BYPASS]):**

1. **Remove the comment block at the top:**
```typescript
// =============================================================================
// 🚨 DEV LOGIN BYPASS - REMOVE BEFORE PRODUCTION DEPLOYMENT 🚨
// =============================================================================
// ... entire comment block ...
// =============================================================================
```

2. **Remove the import:**
```typescript
// Remove Terminal from imports:
import { Package, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
// Terminal removed ☝️
```

3. **Remove the isDev check:**
```typescript
// DELETE:
const isDev = process.env.NODE_ENV === 'development';
```

4. **Remove the state:**
```typescript
// DELETE:
const [isDevLoading, setIsDevLoading] = useState(false);
```

5. **Remove the function:**
```typescript
// DELETE everything from [DEV-BYPASS] to [END-DEV-BYPASS]:
// [DEV-BYPASS] Dev bypass function...
const handleDevLogin = async () => { ... };
// [END-DEV-BYPASS]
```

6. **Remove the button:**
```jsx
{/* [DEV-BYPASS] ... */}
{isDev && (
  <button>...</button>
)}
{/* [END-DEV-BYPASS] */}
```

7. **Optional: Remove demo credentials from footer:**
```jsx
// Remove this if you don't want to show demo credentials:
<p className="text-xs text-stone-600">
  Demo: seller@example.com / password123
</p>
```

---

### Step 3: Clean Environment Variables

**File:** `.env`

**Remove:**
```env
# Remove these lines:
DEV_LOGIN_SECRET=your-cron-secret-key-here-change-in-production

# And these:
# OPENROUTER API KEY - For AI Assistant
# ...
# OPENROUTER_API_KEY=sk-or-v1-...
```

**Keep only:**
```env
DATABASE_URL="postgresql://..."
DEV_API_KEY=dev-api-key-12345  # If needed for API testing
CRON_SECRET=your-secret
OPENROUTER_API_KEY=your-key    # Keep this if using AI
```

---

### Step 4: Update Documentation

**Files to update:**
- `README.md` - Remove dev login references
- `API.md` - Remove dev login endpoint docs

**Search for:** "dev-login", "Dev Login", "dev bypass"

**Remove sections like:**
```markdown
- `POST /api/auth/dev-login` - Dev bypass (development only)
```

---

### Step 5: Verify Removal

**Run these commands:**

```bash
# 1. Search for any remaining dev-login references
grep -r "dev-login" src/ --include="*.ts" --include="*.tsx"
grep -r "Dev.*[Ll]ogin" src/ --include="*.ts" --include="*.tsx"
grep -r "DEV_LOGIN" src/ --include="*.ts" --include="*.tsx"

# 2. Build the app
npm run build

# 3. Test login with real credentials
# Should work: seller@example.com / password123
# Should NOT show "Dev: Skip Login" button
```

---

## What Gets Removed

### Files Deleted:
- `src/app/api/auth/dev-login/route.ts`

### Code Removed:
- Dev login API endpoint
- Dev login button from UI
- Dev-related state and functions
- Dev-related imports
- Dev environment checks

### Security Improved:
- ✅ No bypass routes exist
- ✅ All endpoints require proper authentication
- ✅ No hardcoded secrets in UI
- ✅ Clean production build

---

## Post-Removal Checklist

- [ ] `npm run build` passes without errors
- [ ] Login page shows only "Sign In" button
- [ ] Login works with: seller@example.com / password123
- [ ] No "Dev: Skip Login" button visible
- [ ] All admin pages require login
- [ ] API calls return 401 when not authenticated
- [ ] Search shows no "dev-login" references

---

## Need Help?

If you accidentally break something:

1. **Check git status:** `git status`
2. **Revert changes:** `git checkout -- src/app/(auth)/login/page.tsx`
3. **Restore dev login:** Copy from git history
4. **Try again** following the steps above

---

**Remember:** This bypass is ONLY for development. Never deploy to production with these features enabled!
