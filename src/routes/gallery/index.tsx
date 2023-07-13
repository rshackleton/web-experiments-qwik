import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$, type DocumentHead } from '@builder.io/qwik-city';

export const useFirstGalleryItem = routeLoader$(() => {
  // todo: fetch first item data from supabase

  return {
    id: '1',
  };
});

export default component$(() => {
  const data = useFirstGalleryItem();

  return (
    <>
      <section class="grid items-center justify-center h-full">
        <div class="max-w-xl text-center flex flex-col gap-4 items-center">
          <h1 class="text-3xl font-serif">Welcome to the gallery.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex ullam
            amet, maxime sequi architecto necessitatibus id dolor optio vero
            aliquam reiciendis libero distinctio suscipit porro! Ab quidem
            obcaecati impedit repudiandae.
          </p>
          <Link
            class="font-serif text-lg bg-stone-200 px-3 py-2 rounded-md"
            href={`/gallery/${data.value.id}`}
          >
            Enter
          </Link>
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Gallery POC',
};
