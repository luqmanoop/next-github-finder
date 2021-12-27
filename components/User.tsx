import Image from "next/image";
import { useEffect } from "react";
import useSWR from "swr";
import styles from "./user.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const kFormatter = (value: number) => {
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
};

interface Prop {
  username: string;
}

interface Repository {
  name: string;
  url: string;
  stars: number;
}

interface UserResponse {
  user: {
    avatarUrl: string;
    id: string;
    name: string;
    username: string;
    bio: string;
    followers: { totalCount: number };
    following: { totalCount: number };
    repos?: {
      totalCount: number;
      nodes: [Repository];
    };
  };
}

export default function User({ username }: Prop) {
  const { data } = useSWR<UserResponse>(
    `/api/user?username=${username}`,
    fetcher
  );

  useEffect(() => {
    document.querySelectorAll(".animated").forEach((e) => {
      const element = e as HTMLDivElement;
      element.style.animation = "none";
      element.offsetHeight;
      element.style.animation = "";
    });
  }, [data]);

  const renderPopularRepo = (key: string, url: string, stars: number) => {
    return (
      <div key={key} className={styles.repo}>
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`${styles.repoInfo} animated`}
        >
          <span className={styles.starCount}>{kFormatter(stars || 0)}</span>
          <span className={styles.star}>⭐️</span>
        </a>
      </div>
    );
  };

  return (
    <div className={styles.profileContainer}>
      <div className={`${styles.ringContainer}`}>
        <div className={`${styles.ring} animated`}>
          {data?.user.repos
            ? data.user.repos.nodes.map(({ name, url, stars }) =>
                renderPopularRepo(name, url, stars)
              )
            : Array(4)
                .fill(null)
                .map((_, i) => renderPopularRepo(`key-${i}`, "", 0))}
        </div>

        <Image
          src={
            data?.user.avatarUrl ||
            "https://avatars.githubusercontent.com/u/583231?v=4"
          }
          layout="fill"
          alt={data?.user.username}
          className={styles.avatar}
        />

        <div className={styles.avatar} />
      </div>

      <h4 className={styles.username}>@{data?.user.username || "username"}</h4>
      <h3 className={styles.name}>{data?.user.name || "N/A"}</h3>
      <h5 className={styles.bio}>{data?.user.bio || "N/A"}</h5>

      <div className={styles.meta}>
        <div className={styles.content}>
          <h5>Repos</h5>
          <p>{kFormatter(data?.user.repos?.totalCount || 0)}</p>
        </div>

        <div className={styles.content}>
          <h5>followers</h5>
          <p>{kFormatter(data?.user.followers.totalCount || 0)}</p>
        </div>

        <div className={styles.content}>
          <h5>following</h5>
          <p>{kFormatter(data?.user.following.totalCount || 0)}</p>
        </div>
      </div>
    </div>
  );
}
