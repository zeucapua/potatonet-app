import { eq } from "drizzle-orm";
import { db as database } from "./server/db";
import * as schema from "./server/db/schema";
import type { NodeSavedSession, NodeSavedSessionStore, NodeSavedState, NodeSavedStateStore } from "@atproto/oauth-client-node";

// can be implemented with your preferred DB and ORM
// both stores are the same, only different is 'state' and 'session'

export class AuthStateStore implements NodeSavedStateStore {
  constructor(private db: typeof database) {}

  async get(key: string): Promise<NodeSavedState | undefined> {
    const result = await this.db.query.AuthState.findFirst({
      where: eq(schema.AuthState.key, key)
    });

    if (!result) return;

    return result.state as NodeSavedState;
  }

  async set(key: string, val: NodeSavedState) {
    await this.db.insert(schema.AuthState)
      .values({ key, state: val })
      .onConflictDoUpdate({
        target: schema.AuthState.key,
        set: { state: val }
      });
  }

  async del(key: string) {
    await this.db.delete(schema.AuthState)
      .where(eq(schema.AuthState.key, key));
  }
}

export class AuthSessionStore implements NodeSavedSessionStore {
  constructor(private db: typeof database) {}

  async get(key: string): Promise<NodeSavedSession | undefined> {
    const result = await this.db.query.AuthSession.findFirst({
      where: eq(schema.AuthSession.key, key)
    });

    if (!result) return;
    return result.session as NodeSavedSession;
  }

  async set(key: string, val: NodeSavedSession) {
    await this.db.insert(schema.AuthSession)
      .values({ key, session: val })
      .onConflictDoUpdate({
        target: schema.AuthSession.key,
        set: { session: val }
      });
  }

  async del(key: string) {
    await this.db.delete(schema.AuthSession)
      .where(eq(schema.AuthSession.key, key));
  }
}

