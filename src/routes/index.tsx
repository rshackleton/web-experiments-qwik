import { component$ } from '@builder.io/qwik';
import { Link, type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
      <section class="grid items-center justify-center h-full">
        <div class="max-w-xl text-center flex flex-col gap-4 items-center">
          <Link
            class="font-serif text-lg bg-stone-200 px-3 py-2 rounded-md"
            href={`/gallery`}
          >
            Gallery POC
          </Link>
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Gallery POC',
};
