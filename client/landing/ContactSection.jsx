import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fontsource-variable/geist";
import "./ContactSection.css";

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Shan Panditharathana",
    role: "President",
    department: "Dept. of ICT, Faculty of Technological Studies",
    batch: "Batch 16",
    email: "president@iclub-uwu.lk",
    linkedin: "https://linkedin.com",
    bio: "Leading strategic initiatives, university-wide hackathons, and industry partnerships for the iClub community at Uva Wellassa University.",
    image: "/contact/2.jpg",
  },
  {
    id: 2,
    name: "Nimasha Chathurangi",
    role: "Secretary of iClub",
    department: "Dept. of Computer Science & Informatics",
    batch: "Batch 17",
    email: "secretary@iclub-uwu.lk",
    linkedin: "https://linkedin.com",
    bio: "Managing official communications, club documentation, and coordinating executive board operations and annual events.",
    image: "/contact/5.jpg",
  },
  {
    id: 3,
    name: "Dharmadasa",
    role: "Vice President",
    department: "Dept. of ICT, Faculty of Technological Studies",
    batch: "Batch 18",
    email: "vp@iclub-uwu.lk",
    linkedin: "https://linkedin.com",
    bio: "Overseeing technical workshops, project mentorship programs, and inter-university competitions.",
    image: "/contact/4.jpg",
  },
  {
    id: 4,
    name: "V. Dishankan",
    role: "Treasurer",
    department: "Dept. of ICT, Faculty of Technological Studies",
    batch: "Batch 16",
    email: "treasurer@iclub-uwu.lk",
    linkedin: "https://linkedin.com",
    bio: "Handling sponsorship outreach, event budgeting, and financial planning for all club activities.",
    image: "/contact/6.jpg",
  },
  {
    id: 5,
    name: "K.G.C. Senarathne",
    role: "Senior Treasurer / Advisor",
    department: "Faculty of Technological Studies",
    batch: "Academic Staff",
    email: "advisor@iclub-uwu.lk",
    linkedin: "https://linkedin.com",
    bio: "Guiding academic excellence, institutional governance, and strategic growth for iClub initiatives.",
    image: "/contact/5.jpg",
  },
  {
    id: 6,
    name: "Madhawa Jayawickrama",
    role: "Lead Designer",
    department: "Dept. of ICT, Faculty of Technological Studies",
    batch: "Batch 18",
    email: "design@iclub-uwu.lk",
    linkedin: "https://linkedin.com",
    bio: "Directing visual identity, digital media production, UI/UX systems, and promotional campaigns for iClub.",
    image: "/contact/1.jpg",
  },
];

const PAST_BOARDS = {
  "2024 / 2025": [
    {
      name: "Kasun Kalhara",
      role: "President",
      batch: "Batch 15",
      department: "Dept. of ICT",
      contribution: "Spearheaded Tech Fiesta 2024 & Industry Bridge",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Sachini Nimesha",
      role: "Secretary",
      batch: "Batch 15",
      department: "Dept. of ICT",
      contribution: "Led club restructuring & inter-faculty outreach",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Chathura Lakmal",
      role: "Vice President",
      batch: "Batch 15",
      department: "Dept. of ICT",
      contribution: "Coordinated 24-Hour HackDay & coding bootcamps",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Pabasara Herath",
      role: "Junior Treasurer",
      batch: "Batch 16",
      department: "Dept. of ICT",
      contribution: "Managed corporate sponsorships & annual budgets",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Isuru Udana",
      role: "Chief Editor",
      batch: "Batch 16",
      department: "Dept. of ICT",
      contribution: "Launched the official digital magazine & media unit",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Sanduni Perera",
      role: "Event Coordinator",
      batch: "Batch 16",
      department: "Dept. of ICT",
      contribution: "Directed logistics for 800+ student attendees",
      linkedin: "https://linkedin.com",
    },
  ],
  "2023 / 2024": [
    {
      name: "Janith Liyanage",
      role: "President",
      batch: "Batch 14",
      department: "Dept. of ICT",
      contribution: "Initiated open-source community chapters at UWU",
      linkedin: "https://linkedin.com",
    },
    {
      name: "kaveesha Gimhani",
      role: "Secretary",
      batch: "Batch 14",
      department: "Dept. of ICT",
      contribution: "Established digital membership & alumni network",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Malith Perera",
      role: "Vice President",
      batch: "Batch 14",
      department: "Dept. of ICT",
      contribution: "Organized cloud computing & AI awareness series",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Thilina Bandara",
      role: "Chief Editor",
      batch: "Batch 15",
      department: "Dept. of ICT",
      contribution: "Rebranded iClub visual identity & social presence",
      linkedin: "https://linkedin.com",
    },
  ],
  "2022 / 2023": [
    {
      name: "Nuwan Pradeep",
      role: "President",
      batch: "Batch 13",
      department: "Dept. of ICT",
      contribution: "Revitalized on-campus tech events & workshops",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Hashini Silva",
      role: "Secretary",
      batch: "Batch 13",
      department: "Dept. of ICT",
      contribution: "Coordinated virtual & hybrid guest lecture series",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Gayantha Rathnayake",
      role: "Vice President",
      batch: "Batch 13",
      department: "Dept. of ICT",
      contribution: "Mentored undergraduate software project teams",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Dinesh Karunarathne",
      role: "Treasurer",
      batch: "Batch 14",
      department: "Dept. of ICT",
      contribution: "oversaw club funding & partner relations",
      linkedin: "https://linkedin.com",
    },
  ],
};

const SOCIAL_CHANNELS = [
  {
    id: "facebook",
    name: "Facebook",
    handle: "@iClubUWU",
    badge: "Event Updates & Albums",
    description: "Follow our official page for event photo albums, announcements, and live coverage.",
    url: "https://web.facebook.com/profile.php?id=61590906690139",
    accent: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "iClub - Uva Wellassa University",
    badge: "Professional Network",
    description: "Connect with our alumni network, industry partners, and career mentorship programs.",
    url: "https://www.linkedin.com/company/i-club-of-uva-wellassa-university/",
    accent: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
{
    id: "youtube",
    name: "YouTube",
    handle: "@iClubUWU",
    badge: "Tech Talks & Sessions",
    description: "Watch recorded tech workshops, hackathon highlights, and tutorial sessions on our official channel.",
    url: "https://www.youtube.com/@iclubof_uvawellassauniversity",
    accent: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
{
    id: "instagram",
    name: "Instagram",
    handle: "@iclub.uwu",
    badge: "Stories & Reels",
    description: "Catch behind-the-scenes moments, hackathon reels, and campus tech culture.",
    url: "https://www.instagram.com/iclubuwu/",
    accent: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const historyContentRef = useRef(null);
  const historyGridRef = useRef(null);

  const [selectedMember, setSelectedMember] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeYear, setActiveYear] = useState("2024 / 2025");

  const yearKeys = Object.keys(PAST_BOARDS);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray(".iclub-ct-reveal");

      revealEls.forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const panel = historyContentRef.current;
    if (!panel) return;

    if (showHistory) {
      gsap.to(panel, {
        height: "auto",
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
        onComplete: () => ScrollTrigger.refresh(),
      });

      const cards = historyGridRef.current?.querySelectorAll(".iclub-ct-past-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            stagger: 0.06,
            ease: "back.out(1.4)",
          }
        );
      }
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  }, [showHistory]);

  useEffect(() => {
    if (!showHistory || !historyGridRef.current) return;
    const cards = historyGridRef.current.querySelectorAll(".iclub-ct-past-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.36,
        stagger: 0.05,
        ease: "power3.out",
      }
    );
  }, [activeYear, showHistory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const marqueeItems = [...TEAM_MEMBERS, ...TEAM_MEMBERS];

  return (
    <section className="iclub-ct-wrapper" ref={sectionRef} id="contact">
      <div className="iclub-ct-bg-orb iclub-ct-orb-1"></div>
      <div className="iclub-ct-bg-orb iclub-ct-orb-2"></div>

      <div className="iclub-ct-container">
        <div className="iclub-ct-header iclub-ct-reveal">
          <div className="iclub-ct-header-left">
            <div className="iclub-ct-pill-badge">
              <span className="iclub-ct-dot"></span> GET IN TOUCH
            </div>
            <h2 className="iclub-ct-main-title">Contact Us</h2>
            <p className="iclub-ct-subtitle">
              Have an idea, partnership proposal, or question about our upcoming
              events at Uva Wellassa University? Reach out to our executive team
              or connect with our official channels below.
            </p>
          </div>

          <div className="iclub-ct-header-right">
            <span className="iclub-ct-outline-title">Connect</span>
            <span className="iclub-ct-solid-title">iClub UWU</span>
          </div>
        </div>

        <div className="iclub-ct-marquee-section iclub-ct-reveal">
          <div className="iclub-ct-section-bar">
            <div className="iclub-ct-bar-title">
              <span className="iclub-ct-pulse-dot"></span>
              <h3>Current Executive Committee</h3>
            </div>
            <span className="iclub-ct-hint-badge">
              Click any card to view profile & email
            </span>
          </div>

          <div className="iclub-ct-marquee-viewport">
            <div className="iclub-ct-marquee-track">
              {marqueeItems.map((member, index) => (
                <div
                  key={`${member.id}-${index}`}
                  className="iclub-ct-member-card"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="iclub-ct-avatar-wrap">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                    />
                    <span className="iclub-ct-role-pill">{member.role}</span>
                  </div>

                  <div className="iclub-ct-member-info">
                    <h4>{member.name}</h4>
                    <p>{member.batch} • UWU</p>
                    <div className="iclub-ct-card-action">
                      <span>View Profile</span>
                      <span className="iclub-ct-action-arrow">&#8594;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="iclub-ct-history-wrapper">
            <div className="iclub-ct-history-toggle-row">
              <button
                type="button"
                className={`iclub-ct-history-btn ${showHistory ? "active" : ""}`}
                onClick={() => setShowHistory((prev) => !prev)}
                aria-expanded={showHistory}
              >
                <span className="iclub-ct-history-btn-dot"></span>
                <span>
                  {showHistory
                    ? "Hide Past Executive Boards"
                    : "Explore Past Executive Boards"}
                </span>
                <span className="iclub-ct-history-chevron">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
            </div>

            <div
              className="iclub-ct-history-drawer"
              ref={historyContentRef}
              style={{ height: 0, opacity: 0, overflow: "hidden" }}
            >
              <div className="iclub-ct-history-inner">
                <div className="iclub-ct-history-top">
                  <div>
                    <span className="iclub-ct-archive-tag">HALL OF LEADERSHIP</span>
                    <h4>Past Executive Committees</h4>
                  </div>

                  <div className="iclub-ct-year-tabs">
                    {yearKeys.map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={`iclub-ct-year-tab ${
                          activeYear === year ? "selected" : ""
                        }`}
                        onClick={() => setActiveYear(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="iclub-ct-past-grid" ref={historyGridRef}>
                  {PAST_BOARDS[activeYear].map((alum, idx) => (
                    <div key={`${activeYear}-${idx}`} className="iclub-ct-past-card">
                      <div className="iclub-ct-past-card-head">
                        <span className="iclub-ct-past-role">{alum.role}</span>
                        <span className="iclub-ct-past-batch">{alum.batch}</span>
                      </div>

                      <h5>{alum.name}</h5>
                      <span className="iclub-ct-past-dept">{alum.department}</span>
                      <p className="iclub-ct-past-contrib">{alum.contribution}</p>

                      <div className="iclub-ct-past-footer">
                        <span className="iclub-ct-past-term">Term {activeYear}</span>
                        <a
                          href={alum.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="iclub-ct-past-link"
                        >
                          LinkedIn &#8599;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="iclub-ct-main-grid">
          <div className="iclub-ct-info-column iclub-ct-reveal">
            <div className="iclub-ct-uni-card">
              <div className="iclub-ct-uni-tag">OFFICIAL HEADQUARTERS</div>
              <h3>iClub — Uva Wellassa University</h3>
              <p>
                Empowering undergraduates through technology, innovation, and
                collaborative learning across all faculties.
              </p>

              <div className="iclub-ct-info-list">
                <div className="iclub-ct-info-item">
                  <div className="iclub-ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span>Location</span>
                    <strong>Passara Road, Badulla 90000, Sri Lanka</strong>
                  </div>
                </div>

                <div className="iclub-ct-info-item">
                  <div className="iclub-ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <span>Official Email</span>
                    <strong>hello@iclub.uwu.ac.lk</strong>
                  </div>
                </div>

                <div className="iclub-ct-info-item">
                  <div className="iclub-ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div>
                    <span>Faculty Portal</span>
                    <strong>Faculty of Technological Studies • UWU</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="iclub-ct-social-column iclub-ct-reveal">
            <div className="iclub-ct-social-hub-card">
              <div className="iclub-ct-uni-tag">COMMUNITY & SOCIAL HUB</div>
              <h3>Follow Our Digital Channels</h3>
              <p>
                Stay updated with our latest hackathons, tech workshops, and
                community highlights through our official platforms.
              </p>

              <div className="iclub-ct-social-bento">
                {SOCIAL_CHANNELS.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="iclub-ct-social-tile"
                    style={{ "--tile-accent": item.accent }}
                  >
                    <div className="iclub-ct-social-popup-pill">
                      Open {item.name} &#8599;
                    </div>

                    <div className="iclub-ct-social-tile-top">
                      <div className="iclub-ct-social-icon-wrap">
                        {item.icon}
                      </div>
                      <span className="iclub-ct-social-badge">{item.badge}</span>
                    </div>

                    <div className="iclub-ct-social-tile-body">
                      <h4>{item.name}</h4>
                      <span className="iclub-ct-social-handle">{item.handle}</span>
                      <p>{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedMember && (
        <div
          className="iclub-ct-modal-backdrop"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="iclub-ct-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="iclub-ct-modal-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Close modal"
            >
              &#10005;
            </button>

            <div className="iclub-ct-modal-top">
              <div className="iclub-ct-modal-img-wrap">
                <img src={selectedMember.image} alt={selectedMember.name} />
              </div>
              <div className="iclub-ct-modal-headline">
                <span className="iclub-ct-modal-badge">
                  {selectedMember.role}
                </span>
                <h3>{selectedMember.name}</h3>
                <p className="iclub-ct-modal-dept">
                  {selectedMember.department}
                </p>
                <span className="iclub-ct-modal-batch">
                  {selectedMember.batch} • Uva Wellassa University
                </span>
              </div>
            </div>

            <p className="iclub-ct-modal-bio">{selectedMember.bio}</p>

            <div className="iclub-ct-modal-details-single">
              <a
                href={`mailto:${selectedMember.email}`}
                className="iclub-ct-detail-box"
              >
                <div className="iclub-ct-detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span className="iclub-ct-detail-label">Official Email</span>
                  <strong>{selectedMember.email}</strong>
                </div>
              </a>
            </div>

            <div className="iclub-ct-modal-actions">
              <a
                href={`mailto:${selectedMember.email}`}
                className="iclub-ct-modal-btn primary"
              >
                Send Email
              </a>
              <a
                href={selectedMember.linkedin}
                target="_blank"
                rel="noreferrer"
                className="iclub-ct-modal-btn secondary"
              >
                LinkedIn Profile &#8599;
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}