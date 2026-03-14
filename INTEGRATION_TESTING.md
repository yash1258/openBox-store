# Integration Testing Guide

Complete end-to-end testing scenarios for OpenBox Store.

## 🎯 Test Scenarios

### Scenario 1: Daily Routine Workflow
Tests the complete analytics and reporting flow.

**Steps:**
1. [ ] Visit store homepage (`/`)
2. [ ] View 3-5 different products (`/product/[id]`)
3. [ ] Search for a product
4. [ ] Add 2-3 products to cart
5. [ ] View cart page
6. [ ] Complete checkout (place test order)
7. [ ] Wait for next day OR manually trigger daily report
8. [ ] Navigate to Admin → Reports
9. [ ] Verify yesterday's report was generated
10. [ ] Open the report and verify:
    - Page views match your visits
    - Product views counted
    - Cart adds recorded
    - Order appears with correct total
    - AI summary generated
    - AI recommendations displayed

**Expected Results:**
- All events tracked correctly
- Report auto-generated at 9 AM (or manual trigger works)
- AI provides insights on performance
- Data persists in database

---

### Scenario 2: AI Assistant Functionality
Tests the AI chat and tools integration.

**Steps:**
1. [ ] Login to admin panel
2. [ ] Click AI chat button (bottom right)
3. [ ] Ask: "How many orders today?"
4. [ ] Verify AI responds with current order count
5. [ ] Ask: "What's low in stock?"
6. [ ] Verify AI lists low stock products
7. [ ] Ask: "Show me trending products"
8. [ ] Verify AI shows most viewed products
9. [ ] Ask: "Compare this week vs last week"
10. [ ] Verify AI provides comparison data
11. [ ] Click a suggested question
12. [ ] Verify quick reply works

**Expected Results:**
- AI responds within 5-10 seconds
- All 7 tools working correctly
- Data is accurate and up-to-date
- Suggestions display properly
- Chat history persists (LocalStorage)

---

### Scenario 3: Real-time Analytics
Tests live dashboard and auto-refresh.

**Steps:**
1. [ ] Open Admin → Analytics in one tab
2. [ ] Open store in another tab (incognito)
3. [ ] Browse products in incognito tab
4. [ ] Wait 30 seconds (or click refresh)
5. [ ] Check Analytics tab - visitor count should increase
6. [ ] Add product to cart in incognito
7. [ ] Wait for auto-refresh
8. [ ] Verify cart adds updated
9. [ ] Complete an order
10. [ ] Verify orders and revenue updated

**Expected Results:**
- Auto-refresh works every 30 seconds
- Live data reflects real activity
- Conversion rates calculate correctly
- Trending products update
- No console errors

---

### Scenario 4: Mobile Experience
Tests all features on mobile devices.

**Steps:**
1. [ ] Open admin on mobile (or use DevTools mobile view)
2. [ ] Navigate to all pages:
   - Dashboard
   - Analytics
   - Products
   - Inventory
   - Reports
3. [ ] Test AI chat widget:
   - Open chat
   - Send message
   - Scroll through history
   - Close chat
4. [ ] Test horizontal navigation scrolling
5. [ ] Verify all buttons are tappable
6. [ ] Check that text is readable
7. [ ] Verify no horizontal scroll issues

**Expected Results:**
- All pages usable on mobile
- Chat widget fits screen
- Navigation scrolls horizontally
- No layout breaks
- Touch targets are adequate size (min 44px)

---

### Scenario 5: Authentication & Security
Tests auth flow and security features.

**Steps:**
1. [ ] Try accessing `/admin` without login → Should redirect to login
2. [ ] Login with valid credentials
3. [ ] Verify session persists across page navigation
4. [ ] Try accessing API endpoints without auth:
   ```bash
   curl http://localhost:3000/api/admin/reports
   # Should return 401
   ```
5. [ ] Test dev bypass (development only)
6. [ ] Logout and verify session destroyed
7. [ ] Try accessing `/admin` again → Should redirect

**Expected Results:**
- Protected routes require auth
- API endpoints return 401 for unauthenticated requests
- Session management works correctly
- Dev bypass only works in development

---

### Scenario 6: Product Management
Tests CRUD operations and inventory tracking.

**Steps:**
1. [ ] Login to admin
2. [ ] Go to Products → Add new product
3. [ ] Fill all required fields
4. [ ] Save product
5. [ ] Verify product appears in list
6. [ ] Edit product (change price, stock)
7. [ ] Save changes
8. [ ] View product on storefront
9. [ ] Mark product as sold
10. [ ] Verify inventory updated
11. [ ] Delete product (or mark as unavailable)

**Expected Results:**
- Products created successfully
- Inventory updates reflect in analytics
- Changes visible on storefront
- No data loss during edits

---

### Scenario 7: Daily Report Automation
Tests cron job and automated reports.

**Steps:**
1. [ ] Go to Admin → Reports
2. [ ] Click "Run Yesterday's Report" button
3. [ ] Wait for generation (may take 10-15 seconds if AI enabled)
4. [ ] Verify report appears in list
5. [ ] Open report and verify data
6. [ ] Check that AI summary was generated
7. [ ] Verify report is marked "Auto-generated"

**Expected Results:**
- Manual trigger works
- Report generates with all metrics
- AI insights included
- No errors in console

---

## 🔧 Manual Testing Commands

### Test Event Tracking
```bash
# Check database for events
npx prisma studio
# Navigate to AnalyticsEvent table
```

### Test API Endpoints
```bash
# Live stats
curl http://localhost:3000/api/analytics/live

# Inventory
curl http://localhost:3000/api/analytics/inventory

# Daily reports (requires auth cookie)
curl http://localhost:3000/api/admin/reports?range=7d
```

### Test AI Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: seller_session=YOUR_SESSION_COOKIE" \
  -d '{"message": "How many orders today?"}'
```

---

## ✅ Pre-Release Checklist

- [ ] All test scenarios pass
- [ ] No console errors in browser
- [ ] Build succeeds: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Database migrations work: `npx prisma db push`
- [ ] AI features work (if OPENROUTER_API_KEY set)
- [ ] Mobile responsive on iPhone/Android
- [ ] Performance: Page load < 3 seconds
- [ ] All links work correctly
- [ ] Images load properly
- [ ] Forms validate correctly
- [ ] Error handling works (404, 500 pages)

---

## 🐛 Common Issues & Solutions

### Issue: AI not responding
**Solution:** Check OPENROUTER_API_KEY is set and valid

### Issue: Daily report not generating
**Solution:** Check CRON_SECRET is configured, verify database connection

### Issue: Events not tracking
**Solution:** Check AnalyticsTracker component is mounted, verify cookies enabled

### Issue: Mobile layout broken
**Solution:** Check viewport meta tag, verify Tailwind responsive classes

### Issue: Build fails
**Solution:** Run `npm run lint`, fix TypeScript errors, check imports

---

## 📊 Performance Benchmarks

**Target Metrics:**
- Page load time: < 3 seconds
- Time to interactive: < 5 seconds
- API response time: < 500ms
- AI response time: < 10 seconds
- Build time: < 60 seconds

**Test with:**
- Chrome DevTools Lighthouse
- WebPageTest
- GTmetrix

---

## 🎉 You're Ready!

If all tests pass, the app is production-ready! 🚀

Remember to:
1. Remove dev bypass code (see REMOVAL_GUIDE.md)
2. Set production environment variables
3. Configure production database
4. Set up monitoring (optional)

**Questions?** Open an issue on GitHub.
