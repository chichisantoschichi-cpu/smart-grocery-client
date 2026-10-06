function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-green-600">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-slate-600">
          The page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}

export default NotFoundPage;
