# Phase 3: Project Design Phase

## The Architecture Decision That Mattered
This is where we decided what tech to build with. There was actual debate:
- One dev wanted PostgreSQL ("it's more structured, you know?")
- Another pushed for Firebase ("managed is better")
- Another said Mongoose was overkill

We went with Node + Express + MongoDB. Why? Because the team knew it, it's fast to build with, and it plays nicely together. MongoDB specifically because we wanted flexibility in the data model without over-engineering everything.

## The Database - Seven Collections That Connect
We're storing data as collections (MongoDB calls them that). Here's the actual structure:

### USER
Every person who signs up. Nothing fancy:
- userid, username, email (unique so no duplicates)
- password (hashed with bcrypt, obviously)
- usertype (regular or admin - keeps permissions simple)
- mobile, address (for shipping)

**Why this way?**: One person, many possible purchases. Each user can have multiple carts and orders.

### ADMIN
Settings and high-level configs:
- Banner images for the homepage
- Category management
- Platform-level configurations

**Real decision**: We could've made this super complex. We didn't. Keep it simple.

### CATEGORIES
How we organize products. Two fields:
- category_id
- category_name

One admin can manage many categories. Categories contain many products. Straightforward.

### PRODUCT
The stuff people buy:
- productid, title, description
- price and discount (tracked separately for flexible pricing)
- gender, sizes (as arrays - super flexible)
- Multiple images (carousel + main image)
- category reference

**Design choice we debated**: Should we store price separately from discount, or calculate discount dynamically? We stored both separately because if someone's browsing their cart and a product price drops 10 seconds after they added it, their total shouldn't mysteriously change. That got ugly fast if we didn't store original prices.

### CART
What's in someone's cart right now:
- userid, productid, quantity, size
- price, discount (copied from product at time of addition)

**Why duplicate the price?**: If a product drops 50% off tomorrow, their cart still shows what they saw when they added it. No surprises at checkout.

### ORDER
The permanent record of what people actually bought:
- userid, orderDate, deliveryDate
- paymentMethod, address, pincode
- quantity, size, price, discount
- title, description, mainimg (full product snapshot)

**Critical design decision**: We stored the entire product info in the order, not just a reference. Because what happens if we delete a product from the system six months later? We still need to know exactly what the customer ordered. This saves us SO many headaches.

### REVIEW
Customer feedback:
- review_id, productid, userid
- title, description, rating

Simple and effective. Nothing fancy needed.

## How Everything Talks To Each Other

### Frontend
- React (team knows it, solid ecosystem)
- Vite (WAY faster than Webpack - actually noticeable)
- Plain CSS (no need for styled-components or Tailwind here)
- Lucide React for icons (better than managing custom SVGs)

### Backend
- Node.js + Express (fast to develop, good performance)
- Mongoose (keeps MongoDB queries sane)
- CORS (lets frontend talk to backend securely)
- Dotenv (environment variables so we don't hardcode secrets)

### Database
- MongoDB Atlas in the cloud (no server maintenance, automatic backups)
- SQLite3 locally for testing (when devs need to test without cloud)

## The API
We kept it simple and RESTful. No GraphQL, no fancy stuff:
- User endpoints: register, login, profile
- Product endpoints: list, get details, admin can add/edit/delete
- Cart endpoints: add, update, remove
- Order endpoints: create, list, track

Nothing we'd regret, nothing overly complex.

## Security (The Non-Negotiable Part)
- Passwords hashed with bcrypt (industry standard)
- JWT tokens for authentication (stateless, scales well)
- CORS properly configured (only our frontend can call our API)
- Environment variables for secrets (never ever hardcode API keys)
- SSL/TLS for everything over the network

**One thing we didn't implement yet**: Rate limiting. We'll add it if needed, but we kept it simple at launch.

## Future-Proofing
- MongoDB scales horizontally (add more servers, not bigger servers)
- Stateless backend (can run multiple instances behind a load balancer)
- Product catalog can be cached (super fast reads after first load)
- CDN ready for images (when we actually scale up)

## What We Actually Delivered
- ER diagram showing all entities and relationships
- Architecture diagram (frontend → backend → database)
- API specifications
- Tech stack decision document (for when people ask "why not X?")
- Security checklist

---
**Status:** ✅ Completed  
**Date:** February 13, 2026  
**Big Lesson**: Good database design saves SO much development time. We didn't have to refactor the schema once.

