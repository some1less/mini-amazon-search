## Mini Amazon Search

### Architecture decision

Before starting work on the project, it was important to identify a technology stack in order to get a complete picture of the available technologies being used in the project.

- **Frontend**: React (TypeScript)
- **Backend**: .NET (C#)
- **Database**: Supabase Postgres
- **Deployment**: Vercel (for frontend), Azure (for backend)

**Tradeoffs**: The most important decision was to separate the project into two main parts – frontend and backend. This allows us to scale and optimize the project independently for different deployment environments.
Since React and .NET are familiar topics for me, I decided to pick them for this project in order to quickly deliver a reliable and scalable application.

