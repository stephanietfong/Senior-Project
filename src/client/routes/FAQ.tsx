type FAQ = {
  q: string;
  a: string;
};

const FAQS: FAQ[] = [
  {
    q: "How are events recommended to me?",
    a: "We recommend events based on your selected interests, location, and events you’ve interacted with (Going/Maybe/Details). You can update your interests anytime.",
  },
  {
    q: "What is the difference between “Going” and “Maybe”?",
    a: "“Going” means you plan to attend. “Maybe” saves the event so you remember it, but doesn’t fully commit you.",
  },
  {
    q: "Can I change my RSVP later?",
    a: "Yes. You can switch between Going/Maybe, or remove it entirely from the event’s Details page.",
  },
  {
    q: "How do I find events near a specific place (not my current location)?",
    a: "Use the search screen to enter a location (like “Downtown Gainesville”) and we’ll show results around that area.",
  },
  {
    q: "Why do I see events that are already full?",
    a: "Some hosts cap attendance. If an event fills up, it can still appear in search, but the Details page will show that it’s full.",
  },
  {
    q: "Can I hide certain types of events?",
    a: "Yes. You can remove interests or use filters (like “21+” or “Sports”) so you see fewer of those.",
  },
  {
    q: "Do I need an account to browse events?",
    a: "You can browse without an account, but you’ll need to sign in to save events, RSVP, or create events.",
  },
  {
    q: "Can I report an event or host?",
    a: "Yes. On the Details page you can report events for spam, scams, wrong info, or unsafe content.",
  },
  {
    q: "What info do hosts see when I RSVP?",
    a: "Typically just your display name and your RSVP status (Going/Maybe). We don’t share your private contact info by default.",
  },
  {
    q: "How do notifications work?",
    a: "If enabled, we’ll notify you about RSVP reminders, changes to events you saved, or cancellations.",
  },
  {
    q: "Can I delete an event I created?",
    a: "Yes. Hosts can delete events. If people RSVP’d, we recommend posting an update or canceling with a reason.",
  },
  {
    q: "What if event details are wrong (time/location)?",
    a: "Event info is provided by hosts. Use the report button or message the host (if available) so it can be corrected.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-md bg-[#d9d9d9] p-4 text-black shadow-sm">
      <p className="font-semibold">Q: {q}</p>
      <p className="mt-2 text-sm text-black/80">A: {a}</p>
    </div>
  );
}

export function FAQPage() {
  return (
    <div className="min-h-screen bg-[#b8c6e6] text-black">
      {/*header*/}
      <div className="sticky top-0 z-10 border-b-2 border-black bg-[#f6f0e6] px-4 py-3">
        <h1 className="text-center font-[Oswald] text-3xl">FAQ</h1>
      </div>

      {/* back + avatar*/}
      <div className="flex items-center justify-between px-4 py-3">
        <button className="flex items-center gap-2 text-black/80 hover:text-black">
          <span className="text-xl">←</span>
          <span className="text-sm">Back to Search</span>
        </button>
      </div>

      {/*content*/}
      <div className="mx-auto w-full max-w-[420px] px-4 pb-10">
        <div className="space-y-4">
          {FAQS.map((item, idx) => (
            <FAQItem key={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
