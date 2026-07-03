
  # CONTEXT.md — Zenly Landing Page Brief                                                                                                                       
                                                                                                                                                                
  ---
                                                                                                                                                                
  ## PRODUCT                                                                                                                                                  

  **What it does (one sentence):**                                                                                                                              
  Zenly is a multi-tenant booking and operations platform that lets customers book appointments online while giving staff, managers, and admins a unified ERP
  for managing bookings, staff, locations, payments, and daily reconciliation — for any appointment-based service business.                                     
                                                                                                                                                              
  **Core problem it solves:**                                                                                                                                   
  Replaces manual phone-based booking and Excel-based daily revenue reconciliation with a role-based digital system that prevents revenue leakage, enforces   
  financial controls, and streamlines multi-staff/multi-location operations — across any service vertical.                                                      
   
  **How it works (the mechanism):**                                                                                                                             
  - **Customer side:** 6-step guided booking flow — select branch → choose service → pick date/time → enter details → confirm → receive booking number        
  - **Staff side:** Real-time dashboard with quick filters, staff assignment, payment recording, and discount approval workflows                                
  - **Manager side:** Analytics (revenue, staff utilization, booking pipeline), daily closing/reconciliation reports, audit logs, multi-branch views            
  - **Backend:** Supabase Postgres with RLS, real-time subscriptions, automated triggers for location conflicts, pricing snapshots, and financial locks on      
  completed bookings                                                                                                                                            
  - **Multi-vertical config:** An industries system controls all business-type-specific terminology and features via database config — zero code changes to     
  onboard a new vertical                                                                                                                                        
                                                                                                                                                              
  ---                                                                                                                                                           
                                                                                                                                                              
  ## AUDIENCE                                                                                                                                                   
   
  **Primary users:**                                                                                                                                            
  - **Customers:** Anyone booking a service appointment — massage, haircut, dental visit, tattoo, physio, personal training, cleaning — who wants to book online
   without a phone call                                                                                                                                         
  - **Staff/Managers:** Service business owners, branch managers, and front-desk staff needing to replace Excel, prevent double-bookings, and close daily
  revenue in seconds                                                                                                                                            
                                                                                                                                                              
  **Pain points (customers):**                                                                                                                                  
  - No way to see real-time slot availability                                                                                                                 
  - No transparency into services and pricing before arriving                                                                                                   
  - Can't book, reschedule, or check status online — must call                                                                                                  
                                                                                                                                                                
  **Pain points (staff/managers):**                                                                                                                             
  - 30+ minutes/day on manual Excel revenue reports — error-prone and unverifiable                                                                              
  - No real-time visibility into room/station availability and staff schedules                                                                                  
  - No audit trail for discounts or financial accountability                                                                                                    
  - Impossible to scale operations across multiple branches                                                                                                     
  - Separate tools for booking and operations that don't talk to each other                                                                                     
                                                                                                                                                                
  **Desired outcome (customers):**                                                                                                                              
  Quick, frictionless booking with instant confirmation and clear pricing upfront.                                                                            
                                                                                                                                                                
  **Desired outcome (staff/managers):**
  30-second daily revenue close, zero double-bookings, traceable discount approvals, payment reconciliation by mode (cash/card/online), multi-branch reporting —
   all in one place.                                                                                                                                            
   
  ---                                                                                                                                                           
                                                                                                                                                              
  ## FEATURES & BENEFITS

  1. **6-Step Customer Booking Flow**                                                                                                                           
     Guides customers from location → service → time → details → confirm → booking number. Eliminates phone calls, reduces abandonment, captures all required
  data automatically.                                                                                                                                           
                                                                                                                                                              
  2. **Real-Time Conflict Prevention**                                                                                                                          
     Database-level constraint prevents double-booking any room/station or staff member simultaneously. Zero scheduling conflicts, guaranteed.                
                                                                                                                                                                
  3. **Integrated Pricing & Discount Engine**                                                                                                                   
     Price snapshots at booking time. Role-based discount limits (staff 15%, manager 50%). Discount reason always required. Every change is audited and         
  traceable.                                                                                                                                                    
                                                                                                                                                              
  4. **One-Click Daily Closing & Reconciliation**                                                                                                               
     Auto-calculates gross revenue, discounts, net revenue, payment mode breakdown, pending payments, and booking counts. Replaces Excel entirely. Locks the day
   from further edits after close.                                                                                                                              
                                                                                                                                                              
  5. **Multi-Tenant & Multi-Branch Architecture**                                                                                                               
     Org-scoped data isolation, branch-level operations, consolidated admin dashboards. Scales to 10+ branches without redesign. Every org runs independently 
  with its own slug, timezone, and currency.                                                                                                                    
   
  6. **Industry Configuration System**                                                                                                                          
     One platform, any vertical. Terminology, feature flags, and service categories are all configured per industry type — not hardcoded. Adding a new vertical
  requires one SQL record, not a code rewrite.                                                                                                                  
   
  **Key differentiators vs. alternatives:**                                                                                                                     
  - Not a generic calendar app (Calendly, Acuity) — built for multi-staff, multi-room coordination with financial controls                                    
  - Not a POS (Square, Toast) — built for service scheduling, not retail transactions                                                                           
  - Financial controls are database-enforced, not just policy-based                                                                                             
  - Staff-first UX: fast data entry, real-time updates without page refresh                                                                                     
  - One platform for customers AND staff — not two separate products                                                                                            
  - Industry-aware: the platform speaks your business's language out of the box                                                                               
                                                                                                                                                                
  ---                                                                                                                                                         
                                                                                                                                                                
  ## PLATFORM SCOPE — GENERIC MULTI-VERTICAL                                                                                                                  

  Zenly is NOT spa-only. The architecture is a **multi-vertical, multi-tenant booking platform** that can serve any appointment-based service business. The spa 
  (Nuad Thai) is the first live tenant — not the product definition.
                                                                                                                                                                
  ### Industries Already Supported (via config only, zero code changes)                                                                                         
   
  | Vertical | Staff Label | Location Label | Rooms | Gender Match |                                                                                            
  |----------|-------------|----------------|-------|--------------|                                                                                          
  | Spa / Wellness | Therapist | Room | ✅ | ✅ |                                                                                                               
  | Hair Salon | Stylist | Station | ✅ | optional |
  | Tattoo Studio | Artist | Station | ✅ | ❌ |                                                                                                                
  | Dental Clinic | Dentist | Treatment Room | ✅ | ❌ |                                                                                                        
  | Physiotherapy | Physiotherapist | Room | ✅ | optional |
  | Fitness / PT | Trainer | Studio | ✅ | optional |                                                                                                           
  | Cleaning Service | Crew Member | Job Site | ❌ | ❌ |                                                                                                       
  | Nail Studio | Nail Tech | Station | ✅ | ❌ |
                                                                                                                                                                
  ### How the Industry Config System Works                                                                                                                      
   
  Each industry record in the database controls:                                                                                                                
                                                                                                                                                              
  | Setting | What It Controls |
  |---------|-----------------|
  | `staff_label` | What "Therapist" is called (Dentist, Stylist, Trainer...) |                                                                                 
  | `location_label` | What "Room" is called (Station, Suite, Treatment Room...) |
  | `session_label` | What "Session" is called (Appointment, Visit, Booking...) |                                                                               
  | `enable_rooms` | Whether location assignment is required |                                                                                                
  | `enable_staff_gender` | Whether gender-preference matching applies |                                                                                        
  | `enable_specialties` | Whether staff specialties are shown |                                                                                              
  | `default_categories` | Default service categories for this vertical |                                                                                       
   
  ### What's Generic (80%+ of the codebase)                                                                                                                     
  - Database schema — org-scoped, multi-tenancy-first, no hardcoded vertical assumptions                                                                      
  - API service layer — all functions are business-agnostic                                                                                                     
  - Booking state machine — Pending → Confirmed → In-Progress → Completed                                                                                       
  - Financial engine — pricing, discounts, payment tracking, daily reconciliation
  - Role system — Staff / Manager / Admin works identically across all verticals                                                                                
  - Multi-tenancy — every org isolated via RLS with its own slug, timezone, currency                                                                          
                                                                                                                                                                
  ### What's Surface-Level Spa-Specific (cosmetic only)                                                                                                       
  - Staff table is named `therapists` (rename to `staff` = one migration)                                                                                       
  - Some default UI copy mentions "spa" (templated per org)                                                                                                     
  - Seed data uses massage services (swapped per tenant)                                                                                                        
                                                                                                                                                                
  ---                                                                                                                                                           
                                                                                                                                                              
  ## SOCIAL PROOF

  [MISSING — add manually]                                                                                                                                      
   
  *Suggested additions:*                                                                                                                                        
  - Live operating stats from Nuad Thai: # bookings processed, daily revenue closed, staff time saved                                                         
  - Testimonial from Nuad Thai Spa manager on replacing Excel                                                                                                   
  - Current live tenant details: **Nuad Thai Spa, Lazimpat, Kathmandu** — 39 therapists, 12 rooms, 194 services
  - Any other tenants live or in pipeline                                                                                                                       
                                                                                                                                                                
  ---                                                                                                                                                           
                                                                                                                                                                
  ## PRICING                                                                                                                                                  

  [MISSING — add manually]

  *Suggested tier structure:*
  | Tier | Includes | Price |
  |------|---------|-------|                                                                                                                                    
  | **Starter** | Online booking, staff dashboard, basic filters | $X/branch/month |
  | **Pro** | + Daily closing, analytics, discount approval workflow | $Y/branch/month |                                                                        
  | **Enterprise** | Multi-branch consolidation, custom integrations, dedicated support | Custom quote |                                                        
                                                                                                                                                                
  - Free trial: 14 days, full features                                                                                                                          
  - Pricing model decision needed: per-branch SaaS vs. per-booking fee vs. flat monthly                                                                       
                                                                                                                                                                
  ---                                                                                                                                                         
                                                                                                                                                                
  ## CALLS TO ACTION                                                                                                                                          

  **Primary CTA:** "Start Your Free Trial" or "Book a Demo" → contact/onboarding form                                                                           
   
  **Secondary CTAs:**                                                                                                                                           
  - "See It Live" → link to Nuad Thai booking flow as live demo                                                                                               
  - "Get Zenly for Your Business" → vertical-specific landing or contact form                                                                                   
                                                                                                                                                                
  ---                                                                                                                                                           
                                                                                                                                                                
  ## BRAND & TONE                                                                                                                                               
   
  **Tone of voice:**                                                                                                                                            
  Professional yet approachable. Clean and modern. Clear, jargon-free. Confident but not salesy. Warm but precise.                                            
                                                                                                                                                                
  *Examples from existing UI copy:*
  - "Nepal's premier spa booking platform"                                                                                                                      
  - "Easy booking in minutes"                                                                                                                                   
  - "Need Help? We're here for you."                                                                                                                            
                                                                                                                                                                
  **Existing taglines/copy:**                                                                                                                                   
  - Brand name: **Zenly**                                                                                                                                     
  - Subtitle seen in UI: "AI Booking Engine"                                                                                                                    
  - Footer: "Nepal's premier spa booking platform" *(update for generic positioning)*                                                                           
  - Help section: "Need Help?" with call/email/chat                                                                                                             
                                                                                                                                                                
  **Suggested generic headline directions:**                                                                                                                    
  - "One platform, any appointment business."                                                                                                                   
  - "Booking + operations + reconciliation — built to scale."                                                                                                   
  - "From Excel chaos to 30-second daily close."                                                                                                              
  - "Run your bookings. Run your business."                                                                                                                     
   
  **Three-part generic value prop:**                                                                                                                            
  1. **Online Booking** — Customers book in minutes; no phone calls, no double-bookings                                                                       
  2. **Operational Control** — Real-time schedules, staff dashboards, discount governance                                                                       
  3. **Financial Clarity** — Daily revenue close, payment tracking, full audit trail                                                                            
   
  **Brand colors:**                                                                                                                                             
  | Token | Hex | Usage |                                                                                                                                     
  |-------|-----|-------|                                                                                                                                       
  | Primary | `#2D5A27` | Deep forest green — brand primary |
  | Secondary | `#8B4513` | Warm earth brown |                                                                                                                  
  | Accent | `#DAA520` | Refined gold |                                                                                                                         
  | Background | `#FAFAF9` | Off-white page background |                                                                                                        
  | Surface | `#FFFFFF` | Cards / panels |                                                                                                                      
  | Success | `#10B981` | Emerald green |                                                                                                                     
  | Warning | `#D97706` | Amber |                                                                                                                               
  | Error | `#DC2626` | Red |                                                                                                                                   
   
  **Typography:**                                                                                                                                               
  | Family | Font | Usage |                                                                                                                                   
  |--------|------|-------|                                                                                                                                     
  | Headings | Inter | Section headings |
  | Body | Inter | Body copy |                                                                                                                                  
  | Accent | Playfair Display | Hero headline, premium feel |                                                                                                 
  | Data | JetBrains Mono | Pricing, numbers, times |                                                                                                           
                                                                                                                                                                
  **Design notes:**                                                                                                                                             
  - Rounded corners: 8px (`rounded-spa`), 12px for larger components                                                                                            
  - Shadows: resting → elevated → modal (layered depth system)                                                                                                  
  - Aesthetic: forest green + gold accent on clean white — luxury-meets-modern-SaaS                                                                             
                                                                                                                                                                
  ---                                                                                                                                                           
                                                                                                                                                                
  ## ADDITIONAL CONTEXT FOR COPYWRITING                                                                                                                         
   
  **Live example tenant:**                                                                                                                                      
  Nuad Thai Spa, Lazimpat, Kathmandu — 39 therapists, 12 rooms, 194 services:                                                                                 
  - Signature packages (Bangkok, Oxford, London, Hua Hin collections)                                                                                           
  - Body scrubs, aromatherapy, Himalayan salt treatments                                                                                                        
  - Premium facials (Casmara, anti-aging, acne)                                                                                                                 
  - Nail, wax, threading, hair services                                                                                                                         
  - Memberships, gift vouchers, packages                                                                                                                        
                                                                                                                                                              
  **Built by:** Zunkireelabs                                                                                                                                    
  **Live URLs:** `zenly.zunkireelabs.com` (production) / `dev-zenly.zunkireelabs.com` (staging)                                                                 
                                                                                                                                                                
  ---                                                                                                                                                           
                                                                                                                                                                
  ## OPEN DECISIONS (Resolve Before Writing Final Copy)                                                                                                         
                                                                                                                                                                
  [MISSING — add manually]                                                                                                                                    
                          
  - **Target verticals for launch** — Market to all verticals at once, or start with 2–3 anchor verticals?
  - **Pricing model** — Per-branch SaaS? Per-booking fee? Flat monthly?                                                                                         
  - **Onboarding story** — Self-serve signup or white-glove setup?     
  - **Brand name** — Is "Zenly" the product? Or "Zenly Booking" / "Zenly ERP"?                                                                                  
  - **Geographic focus** — Nepal-first, or positioning for international markets?                                                                             
  - **Social proof** — Nuad Thai as hero case study; any others live or in pipeline?                                                                            
  - **Primary CTA** — Free trial self-serve, or demo-request sales flow?
