# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Game Deal Tracker** MVP that aggregates gaming deals from multiple platforms (Steam, Epic Games, Xbox Game Pass, Ubisoft). The system consists of three services:

1. **game-deal-tracker** (Python) - Web crawlers that scrape deal data
2. **game-deal-api-service** (Node.js/Express) - REST API serving deal data
3. **game-deal-frontend** (Next.js/React) - User-facing web application

All three services share a single PostgreSQL database (`game_deals_db`).

## Architecture

### Data Flow
1. Python crawlers scrape platforms → Insert/update deals in PostgreSQL via SQLAlchemy
2. Node.js API reads from PostgreSQL via Sequelize → Serves JSON to frontend
3. Next.js frontend fetches from API → Displays categorized deals

### Database Schema
- **deals** table (shared by all services): Core deal information
- Platform-specific metadata tables with 1:1 relationships:
  - `epic_metadata` (deal_id FK)
  - `xbox_metadata` (deal_id FK)
  - `steam_metadata` (deal_id FK, includes review data)
  - `ubisoft_metadata` (deal_id FK)

The Python ORM (SQLAlchemy) defines the schema in `game-deal-tracker/db/models.py`. The Node.js service uses Sequelize models that mirror this schema but do NOT create/alter tables (it only reads).

### Deal Types
- **"Free"** - Epic Games giveaways, Ubisoft freebies
- **"Sale"** - Steam discounted games
- **"GamePass"** - Xbox Game Pass subscription games

## Common Commands

### Python Crawler Service (game-deal-tracker)
```bash
# Setup
cd game-deal-tracker
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirement.txt

# Run all crawlers (initializes DB and runs on schedule)
python main.py

# Run individual crawler for testing
python crawlers/steam_crawler.py
python crawlers/epic_crawler.py

# Reset database (WARNING: deletes all data)
python reset_db.py
```

**Database URL**: `postgresql://admin:@localhost:5432/game_deals_db` (defined in `config/database.py`)

### Node.js API Service (game-deal-api-service)
```bash
# Setup
cd game-deal-api-service
npm install

# Start API server (port 4000)
npm start
```

**Environment**: Uses `.env` for database credentials. Port defaults to 4000.

### Next.js Frontend (game-deal-frontend)
```bash
# Setup
cd game-deal-frontend
npm install

# Development server (port 3000)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

**API Endpoint**: Configured in `lib/api.ts` to call `http://localhost:4000/deals`

## Key Implementation Details

### Adding a New Platform Crawler

When adding crawlers for new platforms (e.g., GOG, PlayStation):

1. **Create metadata model** in `game-deal-tracker/db/models.py`:
   ```python
   class NewPlatformMetadata(Base):
       __tablename__ = "newplatform_metadata"
       deal_id = Column(Integer, ForeignKey('deals.id'), primary_key=True)
       # platform-specific fields
       deal = relationship("Deal", back_populates="newplatform_meta")
   ```
   Add relationship to `Deal` model: `newplatform_meta = relationship(...)`

2. **Create crawler** in `game-deal-tracker/crawlers/newplatform_crawler.py`:
   - Implement `crawl_newplatform()` function
   - Return structured data with `deal_data` and `meta_data` dicts
   - Use `upsert_deal()` from `db.crud` with context manager pattern

3. **Register in scheduler** (`game-deal-tracker/main.py`):
   - Import new crawler function
   - Add to `run_all_crawlers()`

4. **Create Sequelize model** in `game-deal-api-service/models/NewPlatformMetadata.js`:
   - Mirror Python metadata table structure
   - Use `tableName` and `timestamps: false`
   - Define association in `models/index.js`

5. **Update API route** in `game-deal-api-service/routes/deals.js`:
   - Add to `include` array for eager loading

### Database Context Management

The Python crawler service uses a context manager pattern for database sessions:

```python
from config.database import get_db_context

with get_db_context() as db:
    result = upsert_deal(db, deal_data, MetadataModel, metadata_data)
    # Session auto-commits on success, rolls back on exception
```

**Important**: Always use `get_db_context()` instead of manually managing sessions. The context manager handles commit/rollback automatically.

### Import Path Issues in Crawlers

Crawlers need to import from parent directories (`config`, `db`). Each crawler file includes this at the top:

```python
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
```

This allows `from config.database import ...` to work when running crawlers directly.

### API Query Parameters

The `/deals` endpoint supports filtering:
- `?type=free|sale|sub` - Filter by deal type (case-insensitive)
- `?platform=Steam` - Filter by platform (case-insensitive partial match)
- `?search=game` - Search in title (case-insensitive partial match)
- `?page=1&limit=20` - Pagination

**Important**: Invalid `type` values return empty results (not an error). This prevents exposing all deals when malformed requests occur.

### Frontend Type Definitions

Deal types are defined in `game-deal-frontend/lib/api.ts`. When adding new metadata fields, update both:
1. TypeScript `Deal` interface
2. Sequelize model associations in API service

## Project-Specific Patterns

### Crawler Data Structure
All crawlers must return data in this format:
```python
{
    "deal_data": {  # Goes to deals table
        "platform": str,
        "title": str,
        "url": str,  # Must be unique
        "regular_price": float,
        "sale_price": float,
        "discount_rate": int,
        "deal_type": "Free|Sale|GamePass",
        "image_url": str,
        "is_active": bool,
        "end_date": datetime or None
    },
    "meta_data": {  # Platform-specific metadata
        # Custom fields per platform
    }
}
```

### Upsert Logic
The `upsert_deal()` function (in `db/crud.py`) uses a two-phase lookup:
1. First checks custom `unique_filters` (e.g., title matching for Xbox)
2. Falls back to URL matching to prevent duplicates
3. Updates existing deals or creates new ones with metadata

### Crawler Error Handling
Crawlers should:
- Print progress messages with emojis (🚂, ✅, ❌)
- Return counts of created/updated deals
- Handle API rate limiting gracefully (add delays with `time.sleep()`)
- Catch parsing errors per-item, not globally (continue on failures)

### Next.js App Router Structure
The frontend uses Next.js 16 App Router:
- `app/page.tsx` - Homepage with horizontal scrolling sections
- `app/deals/[type]/page.tsx` - Category-specific full lists
- `components/` - Reusable card components
- Client-side data fetching with React hooks

## Notes

- The database must be running PostgreSQL on `localhost:5432` with database `game_deals_db`
- Python service uses SQLAlchemy models to **create/modify** schema
- Node.js service uses Sequelize models to **read only** (never sync with `force` or `alter`)
- All services must be running concurrently for full functionality
- CORS is enabled in the API service for frontend access
