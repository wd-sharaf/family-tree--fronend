// =====================================================
// Family Tree App — Core TypeScript Types
// =====================================================

// ---------- Enums / Union types ----------

export type Gender = "male" | "female" | "other" | "unknown";

export type RelationshipType =
  | "parent"
  | "child"
  | "spouse"
  | "sibling";

export type UserRole = "viewer" | "admin";

// ---------- Core domain entities (mirror PostgreSQL tables) ----------

/**
 * A single person node in the family tree.
 * Maps to the `persons` table in PostgreSQL.
 */
export interface Person {
  id: string; // UUID (matches PostgreSQL uuid PK)
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string | null; // ISO 8601 date string
  deathDate: string | null; // ISO 8601 date string, null if alive
  birthPlace: string | null;
  bio: string | null;
  photoUrl: string | null; // Presigned S3 URL (short-lived, generated on fetch)
  photoKey: string | null; // Permanent S3 object key (stored in DB)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  createdBy: string; // User ID (FK)
}

/**
 * Represents an edge/relationship between two persons.
 * Maps to the `relationships` table, which PostgreSQL will
 * query recursively (e.g. WITH RECURSIVE) to build tree structures.
 */
export interface Relationship {
  id: string; // UUID
  personId: string; // FK -> Person.id
  relatedPersonId: string; // FK -> Person.id
  type: RelationshipType;
  createdAt: string;
}

/**
 * Authenticated user account (JWT subject).
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

// ---------- Tree visualization types (react-d3-tree shape) ----------

/**
 * The recursive node shape expected by react-d3-tree.
 * Built client-side (or server-side via recursive SQL) from
 * flat Person[] + Relationship[] data.
 */
export interface FamilyTreeNode {
  name: string; // Display name (firstName + lastName)
  attributes?: {
    personId: string;
    birthYear?: string;
    deathYear?: string;
    gender: Gender;
    photoUrl?: string | null;
  };
  children?: FamilyTreeNode[];
}

// ---------- API request/response DTOs ----------

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate?: string | null;
  deathDate?: string | null;
  birthPlace?: string | null;
  bio?: string | null;
  photoKey?: string | null;
}

export type UpdatePersonRequest = Partial<CreatePersonRequest>;

export interface CreateRelationshipRequest {
  personId: string;
  relatedPersonId: string;
  type: RelationshipType;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  accessToken: string; // JWT
  tokenType: "bearer";
  expiresIn: number; // seconds
  user: User;
}

/** Presigned URL response for uploading a photo to S3. */
export interface PresignedUploadResponse {
  uploadUrl: string; // PUT target
  photoKey: string; // Key to store on the Person record afterward
  expiresIn: number;
}

/** Generic paginated API list response. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Standard API error shape returned by FastAPI/Express backend. */
export interface ApiError {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}