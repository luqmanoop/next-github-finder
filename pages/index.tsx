import type { NextPage } from "next";
import { SyntheticEvent, useRef, useState } from "react";

import User from "../components/User";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [username, setUsername] = useState("octocat");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ghUsername = inputRef.current?.value;
    if (!ghUsername?.trim()) return;
    setUsername(ghUsername);
    e.currentTarget.reset();
  };

  return (
    <div>
      <User username={username} />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="search"
          placeholder="enter github username e.g. octocat"
        />
      </form>
    </div>
  );
};

export default Home;
