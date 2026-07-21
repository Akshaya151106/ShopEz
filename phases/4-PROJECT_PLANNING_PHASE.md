# Phase 4: Project Planning Phase

## Getting Real About The Work
Now we had to answer: "When are we building this, who's building it, and what does it cost?"

## The Schedule (And Whether We Actually Stuck To It)
Seven weeks. That's what we told stakeholders. Let's see:

**Week 1: Getting Your Ducks In A Row**
- Set up computers, Git repo, MongoDB connection
- Everyone should be able to git clone and npm install without 20 questions
- Create the basic folder structure
- Goal: working dev environment, not "I have Node installed somewhere"

**Weeks 2-3: Backend (The Boring But Critical Part)**
- User auth (signup, login, JWT tokens)
- Database schema (actually putting the ER model into Mongoose)
- API endpoints for products, cart, orders
- Goal: developers can call API endpoints and get actual data back

**Weeks 4-5: Frontend (Where People Actually See Stuff)**
- React components (auth, catalog, cart, checkout)
- Pages that actually work
- API integration
- Goal: can actually shop, even if it's basic

**Week 6: Making Sure It Doesn't Fall Apart**
- Frontend and backend yelling at each other properly
- Testing (unit tests, integration tests, user acceptance tests)
- Performance tuning
- Goal: not embarrassing

**Week 7: Going Live**
- Final setup on production servers
- Database migration
- Monitoring setup
- Goal: platform is live and people can actually use it

## The Team (And Their Jobs)
- **1 Project Manager** — herding cats, unblocking people
- **2 Backend Developers** — making API endpoints happen
- **2 Frontend Developers** — React components and pages
- **1 Database Admin** — MongoDB stuff
- **2 QA Testers** — finding all the things we broke

Could we have done it with fewer people? Maybe. Should we have? Probably not. Every role mattered.

## The Budget (The Part Finance Cares About)

**Infrastructure (per month):**
- MongoDB Atlas — $100 (cloud database)
- Hosting — $500 (where the app actually runs)
- Domain — $15 (shopez.com or whatever)
- CDN — $50 (fast image serving)
- **Monthly: $665** (not terrible)

**Development (one-time):**
- Team salaries for 7 weeks — $15,000 to $25,000
- Tools, licenses, software — $2,000
- Training if anyone needs it — $1,000
- **Total: $18,000 to $28,000**

## Risks (The Things That Kept Us Up At Night)

| What Could Go Wrong | Likely? | Bad If It Happens? | What We Did |
|---|---|---|---|
| Database gets slow | Maybe | Really bad | Load testing early, optimize queries |
| API and frontend aren't ready at same time | Not likely | Bad | Integration testing from day one |
| Security hole before launch | Unlikely | REALLY bad | Security audit, penetration testing |
| Feature creep (always "just one more thing") | Very likely | Medium | Strict requirement management, say no |
| Someone quits mid-project | Unlikely | Bad | Cross-training, good documentation |

## Making Sure Quality Doesn't Suck
- Unit tests (test individual functions)
- Integration tests (test modules talking to each other)
- Full end-to-end tests (actually buy something as a user)
- User acceptance testing (real people try it)
- Performance tests (make sure it's not slow)
- Security tests (find holes before bad people do)

Tools: Jest for unit tests, Postman for API testing, Selenium for UI testing.

## Keeping Everyone Informed
- Weekly team standup (15 minutes, every Monday)
- Stakeholder updates (every two weeks, the slightly boring version)
- Daily standups (everyone knows who's blocked)
- Progress reports (numbers and status)

## What Success Actually Looks Like
✓ Every feature works as expected  
✓ 95% of code covered by tests  
✓ Zero critical bugs at launch  
✓ Pages load under 2 seconds  
✓ System doesn't go down (99.5% uptime)  
✓ Users like it (4.5+ stars)  

## Deliverables
- Project timeline
- Who does what (resource plan)
- Budget breakdown
- Risk management plan
- QA strategy
- Communication plan

---
**Status:** ✅ Completed  
**Date:** February 13, 2026  
**Real talk**: Scope creep was the biggest pressure. Every stakeholder had a "quick" feature. We held the line.