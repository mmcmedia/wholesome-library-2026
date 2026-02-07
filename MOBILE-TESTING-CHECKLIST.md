# Mobile Testing Checklist - Wholesome Library v2

Test on 375px viewport (iPhone SE size) using Chrome DevTools.

## 📱 Device Setup
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "iPhone SE" or set to 375px width
4. Test in both portrait and landscape

---

## ✅ Landing Page (`/`)

### Hero Section
- [ ] Text stacks vertically on mobile
- [ ] Image appears above text (flex-col-reverse)
- [ ] CTAs are full-width on mobile
- [ ] Touch targets are at least 44px height

### Pricing Cards
- [ ] Cards stack in single column
- [ ] Buttons are full-width
- [ ] Touch targets are easy to tap
- [ ] "Best Value" badge is visible

### Other Sections
- [ ] All sections scroll without horizontal overflow
- [ ] Images scale properly
- [ ] Text is readable (not too small)

---

## ✅ Auth Pages

### Signup (`/auth/signup`)
- [ ] **CRITICAL:** Tap email input → Verify NO zoom (16px font)
- [ ] **CRITICAL:** Tap password input → Verify NO zoom (16px font)
- [ ] Submit button is 48px height on mobile
- [ ] Submit button is full-width
- [ ] Form is centered and readable
- [ ] No horizontal scrolling

### Login (`/auth/login`)
- [ ] **CRITICAL:** Tap email input → Verify NO zoom
- [ ] **CRITICAL:** Tap password input → Verify NO zoom
- [ ] Submit button is 48px height
- [ ] "Forgot?" link is tappable
- [ ] Form fits viewport

---

## ✅ Onboarding (`/onboarding`)

### Step 1: Welcome
- [ ] Progress bar is visible
- [ ] Text is readable
- [ ] Input field doesn't cause zoom
- [ ] Continue button is full-width

### Step 2: Child Info
- [ ] Name input doesn't cause zoom
- [ ] Age buttons are 2-column grid
- [ ] Reading level cards are tappable
- [ ] Cards have visual feedback on tap

### Step 3: Interests
- [ ] Interest cards are 2-column grid (mobile)
- [ ] Cards show checkmark when selected
- [ ] Minimum 3 requirement is clear
- [ ] Continue button enables after 3 selected

### Step 4: Complete
- [ ] Story recommendations are visible
- [ ] CTA button is prominent
- [ ] Confetti/celebration is appropriate (reduced motion respected)

---

## ✅ Library Page (`/library`)

### Search & Filters
- [ ] Search bar is full-width
- [ ] Search input doesn't cause zoom (16px font)
- [ ] Mobile filter button (hamburger icon) visible
- [ ] Desktop filter button hidden on mobile
- [ ] Tap filter button → Sheet slides up from bottom
- [ ] Sheet is 90vh height
- [ ] Backdrop overlay is visible
- [ ] Tap backdrop → Sheet closes
- [ ] Tap X button → Sheet closes
- [ ] Filter dropdowns work in sheet
- [ ] "Apply Filters" button is full-width
- [ ] Badge shows active filter count

### Story Grid
- [ ] Stories display in single column
- [ ] Cards are full-width minus padding
- [ ] Images load and scale properly
- [ ] Touch targets for cards are easy to tap
- [ ] No horizontal scrolling

---

## ✅ Navigation

### Navbar
- [ ] Logo is visible and sized properly
- [ ] Desktop menu is hidden on mobile
- [ ] Hamburger icon is visible (right side)
- [ ] **CRITICAL:** Tap hamburger → Menu slides down
- [ ] Backdrop overlay appears
- [ ] **CRITICAL:** Tap backdrop → Menu closes
- [ ] Tap menu link → Navigates and closes menu
- [ ] CTA button in menu is full-width
- [ ] No horizontal scrolling in menu

---

## ✅ Story Reader (`/story/[slug]`)

### Layout
- [ ] Story content is full-width (no overflow)
- [ ] Text is readable (not too small)
- [ ] Toolbar adapts to mobile (bottom position if applicable)
- [ ] No horizontal scrolling

### Touch Gestures
- [ ] **CRITICAL:** Swipe right → Previous chapter
- [ ] **CRITICAL:** Swipe left → Next chapter
- [ ] Swipe threshold feels natural (~75px)
- [ ] Chapter transition is smooth
- [ ] On last chapter → Completion screen shows

### Controls
- [ ] Chapter navigation buttons are tappable
- [ ] Font size controls work
- [ ] Theme switcher works
- [ ] Settings menu is accessible

---

## ✅ Parent Dashboard (`/parent`)

### Layout
- [ ] Tabs fit viewport width
- [ ] Stats cards stack vertically
- [ ] Cards are full-width

### Child Selector
- [ ] Child buttons wrap properly
- [ ] Touch targets are adequate
- [ ] "Add Child" button is visible

### Preferences Tab
- [ ] **CRITICAL:** Switches are 44px touch targets
- [ ] Switch labels are readable
- [ ] Switches have clear on/off states
- [ ] Tapping label area toggles switch
- [ ] Save button is full-width

### Account Tab
- [ ] Info sections are stacked
- [ ] Buttons are full-width
- [ ] Links are easy to tap

---

## ✅ Accessibility Checks

### Touch Targets (WCAG 2.1 Level AA)
- [ ] All interactive elements are minimum 44x44px
- [ ] Buttons have adequate spacing
- [ ] Links are easy to distinguish

### Text Readability
- [ ] Minimum 16px font on inputs (prevents iOS zoom)
- [ ] Body text is at least 14px
- [ ] Contrast ratios meet WCAG AA (4.5:1)

### Focus States
- [ ] Tab through form → Focus indicator is visible
- [ ] Focus indicator is at least 2px
- [ ] Focus order is logical

### Reduced Motion
- [ ] Enable "Reduce Motion" in OS settings
- [ ] Animations either stop or are very brief
- [ ] Transitions are instant or <0.1s

---

## 🐛 Common Issues to Watch For

1. **iOS Zoom on Input Focus**
   - Problem: Input fields cause viewport to zoom in
   - Fix: Ensure all inputs have `fontSize: '16px'` (16px minimum)

2. **Touch Target Too Small**
   - Problem: User has to tap multiple times to hit button
   - Fix: Ensure min-height/width of 44px (WCAG)

3. **Horizontal Scrolling**
   - Problem: Page is wider than viewport
   - Fix: Check for elements with fixed widths, images without max-width

4. **Menu Not Closing**
   - Problem: Backdrop tap doesn't close menu
   - Fix: Ensure backdrop has onClick handler and proper z-index

5. **Text Too Small**
   - Problem: User has to zoom to read
   - Fix: Minimum 14px body text, 16px for inputs

6. **No Feedback on Tap**
   - Problem: User isn't sure if tap registered
   - Fix: Add active states, hover effects (tap highlights)

---

## 🧪 Real Device Testing (Recommended)

After DevTools testing, test on actual devices if possible:

### iOS Devices
- [ ] iPhone SE (375px) - Minimum size
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)

### Android Devices
- [ ] Pixel 5 (393px)
- [ ] Galaxy S21 (360px)
- [ ] Tablet (800px+)

### Browsers
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Firefox (Android)
- [ ] Samsung Internet

---

## 📊 Performance Checks

### Mobile Network Simulation
1. DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Reload page
4. [ ] Page loads in <5 seconds
5. [ ] Skeleton/loading states show immediately
6. [ ] Images lazy load

### Lighthouse Audit
1. DevTools → Lighthouse tab
2. Select "Mobile" device
3. Run audit
4. [ ] Performance score >90
5. [ ] Accessibility score 100
6. [ ] Best Practices score >90

---

## ✅ Sign-Off

**Tester:** _______________  
**Date:** _______________  
**Device Used:** _______________  
**Issues Found:** _______________

**Overall Status:**
- [ ] Ready for production
- [ ] Minor issues (list in notes)
- [ ] Major issues (blocking)

**Notes:**
____________________________________________
____________________________________________
____________________________________________
