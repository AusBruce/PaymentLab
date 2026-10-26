# PaymentLab

React + TypeScript browser application backed by an ASP.NET Core (.NET 8) Web API, with a thread-safe in-memory account service and xUnit tests. Data is lost when the application restarts. This is a local learning/demo API; it has no authentication or persistence. All accounts share one implicit currency; amounts use C# decimal.

## Run the app

Requirements: .NET 8 SDK and Node.js 22.11+ (or Node.js 20.19+).

The frontend is a standalone TypeScript module in [`frontend/`](frontend/README.md). The API runs independently.

Start the API from the solution directory:

```sh
dotnet restore
dotnet run --project src/PaymentLab.Api
```

In another terminal, start the frontend:

```sh
npm ci --prefix frontend
npm run dev --prefix frontend
```

Open **http://localhost:5173**. Vite proxies account and transfer requests to the API at **http://localhost:5080**. Port 5080 serves API endpoints only.

For a production frontend build:

```sh
npm run build --prefix frontend
npm run preview --prefix frontend
```

Open **http://localhost:4173** to preview the build with the API running. Build output lives in `frontend/dist/`, independently of the API project. See the [frontend README](frontend/README.md) for module structure, API proxy configuration, and deployment instructions.

## Frontend workspace

The responsive dashboard uses a yellow and charcoal banking theme and includes Overview, Accounts, and Transactions views. The “Banking for” selector scopes account balances, account lists, transfer sources, activity, and exports to the selected demo owner. Owner names are grouped ignoring case and surrounding whitespace; use the same name for multiple accounts belonging to one owner. Creating an account selects its owner. Transfer recipients can belong to any owner. These profiles are frontend filters, not authentication or API access control. Create accounts from the account dialog, search by owner or ID, and choose the arrow beside an account to use it as a transfer source. Transfers show available funds and require a review before confirmation.

Transactions can be filtered by account and exported as CSV. Activity and transfer volume cover only the current page session because the API does not expose transaction history. All amounts use the API's shared demo currency, displayed as units. API connection failures are shown with a refresh action for retrying.

## Checks

```sh
npm run typecheck --prefix frontend
npm run build --prefix frontend
dotnet build
dotnet test
```

## Endpoints

- `POST /accounts`: create an account with `{ "ownerName": "Alice", "initialBalance": 100 }` (201).
- `GET /accounts`: list accounts.
- `GET /accounts/{id}`: retrieve an account (404 if missing).
- `POST /transfers`: transfer using `{ "fromAccountId": "<source-id>", "toAccountId": "<destination-id>", "amount": 25 }`. Returns a transaction with its ID and UTC timestamp.

Create two accounts, then use their returned IDs in the transfer request. For example:

```sh
curl -X POST http://localhost:5080/accounts -H 'Content-Type: application/json' -d '{"ownerName":"Alice","initialBalance":100}'
curl -X POST http://localhost:5080/accounts -H 'Content-Type: application/json' -d '{"ownerName":"Bob","initialBalance":0}'
```

Transfers validate positive amounts, distinct accounts, account existence, available funds, and destination overflow. Invalid input returns 400, missing accounts 404, and insufficient funds 409. A single lock protects balance updates and transaction recording so failed transfers leave both accounts unchanged.

## Validation in the creation environment

Restore succeeded using the local NuGet cache (`dotnet restore --source /Users/yuhengwang/.nuget/packages -p:NuGetAudit=false -m:1`). Build succeeded with zero warnings and errors. The managed sandbox blocked the local socket required by VSTest, so `dotnet test` aborted before executing tests. Run the standard test command above outside that sandbox.

The React frontend also passed `npm ci` from the local package cache and `npm run build` (including strict TypeScript checking). Its production files are generated in `frontend/dist/`. The API no longer serves frontend files; any older generated `wwwroot` files are unused. Browser/server smoke testing could not be completed in the restricted creation environment.
