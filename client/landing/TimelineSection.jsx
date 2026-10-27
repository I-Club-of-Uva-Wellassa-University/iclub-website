import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TimelineSection.css";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_DATA = [
  {
    id: 1,
    year: "2018",
    type: "up",
    positionX: 590,
    title: "iClub Inauguration",
    subtitle: "The Beginning of Our Journey",
    highlight: "Official Club Launch",
    description:
      "We started iClub to bring students together, share tech ideas, and build a strong creative community inside the university.",
    image: "/timeline/1.jpg",
  },
  {
    id: 2,
    year: "2019",
    type: "down",
    positionX: 1200,
    title: "Tech Fiesta 2023",
    subtitle: "Innovation & Workshops",
    highlight: "Hands-On Learning",
    description:
      "A full week of practical coding sessions, industry guest talks, and teamwork that helped members learn modern software skills.",
    image: "/timeline/2.jpg",
  },
  {
    id: 3,
    year: "2020",
    type: "up",
    positionX: 1850,
    title: "HackDay & Cultural Night",
    subtitle: "Unleashing Talent",
    highlight: "24-Hour Hackathon",
    description:
      "Students built smart solutions during a 24-hour coding challenge, followed by an evening of music and cultural performances.",
    image: "/timeline/3.jpg",
  },
  {
    id: 4,
    year: "2021",
    type: "down",
    positionX: 2350,
    title: "Annual General Meeting",
    subtitle: "AGM of iClub",
    highlight: "Celebrating Growth",
    description:
      "Members gathered to review our biggest achievements of the year, reward top contributors, and plan upcoming tech projects.",
    image: "/timeline/4.jpg",
  },
  {
    id: 5,
    year: "2022",
    type: "up",
    positionX: 2750,
    title: "New Executive Board",
    subtitle: "Stepping into the Future",
    highlight: "Next Generation Leaders",
    description:
      "A new team of student leaders took charge with fresh ideas to guide iClub toward bigger events and collaborations.",
    image: "/timeline/5.jpg",
  },
  {
    id: 6,
    year: "2023",
    type: "down",
    positionX: 3150,
    title: "New Executive Board",
    subtitle: "Stepping into the Future",
    highlight: "Next Generation Leaders",
    description:
      "A new team of student leaders took charge with fresh ideas to guide iClub toward bigger events and collaborations.",
    image: "/timeline/4.jpg",
  },
  {
    id: 7,
    year: "2024",
    type: "up",
    positionX: 3550,
    title: "New Executive Board",
    subtitle: "Stepping into the Future",
    highlight: "Next Generation Leaders",
    description:
      "A new team of student leaders took charge with fresh ideas to guide iClub toward bigger events and collaborations.",
    image: "/timeline/3.jpg",
  },
  {
    id: 8,
    year: "2025",
    type: "down",
    positionX: 4150,
    title: "New Executive Board",
    subtitle: "Stepping into the Future",
    highlight: "Next Generation Leaders",
    description:
      "A new team of student leaders took charge with fresh ideas to guide iClub toward bigger events and collaborations.",
    image: "/timeline/2.jpg",
  },
];

const LINE_MARKERS = [
  { pos: 320, label: "START" },
  { pos: 1375, label: "PHASE 01" },
  { pos: 2105, label: "PHASE 02" },
  { pos: 3075, label: "PHASE 03" },
  { pos: 3925, label: "PHASE 04" },
];

const LOOP_START_X = 4650;

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const leftHeaderRef = useRef(null);
  const mainLineRef = useRef(null);
  const bottomBarRef = useRef(null);
  const endLoopPathRef = useRef(null);
  const endLoopGlowRef = useRef(null);
  const endArrowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getMaxTranslateX = () =>
        Math.max(0, LOOP_START_X + 340 - window.innerWidth);

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
          posX: TIMELINE_DATA[index].positionX,
          popupTl,
          isVisible: false,
        };
      });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.7,
          end: () => `+=${getMaxTranslateX() + 900}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            if (bottomBarRef.current) {
              bottomBarRef.current.style.width = `${Math.min(100, p * 100)}%`;
            }

            if (leftHeaderRef.current) {
              const fadeProg = Math.min(1, p * 4.5);
              gsap.set(leftHeaderRef.current, {
                x: -fadeProg * 180,
                opacity: Math.max(0, 1 - fadeProg * 1.15),
              });
            }

            const horizPhase = Math.min(1, p / 0.82);
            const currentLineX = 180 + horizPhase * (LOOP_START_X - 180);

            if (mainLineRef.current) {
              mainLineRef.current.style.width = `${currentLineX}px`;
            }

            let currentActive = 1;
            milestoneStates.forEach((item, idx) => {
              if (currentLineX >= item.posX - 8) {
                currentActive = idx + 1;
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
            setActiveIndex(currentActive);

            const currentTrackX = gsap.getProperty(track, "x") || 0;
            milestoneStates.forEach((item) => {
              const screenX = item.posX + Number(currentTrackX);
              if (screenX < 140) {
                const fadeOutRatio = Math.max(0, (screenX + 80) / 220);
                gsap.set(item.el, {
                  opacity: fadeOutRatio,
                  filter: `blur(${(1 - fadeOutRatio) * 4}px)`,
                });
              } else {
                gsap.set(item.el, { opacity: 1, filter: "blur(0px)" });
              }
            });

            if (p > 0.82 && loopLen > 0) {
              const loopProgress = Math.min(1, (p - 0.82) / 0.18);
              const drawOffset = loopLen * (1 - loopProgress);
              gsap.set([endLoopPathRef.current, endLoopGlowRef.current], {
                strokeDashoffset: drawOffset,
              });
              if (endArrowRef.current) {
                gsap.set(endArrowRef.current, {
                  opacity: loopProgress > 0.65 ? 1 : 0,
                  y: loopProgress * 20,
                });
              }
            } else if (loopLen > 0) {
              gsap.set([endLoopPathRef.current, endLoopGlowRef.current], {
                strokeDashoffset: loopLen,
              });
              if (endArrowRef.current) {
                gsap.set(endArrowRef.current, { opacity: 0, y: 0 });
              }
            }
          },
        },
      });

      masterTl
        .to(track, {
          x: () => -getMaxTranslateX(),
          ease: "none",
          duration: 0.82,
        })
        .to(track, {
          x: () => -getMaxTranslateX(),
          ease: "none",
          duration: 0.18,
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        scale: 1.22,
        z: 90,
        y: -6,
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

  return (
    <section className="iclub-tl-wrapper" ref={sectionRef} id="timeline">
      <div className="iclub-tl-header-left" ref={leftHeaderRef}>
        <div className="iclub-tl-pill-badge">
          <span className="iclub-tl-dot"></span> TIMELINE
        </div>
        <h2 className="iclub-tl-main-title">Milestones</h2>
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
        <div className="iclub-tl-line-glow" ref={mainLineRef}></div>

        {LINE_MARKERS.map((mk, idx) => (
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

        {TIMELINE_DATA.map((item) => (
          <div
            key={item.id}
            className={`iclub-tl-milestone iclub-tl-${item.type}`}
            style={{ left: `${item.positionX}px` }}
          >
            <div className="iclub-tl-node-dot"></div>

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
                    <span className="iclub-tl-highlight">{item.highlight}</span>
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
            <strong>{String(activeIndex).padStart(2, "0")}</strong>
            <span> / {String(TIMELINE_DATA.length).padStart(2, "0")}</span>
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
  );
}