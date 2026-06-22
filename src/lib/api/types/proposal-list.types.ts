/**
 * CRUD permission flags for a single Conga object, as returned by the
 * action-permissions API.
 *
 * API response shape:
 * { "Data": { "Proposal": { "CREATE": true, "UPDATE": true, "DELETE": true, "READ": true } } }
 */
export interface ObjectActionPermissions {
  CREATE?: boolean;
  UPDATE?: boolean;
  DELETE?: boolean;
  READ?: boolean;
  [key: string]: unknown;
}

/**
 * Full `Data` payload from the action-permissions endpoint.
 * Keys are object names (e.g. `"Proposal"`).
 */
export type ActionPermissionsData = Record<string, ObjectActionPermissions>;

/**
 * A single field column from the view grid configuration.
 * These are extracted from the `fields` array inside the grid component
 * within the parsed `Value` JSON of the page-configuration API response.
 */
export interface ViewColumnConfig {
  /** Field name — used as the key in the search API `Select` array. */
  name: string;
  /** Whether the column is shown. `false` means hidden; absent defaults to visible. */
  visible?: boolean;
  sortable?: boolean;
  width?: string;
  actionFunc?: string;
  [key: string]: unknown;
}

/**
 * Normalised representation of the list view configuration.
 * The service parses the raw stringified JSON from the `Value` field
 * and normalises the result to this shape.
 */
export interface ProposalListView {
  /** Visible field columns in display order (array order = sequence). */
  Fields: ViewColumnConfig[];
}


