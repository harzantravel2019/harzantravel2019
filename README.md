# HARZAN TRAVEL Accounting System

A lightweight travel-agency accounting system built for **HARZAN TRAVEL**.

## Included Pages

- `Dashboard` for totals, recent activity, and balance overview
- `Clients` for adding, editing, and deleting client records
- `Debts & Payments` for posting ledger entries
- `Statements` for generating a print-ready statement view and saving it as PDF

## Run Locally

1. Open a terminal in `D:\AI`
2. Run `npm start`
3. Open `http://localhost:4173`

## Notes

- Data is stored in browser `localStorage`
- Statements are exported through the browser print dialog using **Save as PDF**
- Deleting a client also deletes that client's ledger records
