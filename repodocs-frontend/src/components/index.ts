// Export all component categories
export * from "./atoms";
export * from "./molecules";
export * from "./organisms";
export * from "./templates";
export * from "./ui";
export * from "./auth";

// Re-export commonly used components
export { default as Layout } from "./templates/Layout";
export { default as Header } from "./organisms/Header";
export { ProtectedRoute } from "./auth/ProtectedRoute";
