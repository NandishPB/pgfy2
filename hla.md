### **System Architecture Diagram**
```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                             │
│  (React - SPA with responsive design for mobile & desktop)          │
└──────────┬────────────────────────────────────────────────┬─────────┘
           │                                                 │
           │ HTTP/HTTPS (REST API )                          │
           │                                                 │
┌──────────▼─────────────────────────────────────────────────▼─────┐
│                        MiddleWare                                │
│  - Authentication & Authorization                                |│                                 
│  - Request/Response Validation                                   │
│  - CORS Handling                                                 │
└──────────┬───────────────────────────────────────────────────────┘
           │        |                                        
┌──────────▼────────|───── ┐                    
│          Server          │                   
├───────────────────────────
│ 1. Auth Service          │                   
│    - Sign-up/Sign-in     │                   
│                          │                                        
│                          │               
│ 2. Hotel Service         │                    
│    - Search & Filter     │
│                          │
│ 3. Room Service          │
│    - Inventory Mgmt      │
│                          │
│ 4. Booking Service       │
│    - Booking CRUD        │
│    - Booking Status      │
│    - Availability Check  │
│                          │                       │
│ 6. Review Service        │
│    - Rating Calculation  │
│                          │
│                          │ 
└──────────┬───────────────┘
           │
┌──────────▼───────────────────────────────────────────────────────
│                            DataBase                              │
├──────────────────────────────────────────────────────────────────┤
│ Primary Database                                                 |
│ (PostgreSQL)                                                     |
│ - Users                                                          | 
│ - Hotels                                                         |
│ - Bookings                                                       |   
└──────────┬───────────────────────────────────────────────────────┘
  
---