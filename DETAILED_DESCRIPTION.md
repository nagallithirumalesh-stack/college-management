# Smart Digital Campus - Technical Specification v2.0 (Architect Reviewed)

## 1. System Overview & Core Philosophy
The **Smart Digital Campus** is a **Modular Monolith** designed for high extensibility. The core system provides the "operating system" (Auth, DB, Event Bus, UI Shell), while all business value (Attendance, Library, Gamification) is delivered via **Addons**.

**Core Principle**: *The Core should not know about specific Addons. Addons should communicate via Events and Slots.*

## 2. Missing Critical Architecture Components

To be "Production-Ready" and truly extensible, the following subsystems are required:

### 2.1 Event Bus (Backend Communication)
Addons must not import each other's code directly. They rely on an Event Bus.
-   **Mechanism**: Node.js `EventEmitter` (local) or Redis (scaled).
-   **Pattern**: Fire-and-Forget for side effects.

**Example**:
-   `Attendance` module fires `attendance.marked`.
-   `Gamification` module listens to `attendance.marked` to award XP.
-   `Notification` module listens to `attendance.marked` to send push notification.

### 2.2 Frontend "Slot" System (UI Injection)
Addons need to inject UI elements into the Core without changing Core code.
-   **Usage**: "Add a 'View Graphic' button to the Student Profile page."
-   **Implementation**: A global `SlotRegistry` provider.

### 2.3 Life-Cycle Management
Modules implement a standard interface for safe startup/shutdown.
-   `init(context)`: Register routes, listeners.
-   `enable()` / `disable()`: Runtime toggling.

---

## 3. Detailed Architecture Specifications

### 3.1 Backend Module Interface
Every module must export a definition object.

```javascript
// server/src/modules/gamification/index.js
module.exports = {
  id: "gamification",
  version: "1.0.0",
  dependencies: ["auth", "attendance"], // System checks these exist
  
  onInit: async ({ events, db, logger }) => {
    // 1. Register Models
    db.registerModel("Achievement", require("./models/Achievement"));

    // 2. Listen to Events
    events.on("attendance.marked", async (payload) => {
      await require("./services/xpService").awardXP(payload.userId);
    });

    // 3. Return Routes
    return require("./routes");
  }
};
```

### 3.2 Frontend Slot System
**Core Component (`<Slot name="student-profile-actions" context={student} />`)**:
Renders all components registered to this name.

**Addon Registration (`client/src/modules/gamification/index.js`):**
```javascript
import { registerComponent } from "@/core/plugins";

registerComponent("student-profile-actions", ({ context }) => {
  return <button>View XP for {context.name}</button>;
});

registerComponent("nav-sidebar", {
  label: "Leaderboard",
  icon: "Trophy",
  path: "/gamification"
});
```

### 3.3 Database Strategy (Namespace Isolation)
To prevent table collision:
-   Core tables: `users`, `settings`
-   Addon tables: `[addon_name]_[table_name]`
    -   Example: `gamification_badges`, `library_books`

---

## 4. Proposed Folder Structure

```text
/server
  /src
    /core           # The "Kernel"
      /bus.js       # Event Emitter
      /db.js        # Sequelize Instance
      /loader.js    # Addon Discoverer
    /modules        # Business Features
      /attendance
      /auth
      /gamification
        manifest.json
        index.js
        /models
        /services

/client
  /src
    /core           # Shell, Layouts, SlotRegistry
    /modules        # Business Features
      /gamification
        index.js    # Registers routes & slots
        /components
        /pages
```

## 5. API Response Envelope (Standardized)
All addons **MUST** return:
```json
{
  "status": "success", // or "error"
  "code": 200,
  "data": { ... },     // The payload
  "error": null,       // Debug info (dev only)
  "meta": {            // Versioning, pagination
    "page": 1,
    "total": 50
  }
}
```

## 6. Security (Addon Isolation)
-   **Scope**: Addons cannot access `process.env` directly. Configuration is passed via `init(config)`.
-   **Routes**: All addon routes are automatically prefixed `/api/v1/modules/[addon-id]/`.
