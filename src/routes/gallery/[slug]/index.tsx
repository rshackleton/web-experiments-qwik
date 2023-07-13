import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';

export const useGalleryItem = routeLoader$((requestEvent) => {
  const { slug } = requestEvent.params;

  // todo: fetch item data from supabase

  return {
    id: slug,
  };
});

export default component$(() => {
  const data = useGalleryItem();

  return (
    <>
      <div>
        <p>{data.value.id}</p>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Gallery POC',
};
