import { component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, server$ } from "@builder.io/qwik-city";

import styles from "./index.css?inline";

const useDadJoke = routeLoader$(async () => {
  console.log("⚗️ getting a joke from 3rd party API");
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: "application/json",
    },
  });
  
  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});

export const useJokeVoteAction = routeAction$((props) => {
  console.log("🚀 vote", props);
});

const joke = component$(() => {
  useStylesScoped$(styles);
  
  const isFavoriteSignal = useSignal(false);
  const favoriteAction = useJokeVoteAction();
  const dadJokeSignal = useDadJoke();
  
  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);

    console.log("🌈 FAVORITE (isomorphic)", isFavoriteSignal.value);
    server$(() => {
      console.log("⚗️ FAVORITE (server)", isFavoriteSignal.value);
    })();
  });

  console.log("⚗️ rendering a joke");
  return (
    <section class="section bright">
      <p>{dadJokeSignal.value.joke}</p>
      <Form action={favoriteAction}>
        <input type="hidden" name="id" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">👍</button>
        <button name="vote" value="down">👎</button>
      </Form>
      <button onClick$={() => {
        isFavoriteSignal.value = !isFavoriteSignal.value;
      }}>
        {isFavoriteSignal.value ? '❤️' : '🤍'}
      </button>
    </section>
  );
});

export default joke;