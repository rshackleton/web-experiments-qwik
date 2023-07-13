import type { Signal } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import { useReactions } from '~/hooks/useReactions';

export type ReactionsProps = {
  consent: Signal<boolean>;
};

export const Reactions = component$<ReactionsProps>(({ consent }) => {
  const store = useReactions(consent);

  return (
    <div class="flex flex-col gap-4">
      <p class="text-xl" aria-live="polite">
        Number of active users:{' '}
        <span class="text-purple-700 font-medium tabular-nums">
          {store.count}
        </span>
      </p>

      <div class="flex gap-4">
        <p class="font-medium">Click to react:</p>
        <ul class="flex gap-4">
          <li>
            <button
              type="button"
              onClick$={() => {
                store.sendReaction({ name: 'heart' });
              }}
              preventdefault:click
            >
              ❤️
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick$={() => {
                store.sendReaction({ name: '+1' });
              }}
              preventdefault:click
            >
              👍
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick$={() => {
                store.sendReaction({ name: '-1' });
              }}
              preventdefault:click
            >
              👎
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick$={() => {
                store.sendReaction({ name: 'wow' });
              }}
              preventdefault:click
            >
              😮
            </button>
          </li>
        </ul>
      </div>

      <div>
        <p class="font-medium">Reactions:</p>
        <ul aria-atomic="true" aria-live="polite">
          {store.reactions.map((reaction, index) => (
            <li
              key={`${reaction}-${index}`}
              aria-label={`Someone reacted with ${reaction}`}
            >
              {reaction.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick$={() => {
            consent.value = false;
          }}
        >
          Revoke Consent
        </button>
      </div>
    </div>
  );
});
