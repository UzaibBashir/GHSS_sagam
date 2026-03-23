import LoadingSpinner from "./components/common/LoadingSpinner";

export default function AppLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--page-bg)">
      <LoadingSpinner label="Loading page" size="lg" />
    </main>
  );
}
