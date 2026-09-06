import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="paper-grain relative flex min-h-screen items-center justify-center px-4">
      <div aria-hidden className="paper-default-bg fixed inset-0 z-0" />
      <div className="relative z-10 text-center">
        <h1 className="font-script text-[4rem] leading-none text-ink">Ops</h1>
        <p className="mt-3 text-[15px] text-ink-soft">Esse endereço não existe por aqui.</p>
        <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-full bg-hot-deep px-6 text-[15px] font-semibold text-white shadow-hot">
          Voltar pra página
        </Link>
      </div>
    </main>
  );
}
