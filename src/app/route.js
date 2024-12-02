// app/route.js

// Named exports for HTTP methods
export const GET = () => {
  return new Response(
    JSON.stringify({
      routes: {
        SIGN_IN: "/signin",
        MESSAGE_BOARD: "/message-board",
        HOME: "/home",
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const POST = () => {
  return new Response(JSON.stringify({ message: "POST request handled" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
