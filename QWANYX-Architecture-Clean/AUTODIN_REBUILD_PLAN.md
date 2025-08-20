# 🚗 AUTODIN Rebuild Plan - Progressive Bottom-Up Construction

## 🎯 The Principle: Build Only What's Needed

**FUNDAMENTAL RULE:** qwanyx-ui starts EMPTY. We add components ONE AT A TIME, only when needed, with **intégriste, paranoïde et psychorigide** adherence to principles.

## 🔄 The Process

### Progressive Unpacking Approach
1. **Start with an empty qwanyx-ui**
2. **Identify what Navbar needs** → Add ONLY that
3. **Each addition must be PERFECT** before moving on
4. **Refactor with paranoid attention** to principles
5. **Test completely** before next component

### Example Chain:
```
Navbar needs Theme → Add ThemeProvider (perfect it) →
Theme works → Navbar needs Button → Add Button atom (perfect it) →
Button needs Icon → Add Icon atom (perfect it) →
Continue...
```

## 🎯 Objective
Rebuild Autodin from autodin-backup following QWANYX architecture STRICTLY:
- ✅ Import ONLY from @qwanyx/app-core
- ✅ NO native HTML elements  
- ✅ Progressive bottom-up construction
- ✅ Perfect each component before adding next
- ✅ Intégriste respect for principles

## 📋 Current Status

### ✅ Completed
- [x] Examined autodin-backup structure
- [x] Created base autodin page with proper imports

### 🔄 In Progress
- [ ] **Step 1: Navbar Implementation**

### 📅 Upcoming Steps

#### Step 1: Navbar ⏳
**Status:** In Progress  
**Component:** Use existing `Navbar` from @qwanyx/ui  
**Requirements:**
- Logo display
- Navigation menu items (Accueil, Services, Contact)
- Search bar functionality
- Login/Register buttons
- User menu when authenticated
- Sticky positioning with blur effect

**Implementation Notes:**
```typescript
// Must import from @qwanyx/app-core, NOT @qwanyx/ui
import { Navbar } from '@qwanyx/app-core'
```

---

#### Step 2: Hero Section 🤔
**Status:** Pending - Needs Philosophy Discussion  
**Component:** `HeroWithFlipSection`  
**Philosophical Concerns:**
- Is a flip animation an atom, molecule, or organism?
- Should hero sections be in sections/ or organisms/?
- How to handle complex animations in atomic design?

**Requirements:**
- Background image with overlay
- Title and subtitle
- Call-to-action buttons
- Image flip animation on the right
- Parallax effect

---

#### Step 3: Services Section 📦
**Status:** Pending  
**Components:** `Grid` + `ServiceCard`  
**Requirements:**
- 6 service cards in a 3-column grid
- Each card with icon, title, description
- Orange accent color (#E67E22)
- Consistent spacing

**Implementation:**
```typescript
<Grid cols={3}>
  <ServiceCard icon="search" title="..." />
  // ... 5 more cards
</Grid>
```

---

#### Step 4: Contact Form Section 📧
**Status:** Pending  
**Component:** `ContactFormSection`  
**Requirements:**
- Full-width section with background
- Form with multiple field types
- Validation with Zod
- Submit handler
- Success/error feedback

---

#### Step 5: Footer Section 🦶
**Status:** Pending  
**Component:** `SimpleFooterSection`  
**Requirements:**
- Company information
- Address and contact details
- Legal links
- Social media icons
- Copyright notice

---

#### Step 6: Authentication Modal 🔐
**Status:** Pending  
**Component:** `AuthModule` from @qwanyx/auth  
**Requirements:**
- Modal presentation
- Login/Register modes
- Passwordless authentication
- Custom fields for registration
- Session persistence

---

## 🔍 Verification Checklist

After each step, verify:
- [ ] Zero TypeScript errors
- [ ] NO native HTML elements used
- [ ] All imports from @qwanyx/app-core only
- [ ] Components follow atomic design
- [ ] Props use semantic names (no CSS)
- [ ] Style grammar used where applicable
- [ ] Theme variables properly applied

## 📝 Notes & Decisions

### Navbar vs SuperNavbar
- **Decision:** Use `Navbar` component (SuperNavbar was renamed)
- **Date:** Current session

### Component Location Guidelines
- **Atoms:** Basic elements (Button, Input, Icon)
- **Molecules:** Simple compositions (FormField, Card)
- **Organisms:** Complex, standalone components (Navbar, Dashboard)
- **Sections:** Full-width page sections (HeroSection, ContactSection)
- **Templates:** Page layouts
- **Pages:** Complete views (assembled in apps)

## 🚀 Next Actions

1. Complete Navbar implementation
2. Update this document when step completed
3. Discuss Hero philosophy before implementing
4. Continue with remaining steps

---

**Last Updated:** Current Session  
**Status:** Step 1 - Navbar Implementation in progress