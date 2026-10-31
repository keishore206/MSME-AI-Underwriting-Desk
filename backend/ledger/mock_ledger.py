"""
Mock Core-Banking Ledger using SQLite.
Simulates the pending sanction / approval workflow.
No autonomous disbursal — all entries require human approval.
"""
from __future__ import annotations
import sqlite3
import os
from datetime import datetime
from typing import Optional

DB_PATH = os.environ.get("LEDGER_DB_PATH") or (
    os.path.join("/tmp", "ledger.db") if os.path.isdir("/tmp") and os.access("/tmp", os.W_OK)
    else os.path.join(os.path.dirname(__file__), "ledger.db")
)


def init_ledger() -> None:
    """Create the ledger table if it doesn't exist."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sanctions (
                ledger_ref TEXT PRIMARY KEY,
                case_id TEXT NOT NULL,
                applicant_name TEXT NOT NULL,
                amount_lakhs REAL NOT NULL,
                rate_pct REAL NOT NULL,
                tenor_months INTEGER NOT NULL,
                emi_lakhs REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'PENDING_HUMAN_APPROVAL',
                officer_id TEXT,
                officer_name TEXT,
                officer_notes TEXT,
                created_at TEXT NOT NULL,
                actioned_at TEXT
            )
        """)
        conn.commit()


def post_pending_sanction(
    case_id: str,
    applicant_name: str,
    amount_lakhs: float,
    rate_pct: float,
    tenor_months: int,
    emi_lakhs: float,
) -> str:
    """Post a sanction entry with PENDING_HUMAN_APPROVAL status. Returns ledger_ref."""
    init_ledger()
    ledger_ref = f"LDG-{case_id.split('-', 1)[-1]}"
    now = datetime.utcnow().isoformat()
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            INSERT OR REPLACE INTO sanctions
            (ledger_ref, case_id, applicant_name, amount_lakhs, rate_pct,
             tenor_months, emi_lakhs, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING_HUMAN_APPROVAL', ?)
        """, (ledger_ref, case_id, applicant_name, amount_lakhs, rate_pct, tenor_months, emi_lakhs, now))
        conn.commit()
    return ledger_ref


def approve_sanction(ledger_ref: str, officer_id: str, officer_name: str, notes: Optional[str] = None) -> bool:
    """Approve a sanction entry. Returns True if successful."""
    init_ledger()
    now = datetime.utcnow().isoformat()
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("""
            UPDATE sanctions
            SET status='SANCTIONED', officer_id=?, officer_name=?, officer_notes=?, actioned_at=?
            WHERE ledger_ref=? AND status='PENDING_HUMAN_APPROVAL'
        """, (officer_id, officer_name, notes, now, ledger_ref))
        conn.commit()
        return cursor.rowcount > 0


def reject_sanction(ledger_ref: str, officer_id: str, officer_name: str, notes: Optional[str] = None) -> bool:
    """Reject a sanction entry. Returns True if successful."""
    init_ledger()
    now = datetime.utcnow().isoformat()
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("""
            UPDATE sanctions
            SET status='DECLINED', officer_id=?, officer_name=?, officer_notes=?, actioned_at=?
            WHERE ledger_ref=? AND status='PENDING_HUMAN_APPROVAL'
        """, (officer_id, officer_name, notes, now, ledger_ref))
        conn.commit()
        return cursor.rowcount > 0


def get_sanction(ledger_ref: str) -> Optional[dict]:
    """Retrieve a sanction entry by ledger reference."""
    init_ledger()
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.execute("SELECT * FROM sanctions WHERE ledger_ref=?", (ledger_ref,))
        row = cursor.fetchone()
        return dict(row) if row else None


def list_sanctions() -> list[dict]:
    """List all sanction entries."""
    init_ledger()
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM sanctions ORDER BY created_at DESC").fetchall()
        return [dict(r) for r in rows]

