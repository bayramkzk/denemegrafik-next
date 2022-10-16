export const Routes = Object.freeze({
  home: "/",
  database: "/admin/database",
  login: "/auth/login",
  register: "/auth/register",

  loginApi: "/api/auth/login",
  registerApi: "/api/auth/register",
});

type RouteKey = keyof typeof Routes;
const ProtectedRouteKeys: readonly RouteKey[] = Object.freeze(["home"]);

export const ProtectedRoutes = Object.freeze(
  Object.fromEntries(ProtectedRouteKeys.map((key) => [key, Routes[key]]))
);

export const UnprotectedRoutes = Object.freeze(
  Object.fromEntries(
    Object.keys(Routes)
      .map((key) => key as RouteKey)
      .filter((key) => !ProtectedRouteKeys.includes(key))
      .map((key) => [key, Routes[key]])
  )
);
