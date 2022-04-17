import Link from "@docusaurus/Link";
import React from "react";

export default function HomepageFeatures(): JSX.Element {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link to="/docs/1st-clean-code">
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Let's study with me
        </div>
      </Link>
    </section>
  );
}
