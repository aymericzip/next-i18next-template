export const namespaces = ["common", "about"] as const;

export type Namespace = (typeof namespaces)[number];

