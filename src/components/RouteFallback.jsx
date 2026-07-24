import GlobalLoader from "./GlobalLoader";

export default function RouteFallback() {
  return <GlobalLoader overlay={false} />;
}
