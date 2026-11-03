# JanSahay 2.0 – Production Cloud Deployment Guide 🚀

This guide explains how to deploy the **JanSahay AI** full-stack platform using free-tier cloud hosting services:

| Layer | Service | Technology | Free Tier Specs |
|---|---|---|---|
| **Database** | **Aiven** | MySQL 8.0 Managed Cloud DB | Free tier (1 service, 5GB storage, SSL enabled) |
| **Backend** | **Render** | Docker Container (Java 17 + Spring Boot 3) | Free tier Web Service (512MB RAM, automatic HTTPS) |
| **Frontend** | **Vercel** | React 18 + Vite SPA | Free Hobby tier (Global Edge CDN, automatic HTTPS) |

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart LR
    A["Citizen Browser"] -->|HTTPS| B["Vercel (React Frontend)<br/>*.vercel.app"]
    B -->|API Calls /api/*| C["Render (Spring Boot Docker)<br/>*.onrender.com"]
    C -->|MySQL TLS Port 12xxx| D["Aiven MySQL Database<br/>*.aivencloud.com"]
```

---

## ⚠️ Important Deployment Order

Deploy the components strictly in this order:
1. **Step 1: Aiven MySQL Database** (Must be running first so the backend has a database to connect and seed on startup).
2. **Step 2: Render Spring Boot Backend** (Connects to Aiven, migrates schema, seeds data, exposes public API URL).
3. **Step 3: Vercel React Frontend** (Builds with `VITE_API_URL` pointing to the Render backend).
4. **Step 4: End-to-End Verification** (Verify authentication, scheme discovery, document checklists, and AI assistant).

---

## Step 1: Provision Free MySQL Database on Aiven

1. Go to [https://aiven.io](https://aiven.io) and create a free account or sign in.
2. In the Aiven Console, click **"Create service"**.
3. Select **MySQL** as the service type.
4. Select the **Free Tier** plan.
5. Choose a cloud provider and region closest to your users (e.g. `aws-ap-south-1` for Mumbai / India, or `aws-eu-west-1` / `aws-us-east-1`).
6. Give your service a name, e.g., `jansahay-mysql`.
7. Click **"Create service"**.
8. Wait 1–2 minutes until the service status turns **Running**.
9. In the service **Overview** tab, note the following connection parameters under **Connection information**:
   - **Host** (e.g. `mysql-3xxxx-yourteam.aivencloud.com`)
   - **Port** (e.g. `12345` or `3306`)
   - **User** (default: `avnadmin`)
   - **Password** (click the eye icon to copy the generated password)
   - **Database name** (default: `defaultdb`)
   - **SSL Mode**: Aiven requires SSL (`REQUIRED`).

> [!TIP]
> Aiven MySQL enforces TLS encryption. The backend is already configured with `useSSL=true` and `sslMode=REQUIRED` support.

---

## Step 2: Deploy Spring Boot Backend on Render (Docker)

Render builds and runs the container using the production-ready `server/Dockerfile`.

1. Go to [https://render.com](https://render.com) and sign in with your GitHub account.
2. Click **"New +"** and choose **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and connect your GitHub repository:
   `https://github.com/aryan-pawar2006/JanSahay`
4. Configure the Web Service settings:
   - **Name:** `jansahay-backend` (or any unique name)
   - **Region:** Choose the region closest to your Aiven database (e.g., `Singapore`, `Frankfurt`, or `Oregon`)
   - **Branch:** `main`
   - **Root Directory:** Leave blank (or enter `server`)
   - **Runtime:** **Docker**
   - **Dockerfile Path:** `./server/Dockerfile`
   - **Docker Build Context Directory:** `./server`
   - **Instance Type:** **Free** (0.5 CPU, 512 MB RAM)

5. Under **Health Check Path**, enter:
   ```
   /api/health
   ```

6. Click **"Advanced"** and add the following **Environment Variables**:

| Variable Name | Value | Description |
|---|---|---|
| `PORT` | `8080` | Internal port Spring Boot listens on |
| `DB_HOST` | `mysql-xxxx.aivencloud.com` | Your Aiven MySQL Host from Step 1 |
| `DB_PORT` | `12345` | Your Aiven MySQL Port from Step 1 |
| `DB_NAME` | `defaultdb` | Your Aiven Database Name |
| `DB_USERNAME` | `avnadmin` | Your Aiven Database Username |
| `DB_PASSWORD` | `your_aiven_password` | Your Aiven Database Password |
| `DB_SSL` | `true` | Enables SSL for Aiven cloud connection |
| `DB_SSL_MODE` | `REQUIRED` | Enforces TLS encryption for Aiven |
| `SQL_INIT_MODE` | `always` | Automatically executes `data.sql` to seed all 40+ schemes and demo accounts |
| `JWT_SECRET` | `JanSahayAI_Production_Key_MustBeAtLeast32Chars_2026!` | Secret key for signing citizen JWT tokens |
| `CORS_ALLOWED_ORIGINS` | `https://*.vercel.app` | Allows your Vercel frontend domain |
| `AI_PROVIDER` | `mock` | High-speed grounded rule assistant (no external API costs) |

> [!NOTE]  
> If you prefer entering Aiven's connection URI directly, you can set a single variable:  
> `SPRING_DATASOURCE_URL` = `jdbc:mysql://avnadmin:password@host:port/defaultdb?useSSL=true&sslMode=REQUIRED`

7. Click **"Create Web Service"**.
8. Render will build the Docker container and start your Spring Boot backend.
9. When deployment finishes, copy your Render public URL:
   `https://jansahay-backend.onrender.com`
10. Test your backend health endpoint in a browser:
    `https://jansahay-backend.onrender.com/api/health`
    It should return:
    ```json
    { "status": "UP", "service": "JanSahay Backend API", "version": "1.0.0" }
    ```

---

## Step 3: Deploy React Frontend on Vercel

The frontend is a React 18 + Vite application located in the `client/` directory.

### Method A: Connect Git Repository in Vercel Dashboard (Recommended)

1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import your GitHub repository: **`aryan-pawar2006/JanSahay`**.
4. In the Project Configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click "Edit" and select **`client`**.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Expand **Environment Variables** and add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://jansahay-backend.onrender.com/api` *(replace with your actual Render URL from Step 2)*
6. Click **"Deploy"**.
7. Vercel will install dependencies, build the production bundle, and deploy to a URL like:
   `https://jansahay.vercel.app`

### Method B: Deploy via Vercel CLI (Optional)

From your local machine:
```bash
npm install -g vercel
cd client
vercel --prod
```
When prompted for `VITE_API_URL`, provide: `https://your-backend.onrender.com/api`.

---

## Step 4: End-to-End Verification Checklist

Once both services are deployed, test the following key flows on your live Vercel URL:

| Test Case | How to Test | Expected Result |
|---|---|---|
| **Health Check** | Visit `https://your-backend.onrender.com/api/health` | Returns `{"status":"UP"}` |
| **Catalog Exploration** | Navigate to `/schemes` on Vercel | Displays 40+ unique central and state schemes |
| **Scheme Details** | Click **"Check Eligibility & Documents"** on any scheme | Loads without blank screen; shows Section A (in-hand) and Section B (missing) |
| **Official Redirection** | Click **"Apply Officially on Govt Portal"** | Opens official government portal in new tab |
| **Document Guides** | Click **"How to Generate Officially"** on any missing document | Displays point-wise steps, prerequisites, issuing authority, and fees |
| **Demo Citizen Login** | Log in with `student@jansahay.ai` / `Password@123` | Login succeeds; JWT token stored; redirects to citizen recommendations |
| **Admin Login** | Log in with `admin@jansahay.gov.in` / `Password@123` | Accesses `/admin` console with scheme and user management |
| **JanSahay AI Assistant** | Click **"💬 Ask AI About This Scheme"** on any scheme | Drawer opens with scheme context and answers immediately |

---

## 🛠️ Troubleshooting & Best Practices

### 1. Render Free Tier Cold Starts
- **Behavior:** On Render's free tier, the web service spins down after 15 minutes of inactivity. When the first citizen visits, the service wakes up, which takes 30–50 seconds.
- **Solution:** A health-check endpoint (`/api/health`) is provided. You can set up a free 5-minute ping using [UptimeRobot](https://uptimerobot.com) pointing to `https://your-backend.onrender.com/api/health` to keep the backend warm 24/7.

### 2. CORS Errors in Browser Console
- If you see `Access to XMLHttpRequest at '...' from origin 'https://your-app.vercel.app' has been blocked by CORS policy`:
  - Ensure `CORS_ALLOWED_ORIGINS` on Render contains your exact Vercel domain: `https://your-app.vercel.app`.
  - The backend dynamically allows all `https://*.vercel.app` domains by default.

### 3. Aiven MySQL Initial Seeding
- On first startup against an empty Aiven database, Hibernate creates all tables (`ddl-auto=update`), and Spring Boot executes `data.sql` because `SQL_INIT_MODE=always` and `defer-datasource-initialization=true`.
- All `INSERT` statements in `data.sql` use `ON DUPLICATE KEY UPDATE`, so restarting the server will never fail or duplicate data.
