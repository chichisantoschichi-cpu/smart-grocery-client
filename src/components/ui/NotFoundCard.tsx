import { Link } from "react-router";

interface NotFoundCardProps {
  title: string;
  message: string;
  backTo: string;
  backLabel: string;
}

export default function NotFoundCard({ title, message, backTo, backLabel }: NotFoundCardProps) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
      <p className="text-sm font-semibold text-rose-600">404</p>

      <h1 className="mt-1 text-2xl font-bold text-rose-900">{title}</h1>

      <p className="mt-2 text-sm leading-6 text-rose-700">{message}</p>

      <Link
        to={backTo}
        className="mt-6 inline-flex rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
      >
        {backLabel}
      </Link>
    </div>
  );
}
