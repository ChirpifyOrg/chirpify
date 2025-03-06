"use client";
import { ChatContainer } from "@/components/chat-container";
export default function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col w-full items-center justify-center">
        <div className="w-full max-w-3xl px-2">
          <h1 className="text-3xl md:text-5xl font-bold pb-2 text-center break-words">
            Chirpify, Learn English by{" "}
            <span style={{ color: "#0EF397" }}>Thinking</span>
          </h1>
          <h2
            className="font-medium text-xl md:text-2xl mb-4 pb-4 text-center break-words"
            style={{ color: "#7B7B7B" }}
          >
            A new way to learn through exploration and active engagement.
          </h2>

          <h2 className="font-medium text-xl md:text-2xl mb-4 text-center break-words">
            Try your first lesson for free!
          </h2>
        </div>
        <div>
          <ChatContainer persona="aru" mode="trial" />
        </div>
      </main>
    </>
  );
}
