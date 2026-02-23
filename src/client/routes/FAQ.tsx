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
    <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 font-redhat">
      <p className="font-oswald text-2xl leading-snug">Q: {q}</p>
      <p className="mt-3 text-sm text-black/80">A: {a}</p>
    </div>
  );
}

export function FAQPage() {
  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex items-center justify-between">
        <p className="font-oswald text-5xl">FAQ</p>

        <button
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>

      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6">
        {FAQS.map((item, idx) => (
          <FAQItem key={idx} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}