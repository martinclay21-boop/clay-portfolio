import ProjectLayout from "@/components/ProjectLayout";
export const metadata = { title: "Spokenote Use Cases — Clay Martin" };

const BASE = "/clay-portfolio";

const images = [
  { src: `${BASE}/images/spokenote/streamline-communication.jpg`, alt: "Scanning floral thank you card with phone" },
  { src: `${BASE}/images/spokenote/welcome-guide.jpg`, alt: "Welcome guide presentation with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/town-hall.jpg`, alt: "Town Hall Meeting mailer with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/fundraising.jpg`, alt: "Fundraising campaign — See how you're making a difference" },
  { src: `${BASE}/images/spokenote/spokenote-flyer.png`, alt: "Spokenote flyer design" },
  { src: `${BASE}/images/spokenote/informed.jpg`, alt: "Fundraising print and phone mockup" },
  { src: `${BASE}/images/spokenote/community-engagement.jpg`, alt: "Community engagement — Town Hall meeting yard sign" },
  { src: `${BASE}/images/spokenote/wedding-thankyou.jpg`, alt: "Wedding thank you card with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/higher-education.jpg`, alt: "Higher education use case with laptop and pamphlet" },
  { src: `${BASE}/images/spokenote/real-estate.jpg`, alt: "For Sale yard sign with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/customer-loyalty.jpg`, alt: "Spokenote store thank you card" },
  { src: `${BASE}/images/spokenote/in-store.jpg`, alt: "In-store retail transaction with Spokenote thank you" },
  { src: `${BASE}/images/spokenote/alumni.jpg`, alt: "Alumni event YOU'RE INVITED mailers" },
  { src: `${BASE}/images/spokenote/direct-mail.jpg`, alt: "Business meeting with Spokenote one-pager" },
  { src: `${BASE}/images/spokenote/auto-service.jpg`, alt: "Auto service use case — repair order with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/thank-you-card.jpg`, alt: "Floral thank you card with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/cards-collage.png`, alt: "Hospitality use cases — Hotel Van Zandt, Parks Place Pub" },
  { src: `${BASE}/images/spokenote/construction.jpg`, alt: "Construction blueprints with Spokenote QR code" },
  { src: `${BASE}/images/spokenote/personalized-marketing.jpg`, alt: "Personalized discount mailer with Spokenote QR code" },
];

export default function Spokenote() {
  return (
    <ProjectLayout
      title="Spokenote Use Cases"
      category="Visual Design · Marketing"
      tags={["Photoshop", "Illustrator", "Figma", "Brand Design", "Marketing"]}
    >
      <h2>Overview</h2>
      <p>
        During my internship at Spokenote in Fishers, IN, I designed use case
        illustrations across 3 product pages to communicate real-world
        Spokenote applications to potential customers and partners. The work
        spanned product photography-style visuals, sales assets, and pitch
        materials.
      </p>

      <h2>The Challenge</h2>
      <p>
        Spokenote needed visuals that showed the product in realistic, relatable
        contexts — not abstract mockups. Potential customers and partners needed
        to immediately understand how and where Spokenote fits into their world.
      </p>

      <h2>Selected Work</h2>
      <p>
        A sample of use case visuals across industries — automotive, hospitality,
        construction, weddings, and retail marketing.
      </p>

      {/* Image grid — outside prose so we can go full width */}
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {images.map((img) => (
          <div key={img.src} className="rounded-xl overflow-hidden bg-slate-100">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <h2>What I Did</h2>
      <ul>
        <li>
          Created 25 realistic product use-case images using Photoshop and
          Illustrator, improving clarity of product presentation across the site
        </li>
        <li>
          Collaborated with the design team to ensure all new visuals aligned
          with brand guidelines and maintained overall site consistency
        </li>
        <li>
          Delivered 8 design assets including sales one-pagers and pitch decks
          aligned with company vision to support business development
        </li>
        <li>
          Participated in weekly cross-functional sales and marketing meetings
          to align creative deliverables with campaign priorities
        </li>
        <li>
          Researched outreach efforts to help generate 5–10 leads per day and
          uncover growth opportunities for the business
        </li>
      </ul>

      <h2>Collaboration</h2>
      <p>
        Working closely with design, marketing, and business development taught
        me how user insights translate into visuals that support revenue goals —
        not just aesthetics. Every asset had a clear business purpose, and I
        learned to design with that context in mind from the start.
      </p>

      <h2>Outcome</h2>
      <p>
        The updated visuals gave Spokenote a more professional, use-case-driven
        web presence. The pitch and sales assets supported active business
        development conversations with potential partners.
      </p>
    </ProjectLayout>
  );
}
