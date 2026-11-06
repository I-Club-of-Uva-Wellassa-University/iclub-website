import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TimelineSectionMobile from "./TimelineSectionMobile";
import "./TimelineSection.css";

gsap.registerPlugin(ScrollTrigger);

export const TIMELINE_SECTIONS = [
  {
    key: "ongoing",
    buttonLabel: "Ongoing Line",
    badge: "ACTIVE CORE TRACK",
    title: "Ongoing Projects",
    items: [
      {
        id: "ong-1",
        year: "2025",
        type: "down",
        localIdx: 1,
        positionX: 600,
        title: "Tech Fiesta 2025",
        subtitle: "Flagship Innovation Summit",
        highlight: "University-Wide Expo",
        description:
          "A full week of industry guest talks, live hardware exhibitions, and collaborative software showcases at UWU.",
        image: "/timeline/5.jpg",
      },
      {
        id: "ong-2",
        year: "2025",
        type: "down",
        localIdx: 2,
        positionX: 1350,
        title: "HackDay 24-Hour",
        subtitle: "Build for Sri Lanka",
        highlight: "Active Hackathon",
        description:
          "Undergraduates team up for a non-stop 24-hour product engineering marathon mentored by industry engineers.",
        image: "/timeline/3.jpg",
      },
      {
        id: "ong-3",
        year: "2026",
        type: "down",
        localIdx: 3,
        positionX: 2100,
        title: "iClub Digital Portal",
        subtitle: "Open-Source Ecosystem",
        highlight: "Platform Release",
        description:
          "Developing a unified student resource hub, event registration system, and project repository.",
        image: "/timeline/2.jpg",
      },
      {
        id: "ong-4",
        year: "2026",
        type: "down",
        localIdx: 4,
        positionX: 2850,
        title: "Industry Bridge",
        subtitle: "Career & Mentorship",
        highlight: "Undergraduate Track",
        description:
          "Connecting final-year and second-year undergraduates directly with software architects and tech leads.",
        image: "/timeline/4.jpg",
      },
    ],
  },
  {
    key: "past",
    buttonLabel: "Explore Past",
    badge: "COMPLETED ARCHIVE",
    title: "Past Projects Archive",
    items: [
      {
        id: "past-1",
        year: "2018",
        type: "down",
        localIdx: 1,
        positionX: 3950,
        title: "iClub Inauguration",
        subtitle: "The Beginning of Our Journey",
        highlight: "Official Club Launch",
        description:
          "We started iClub to bring students together, share tech ideas, and build a strong creative community inside the university.",
        image: "/timeline/1.jpg",
      },
      {
        id: "past-2",
        year: "2019",
        type: "down",
        localIdx: 2,
        positionX: 4700,
        title: "CodeSprint 1.0",
        subtitle: "Algorithmic Challenge",
        highlight: "150+ Coders",
        description:
          "First inter-batch competitive programming contest focused on data structures and problem-solving.",
        image: "/timeline/2.jpg",
      },
      {
        id: "past-3",
        year: "2021",
        type: "down",
        localIdx: 3,
        positionX: 5450,
        title: "WebDev Bootcamp",
        subtitle: "Full-Stack Series",
        highlight: "Hands-On Sessions",
        description:
          "Intensive weekend workshops covering modern React, Node.js, and cloud deployment fundamentals.",
        image: "/timeline/3.jpg",
      },
      {
        id: "past-4",
        year: "2023",
        type: "down",
        localIdx: 4,
        positionX: 6200,
        title: "Annual AGM & Awards",
        subtitle: "Leadership Transition",
        highlight: "Celebrating Growth",
        description:
          "Recognized top student contributors and inducted the new executive committee for the upcoming term.",
        image: "/timeline/4.jpg",
      },
    ],
  },
  {
    key: "future",
    buttonLabel: "Explore Future",
    badge: "UPCOMING ROADMAP",
    title: "Future Projects Roadmap",
    items: [
      {
        id: "fut-1",
        year: "2026",
        type: "down",
        localIdx: 1,
        positionX: 7300,
        title: "AI & Robotics Lab",
        subtitle: "Next-Gen Research",
        highlight: "Smart Systems",
        description:
          "Launching dedicated student study groups for embedded systems, computer vision, and applied LLMs.",
        image: "/timeline/1.jpg",
      },
      {
        id: "fut-2",
        year: "2027",
        type: "down",
        localIdx: 2,
        positionX: 8050,
        title: "Inter-Uni CTF",
        subtitle: "Cybersecurity Arena",
        highlight: "National Capture Flag",
        description:
          "Hosting an island-wide ethical hacking and network defense tournament for university teams.",
        image: "/timeline/4.jpg",
      },
      {
        id: "fut-3",
        year: "2027",
        type: "down",
        localIdx: 3,
        positionX: 8800,
        title: "Cloud Native Day",
        subtitle: "DevOps & Architecture",
        highlight: "AWS & Kubernetes",
        description:
          "Hands-on cloud infrastructure labs teaching container orchestration and scalable microservice design.",
        image: "/timeline/3.jpg",
      },
      {
        id: "fut-4",
        year: "2027",
        type: "down",
        localIdx: 4,
        positionX: 9550,
        title: "iClub Incubator",
        subtitle: "Student Startups",
        highlight: "Seed Pitch Night",
        description:
          "Supporting undergraduate founder teams to turn final-year research projects into commercial SaaS products.",
        image: "/timeline/2.jpg",
      },
    ],
  },
];

const ALL_MILESTONES = TIMELINE_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionKey: section.key,
    sectionTitle: section.title,
    sectionTotal: section.items.length,
  }))
);

const TRANSITION_GATES = [
  { pos: 300, label: "ONGOING START", sectionKey: "ongoing" },
  { pos: 3450, label: "EXPLORE PAST", sectionKey: "past" },
  { pos: 6800, label: "EXPLORE FUTURE", sectionKey: "future" },
];

const LOOP_START_X = 10400;
const GLITCH_CHARS = "!<>-_\\/[]{}=+*^?#01";

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const mainLineRef = useRef(null);
  const bottomBarRef = useRef(null);
  const endLoopPathRef = useRef(null);
  const endLoopGlowRef = useRef(null);
  const endArrowRef = useRef(null);
  const stInstanceRef = useRef(null);
  const titleElRef = useRef(null);
  const switchBtnRefs = useRef({});

  const [activeTrack, setActiveTrack] = useState("ongoing");
  const [activeLocalIndex, setActiveLocalIndex] = useState(1);
  const [displayTitle, setDisplayTitle] = useState("Ongoing Projects");
  const [isGlitching, setIsGlitching] = useState(false);
  const [navPill, setNavPill] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeTrackRef = useRef("ongoing");

  const updateNavPill = () => {
    const btn = switchBtnRefs.current[activeTrack];
    if (btn) {
      setNavPill({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        ready: true,
      });
    }
  };

  useLayoutEffect(() => {
    updateNavPill();
  }, [activeTrack]);

  useEffect(() => {
    window.addEventListener("resize", updateNavPill);
    return () => window.removeEventListener("resize", updateNavPill);
  }, [activeTrack]);

  useEffect(() => {
    const sectionObj = TIMELINE_SECTIONS.find((s) => s.key === activeTrack);
    const targetText = sectionObj ? sectionObj.title : "Ongoing Projects";

    setIsGlitching(true);
    const state = { p: 0 };

    const tween = gsap.to(state, {
      p: 1,
      duration: 0.52,
      ease: "power2.out",
      onUpdate: () => {
        const revealedCount = Math.floor(state.p * targetText.length);
        const scrambled =
          targetText.slice(0, revealedCount) +
          targetText
            .slice(revealedCount)
            .split("")
            .map((ch) =>
              ch === " "
                ? " "
                : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            )
            .join("");
        setDisplayTitle(scrambled);
      },
      onComplete: () => {
        setDisplayTitle(targetText);
        setIsGlitching(false);
      },
    });

    if (titleElRef.current) {
      gsap.fromTo(
        titleElRef.current,
        { x: -8, skewX: -8 },
        { x: 0, skewX: 0, duration: 0.42, ease: "back.out(2)" }
      );
    }

    return () => tween.kill();
  }, [activeTrack]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 769px)",
      () => {
        const track = trackRef.current;
        if (!track) return;

        const getMaxTranslateX = () =>
          Math.max(0, LOOP_START_X + 420 - window.innerWidth);

        const svgPaths = gsap.utils.toArray(".iclub-tl-svg-draw");
        svgPaths.forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
        });

        let loopLen = 0;
        if (endLoopPathRef.current && endLoopGlowRef.current) {
          loopLen = endLoopPathRef.current.getTotalLength();
          gsap.set([endLoopPathRef.current, endLoopGlowRef.current], {
            strokeDasharray: loopLen,
            strokeDashoffset: loopLen,
          });
        }

        const milestoneEls = gsap.utils.toArray(".iclub-tl-milestone");
        const milestoneStates = milestoneEls.map((ms, index) => {
          const dot = ms.querySelector(".iclub-tl-node-dot");
          const branchLine = ms.querySelector(".iclub-tl-branch-path");
          const circleRing = ms.querySelector(".iclub-tl-circle-ring");
          const portal = ms.querySelector(".iclub-tl-portal-glow");
          const yearText = ms.querySelector(".iclub-tl-year");
          const popoutCard = ms.querySelector(".iclub-tl-popout-card");
          const descConnector = ms.querySelector(".iclub-tl-desc-connector");
          const descBox = ms.querySelector(".iclub-tl-desc-box");

          const popupTl = gsap.timeline({ paused: true });

          popupTl
            .to(dot, { scale: 1, duration: 0.22, ease: "back.out(2.5)" })
            .to(
              branchLine,
              { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" },
              "-=0.1"
            )
            .to(
              circleRing,
              { strokeDashoffset: 0, duration: 0.38, ease: "power2.out" },
              "-=0.18"
            )
            .to(
              portal,
              { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
              "-=0.3"
            )
            .to(
              yearText,
              { opacity: 1, y: 0, z: 30, duration: 0.3, ease: "power3.out" },
              "-=0.28"
            )
            .to(
              popoutCard,
              {
                opacity: 1,
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                z: 50,
                duration: 0.45,
                ease: "back.out(1.8)",
              },
              "-=0.26"
            )
            .to(
              descConnector,
              { scaleY: 1, opacity: 1, duration: 0.28, ease: "power2.out" },
              "-=0.38"
            )
            .to(
              descBox,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                z: 30,
                duration: 0.42,
                ease: "back.out(1.7)",
              },
              "-=0.28"
            );

          return {
            el: ms,
            data: ALL_MILESTONES[index],
            posX: ALL_MILESTONES[index].positionX,
            popupTl,
            isVisible: false,
          };
        });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 0.75,
            end: () => `+=${getMaxTranslateX() + 1300}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              stInstanceRef.current = self;
              const p = self.progress;

              if (bottomBarRef.current) {
                bottomBarRef.current.style.width = `${Math.min(100, p * 100)}%`;
              }

              const horizPhase = Math.min(1, p / 0.91);
              const maxTx = getMaxTranslateX();
              const currentTrackX = -horizPhase * maxTx;

              const drawLeadX = Math.min(
                window.innerWidth * 0.72,
                260 + horizPhase * (window.innerWidth * 0.48)
              );
              const currentLineX = Math.min(
                LOOP_START_X,
                Math.max(200, -currentTrackX + drawLeadX)
              );

              if (mainLineRef.current) {
                mainLineRef.current.style.width = `${currentLineX}px`;
              }

              let detectedSection = "ongoing";
              if (currentLineX >= 6800) {
                detectedSection = "future";
              } else if (currentLineX >= 3450) {
                detectedSection = "past";
              }

              if (detectedSection !== activeTrackRef.current) {
                activeTrackRef.current = detectedSection;
                setActiveTrack(detectedSection);
              }

              let currentLocalIdx = 1;
              milestoneStates.forEach((item) => {
                if (currentLineX >= item.posX - 10) {
                  if (item.data.sectionKey === detectedSection) {
                    currentLocalIdx = item.data.localIdx;
                  }
                  if (!item.isVisible) {
                    item.isVisible = true;
                    item.popupTl.play();
                  }
                } else {
                  if (item.isVisible) {
                    item.isVisible = false;
                    item.popupTl.reverse();
                  }
                }
              });
              setActiveLocalIndex(currentLocalIdx);

              milestoneStates.forEach((item) => {
                const screenX = item.posX + currentTrackX;
                if (screenX < 150) {
                  const fadeOutRatio = Math.max(0, (screenX + 120) / 270);
                  gsap.set(item.el, {
                    opacity: fadeOutRatio,
                    x: -(1 - fadeOutRatio) * 45,
                    filter: `blur(${((1 - fadeOutRatio) * 4.5).toFixed(2)}px)`,
                  });
                } else {
                  gsap.set(item.el, {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  });
                }
              });

              if (p > 0.91 && loopLen > 0) {
                const loopProgress = Math.min(1, (p - 0.91) / 0.09);
                const drawOffset = loopLen * (1 - loopProgress);
                gsap.set([endLoopPathRef.current, endLoopGlowRef.current], {
                  strokeDashoffset: drawOffset,
                });
                if (endArrowRef.current) {
                  gsap.set(endArrowRef.current, {
                    opacity: loopProgress > 0.55 ? 1 : 0,
                    y: loopProgress * 20,
                    pointerEvents: loopProgress > 0.55 ? "auto" : "none",
                  });
                }
              } else if (loopLen > 0) {
                gsap.set([endLoopPathRef.current, endLoopGlowRef.current], {
                  strokeDashoffset: loopLen,
                });
                if (endArrowRef.current) {
                  gsap.set(endArrowRef.current, {
                    opacity: 0,
                    y: 0,
                    pointerEvents: "none",
                  });
                }
              }
            },
          },
        });

        masterTl
          .to(track, {
            x: () => -getMaxTranslateX(),
            ease: "none",
            duration: 0.91,
          })
          .to(track, {
            x: () => -getMaxTranslateX(),
            ease: "none",
            duration: 0.09,
          });
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  const handleSwitchSection = (targetKey) => {
    const st = stInstanceRef.current;
    if (!st) {
      setActiveTrack(targetKey);
      return;
    }

    const maxTx = Math.max(0, LOOP_START_X + 420 - window.innerWidth);
    let targetWorldX = 0;

    if (targetKey === "ongoing") {
      targetWorldX = 0;
    } else if (targetKey === "past") {
      targetWorldX = Math.max(0, 3950 - window.innerWidth * 0.32);
    } else if (targetKey === "future") {
      targetWorldX = Math.max(0, 7300 - window.innerWidth * 0.32);
    }

    const horizRatio = maxTx > 0 ? Math.min(1, targetWorldX / maxTx) : 0;
    const totalProgress = horizRatio * 0.91;
    const targetScrollY = st.start + totalProgress * (st.end - st.start);

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  const handleZoneEnter = (e) => {
    const zone = e.currentTarget;
    const ms = zone.closest(".iclub-tl-milestone");
    const cardInner = zone.querySelector(".iclub-tl-card-inner");
    const glow = zone.querySelector(".iclub-tl-portal-glow");
    const descBox = ms?.querySelector(".iclub-tl-desc-box-inner");
    const descLine = ms?.querySelector(".iclub-tl-desc-connector");
    const isUp = ms?.classList.contains("iclub-tl-up");

    if (cardInner) {
      gsap.to(cardInner, {
        scale: 1.1,
        z: 90,
        y: -2,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (glow) {
      gsap.to(glow, {
        scale: 1.2,
        boxShadow: "inset 0 0 32px #ffffff, 0 0 45px rgba(0, 180, 216, 0.85)",
        duration: 0.4,
        overwrite: "auto",
      });
    }

    if (descBox) {
      gsap.to(descBox, {
        scale: 1.07,
        y: isUp ? 6 : -6,
        boxShadow:
          "0 22px 44px rgba(7, 42, 71, 0.25), 0 0 24px rgba(56, 189, 248, 0.45)",
        borderColor: "#072a47",
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (descLine) {
      gsap.to(descLine, {
        background: "#072a47",
        scaleY: 1.12,
        duration: 0.35,
        overwrite: "auto",
      });
    }
  };

  const handleZoneMove = (e) => {
    const zone = e.currentTarget;
    const cardInner = zone.querySelector(".iclub-tl-card-inner");
    if (!cardInner) return;

    const rect = zone.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardInner, {
      rotationY: relX * 22,
      rotationX: -relY * 22,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleZoneLeave = (e) => {
    const zone = e.currentTarget;
    const ms = zone.closest(".iclub-tl-milestone");
    const cardInner = zone.querySelector(".iclub-tl-card-inner");
    const glow = zone.querySelector(".iclub-tl-portal-glow");
    const descBox = ms?.querySelector(".iclub-tl-desc-box-inner");
    const descLine = ms?.querySelector(".iclub-tl-desc-connector");

    if (cardInner) {
      gsap.to(cardInner, {
        scale: 1,
        z: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (glow) {
      gsap.to(glow, {
        scale: 1,
        boxShadow:
          "inset 0 0 20px #ffffff, 0 14px 30px rgba(13, 74, 117, 0.18)",
        duration: 0.45,
        overwrite: "auto",
      });
    }

    if (descBox) {
      gsap.to(descBox, {
        scale: 1,
        y: 0,
        boxShadow: "0 12px 28px rgba(13, 67, 107, 0.14)",
        borderColor: "rgba(255, 255, 255, 0.9)",
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (descLine) {
      gsap.to(descLine, {
        background: "linear-gradient(180deg, #ffffff, #00b4d8)",
        scaleY: 1,
        duration: 0.4,
        overwrite: "auto",
      });
    }
  };

  const scrollToContact = () => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentSectionObj =
    TIMELINE_SECTIONS.find((s) => s.key === activeTrack) ||
    TIMELINE_SECTIONS[0];

  return (
    <div id="timeline">
      <div className="iclub-tl-desktop-only">
        <section
          className={`iclub-tl-wrapper section-mood-${activeTrack}`}
          ref={sectionRef}
        >
          <div className="iclub-tl-header-left">
            <div className="iclub-tl-pill-badge">
              <span className={`iclub-tl-dot dot-mood-${activeTrack}`}></span>
              <span>TIMELINE • {currentSectionObj.badge}</span>
            </div>

            <h2
              ref={titleElRef}
              className={`iclub-tl-main-title ${
                isGlitching ? "iclub-tl-glitch-active" : ""
              }`}
              data-text={displayTitle}
            >
              {displayTitle}
            </h2>
          </div>

          <div className="iclub-tl-bg-header-right">
            <span className="iclub-tl-outline-title">Era of</span>
            <span className="iclub-tl-solid-title">iClub</span>
          </div>

          <div className="iclub-tl-track" ref={trackRef}>
            <div
              className="iclub-tl-line-base"
              style={{ width: `${LOOP_START_X}px` }}
            ></div>
            <div
              className="iclub-tl-line-glow"
              ref={mainLineRef}
              style={{ backgroundSize: `${LOOP_START_X}px 100%` }}
            ></div>

            {TRANSITION_GATES.map((mk, idx) => (
              <div
                key={idx}
                className="iclub-tl-line-marker"
                style={{ left: `${mk.pos}px` }}
              >
                <span className="iclub-tl-tick-top"></span>
                <span className="iclub-tl-diamond"></span>
                <span className="iclub-tl-tick-bottom"></span>
                <span className="iclub-tl-marker-label">{mk.label}</span>
              </div>
            ))}

            {ALL_MILESTONES.map((item) => (
              <div
                key={item.id}
                className={`iclub-tl-milestone iclub-tl-${item.type} ms-theme-${item.sectionKey}`}
                style={{ left: `${item.positionX}px` }}
              >
                <div
                  className={`iclub-tl-node-dot dot-${item.sectionKey}`}
                ></div>

                {item.type === "up" ? (
                  <svg
                    className="iclub-tl-svg iclub-tl-svg-up"
                    width="350"
                    height="200"
                    viewBox="0 0 350 200"
                  >
                    <path
                      className="iclub-tl-branch-path iclub-tl-svg-draw"
                      d="M 20 200 L 20 85 L 175 85"
                    />
                    <circle
                      className="iclub-tl-circle-ring iclub-tl-svg-draw"
                      cx="245"
                      cy="85"
                      r="70"
                    />
                  </svg>
                ) : (
                  <svg
                    className="iclub-tl-svg iclub-tl-svg-down"
                    width="350"
                    height="200"
                    viewBox="0 0 350 200"
                  >
                    <path
                      className="iclub-tl-branch-path iclub-tl-svg-draw"
                      d="M 20 0 L 20 115 L 175 115"
                    />
                    <circle
                      className="iclub-tl-circle-ring iclub-tl-svg-draw"
                      cx="245"
                      cy="115"
                      r="70"
                    />
                  </svg>
                )}

                <div className="iclub-tl-content-box">
                  <div className="iclub-tl-year">{item.year}</div>

                  <div
                    className="iclub-tl-hover-zone"
                    onMouseEnter={handleZoneEnter}
                    onMouseMove={handleZoneMove}
                    onMouseLeave={handleZoneLeave}
                  >
                    <div className="iclub-tl-circle-portal">
                      <div className="iclub-tl-portal-glow"></div>
                      <div className="iclub-tl-popout-card">
                        <div className="iclub-tl-card-inner">
                          <img src={item.image} alt={item.title} />
                          <div className="iclub-tl-card-info">
                            <h4>{item.title}</h4>
                            <p>{item.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="iclub-tl-desc-wrapper">
                  <div className="iclub-tl-desc-connector"></div>
                  <div className="iclub-tl-desc-box">
                    <div className="iclub-tl-desc-box-inner">
                      <div className="iclub-tl-desc-tag">
                        <span className="iclub-tl-desc-bullet"></span>
                        <span className="iclub-tl-highlight">
                          {item.highlight}
                        </span>
                      </div>
                      <p className="iclub-tl-desc-text">
                        <strong className="iclub-tl-navy-text">
                          {item.title}:{" "}
                        </strong>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              className="iclub-tl-end-loop-container"
              style={{ left: `${LOOP_START_X}px` }}
            >

              <img
                src="/Logo/ilogo.png"
                alt="iClub Logo"
                className="iclub-tl-gap-logo"
              />
              <svg
                className="iclub-tl-end-loop-svg"
                width="340"
                height="850"
                viewBox="0 0 340 850"
              >
                <path
                  className="iclub-tl-loop-base"
                  d="M 0 180 L 120 180 C 255 180, 255 25, 150 25 C 55 25, 85 180, 130 235 L 130 850"
                />
                <path
                  ref={endLoopGlowRef}
                  className="iclub-tl-loop-glow"
                  d="M 0 180 L 120 180 C 255 180, 255 25, 150 25 C 55 25, 85 180, 130 235 L 130 850"
                />
                <path
                  ref={endLoopPathRef}
                  className="iclub-tl-loop-core"
                  d="M 0 180 L 120 180 C 255 180, 255 25, 150 25 C 55 25, 85 180, 130 235 L 130 850"
                />
              </svg>

              <div
                className="iclub-tl-end-arrow"
                ref={endArrowRef}
                onClick={scrollToContact}
              >
                <span>SCROLL TO CONTACT</span>
                <div className="iclub-tl-arrow-icon">&#8595;</div>
              </div>
            </div>
          </div>

          <div className="iclub-tl-bottom-hud">
            <div className="iclub-tl-hud-row">
              <div className="iclub-tl-counter">
                <strong>{String(activeLocalIndex).padStart(2, "0")}</strong>
                <span>
                  {" "}
                  / {String(currentSectionObj.items.length).padStart(2, "0")}
                </span>
              </div>

              <div className="iclub-tl-nav-dock">
                <span
                  className={`iclub-tl-nav-pill pill-mood-${activeTrack} ${
                    navPill.ready ? "ready" : ""
                  }`}
                  style={{
                    left: `${navPill.left}px`,
                    width: `${navPill.width}px`,
                  }}
                />
                {TIMELINE_SECTIONS.map((sec) => (
                  <button
                    key={sec.key}
                    ref={(el) => (switchBtnRefs.current[sec.key] = el)}
                    type="button"
                    className={`iclub-tl-switch-btn ${
                      activeTrack === sec.key ? "active" : ""
                    }`}
                    onClick={() => handleSwitchSection(sec.key)}
                  >
                    {sec.buttonLabel}
                  </button>
                ))}
              </div>

              <div className="iclub-tl-scroll-label">
                SCROLL <br /> <span>&#8964;</span>
              </div>
            </div>

            <div className="iclub-tl-progress-track">
              <div className="iclub-tl-progress-fill" ref={bottomBarRef}></div>
            </div>
          </div>
        </section>
      </div>

      <div className="iclub-tl-mobile-only">
        <TimelineSectionMobile sections={TIMELINE_SECTIONS} />
      </div>
    </div>
  );
}