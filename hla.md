### **System Architecture Diagram**
```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                             │
│  (React/Vue.js - SPA with responsive design for mobile & desktop)   │
└──────────┬────────────────────────────────────────────────┬─────────┘
           │                                                 │
           │ HTTP/HTTPS (REST API )                          │
           │                                                 │
┌──────────▼─────────────────────────────────────────────────▼────────┐
│                        API Gateway Layer                            │
│  - Authentication & Authorization                                  │                                 
│  - Request/Response Validation                                     │
│  - CORS Handling                                                   │
└──────────┬────────────────────────────────────────────────┬─────────┘
           │                                                 │
┌──────────▼──────────────┐                    
│   Microservices Layer   │                   
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
│                          │ │
└──────────┬───────────────┘
           │
┌──────────▼────────────────────────────────────────────────────────┐
│                      Data Layer                                    │
├─────────────────────────────────────────────────────────────────────┤
│ Primary Database            
│ (PostgreSQL)           
│ - Users                 
│ - Hotels                
│ - Bookings                                                          
└──────────┬────────────────────────────────────────────────────────┘
  
---