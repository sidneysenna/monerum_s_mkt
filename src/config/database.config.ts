export const databaseConfig = {
  schema: "sindicatos_br",
  forbiddenSchema: "public",
  existingLeadsTable: "sindicatos_br.sindicatos",
  existingLeadsTablePolicy: "read-only",
} as const;
