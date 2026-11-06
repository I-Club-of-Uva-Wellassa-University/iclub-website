import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TimelineSectionMobile.css";

gsap.registerPlugin(ScrollTrigger);

const GLITCH_CHARS = "!<>-_\\/[]{}=+*^?#01";

export default function TimelineSectionMobile({ sections = [] }) {
  const sectionRef = useRef(null);
  const glowLineRef = useRef(null);
  const groupRefs = useRef({});
  const tabBtnRefs = useRef({});

  const [activeTab, setActiveTab] = useState("ongoing");
  const [displayTitle, setDisplayTitle] = useState("Ongoing Projects");
  const [isGlitching, setIsGlitching] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, ready: false });

  const activeTabRef = useRef("ongoing");

  const updateMobilePill = () => {
    const btn = tabBtnRefs.current[activeTab];
    if (btn) {
      setPillStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        ready: true,
      });
    }
  };

  useLayoutEffect(() => {
    updateMobilePill();
  }, [activeTab]);

  useEffect(() => {
    window.addEventListener("resize", updateMobilePill);
    return () => window.removeEventListener("resize", updateMobilePill);
  }, [activeTab]);

  useEffect(() => {
    const secObj = sections.find((s) => s.key === activeTab);
    const targetText = secObj ? secObj.title : "Ongoing Projects";

    setIsGlitching(true);
    const state = { p: 0 };

    const tween = gsap.to(state, {
      p: 1,
      duration: 0.48,
      ease: "power2.out",
      onUpdate: () => {
        const count = Math.floor(state.p * targetText.length);
        const text =
          targetText.slice(0, count) +
          targetText
            .slice(count)
            .split("")
            .map((ch) =>
              ch === " "
                ? " "
                : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            )
            .join("");
        setDisplayTitle(text);
      },
      onComplete: () => {
        setDisplayTitle(targetText);
        setIsGlitching(false);
      },
    });

    return () => tween.kill();
  }, [activeTab, sections]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(max-width: 768px)",
      () => {
        if (glowLineRef.current) {
          gsap.fromTo(
            glowLineRef.current,
            { height: "0%" },
            {
              height: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: ".iclub-tlm-track",
                start: "top 58%",
                end: "bottom 75%",
                scrub: 0.5,
              },
            }
          );
        }

        sections.forEach((sec) => {
          const groupEl = groupRefs.current[sec.key];
          if (!groupEl) return;

          ScrollTrigger.create({
            trigger: groupEl,
            start: "top 52%",
            end: "bottom 52%",
            onEnter: () => {
              if (activeTabRef.current !== sec.key) {
                activeTabRef.current = sec.key;
                setActiveTab(sec.key);
              }
            },
            onEnterBack: () => {
              if (activeTabRef.current !== sec.key) {
                activeTabRef.current = sec.key;
                setActiveTab(sec.key);
              }
            },
          });
        });

        const items = gsap.utils.toArray(".iclub-tlm-item");
        items.forEach((item) => {
          const dot = item.querySelector(".iclub-tlm-node-dot");
          const branch = item.querySelector(".iclub-tlm-branch-line");
          const year = item.querySelector(".iclub-tlm-year");
          const mediaCard = item.querySelector(".iclub-tlm-media-card");
          const connector = item.querySelector(".iclub-tlm-desc-connector");
          const descBox = item.querySelector(".iclub-tlm-desc-box");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              end: "top 45%",
              toggleActions: "play none none reverse",
            },
          });

          tl.to(dot, {
            scale: 1,
            duration: 0.25,
            ease: "back.out(2.5)",
          })
            .to(
              branch,
              {
                scaleX: 1,
                duration: 0.25,
                ease: "power2.out",
              },
              "-=0.1"
            )
            .to(
              year,
              {
                opacity: 1,
                x: 0,
                duration: 0.3,
                ease: "power2.out",
              },
              "-=0.15"
            )
            .to(
              mediaCard,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.5)",
              },
              "-=0.2"
            )
            .to(
              connector,
              {
                scaleY: 1,
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
              },
              "-=0.2"
            )
            .to(
              descBox,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.38,
                ease: "back.out(1.4)",
              },
              "-=0.15"
            );
        });
      },
      sectionRef
    );

    return () => mm.revert();
  }, [sections]);

  const handleMobileTabClick = (key) => {
    setActiveTab(key);
    activeTabRef.current = key;
    const targetEl = groupRefs.current[key];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToContact = () => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="iclub-tlm-wrapper" ref={sectionRef}>
      <div className="iclub-tlm-sticky-hud">
        <div className="iclub-tlm-header">
          <div className="iclub-tlm-header-left">
            <div className="iclub-tlm-pill-badge">
              <span className="iclub-tlm-dot"></span> TIMELINE
            </div>
            <h2
              className={`iclub-tlm-main-title ${
                isGlitching ? "tlm-glitch" : ""
              }`}
              data-text={displayTitle}
            >
              {displayTitle}
            </h2>
          </div>

          <div className="iclub-tlm-header-right">
            <span className="iclub-tlm-outline-title">Era of</span>
            <span className="iclub-tlm-solid-title">iClub</span>
          </div>
        </div>

        <div className="iclub-tlm-nav-dock">
          <span
            className={`iclub-tlm-nav-pill pill-mood-${activeTab} ${
              pillStyle.ready ? "ready" : ""
            }`}
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
            }}
          />
          {sections.map((sec) => (
            <button
              key={sec.key}
              ref={(el) => (tabBtnRefs.current[sec.key] = el)}
              type="button"
              className={`iclub-tlm-switch-btn ${
                activeTab === sec.key ? "active" : ""
              }`}
              onClick={() => handleMobileTabClick(sec.key)}
            >
              {sec.buttonLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="iclub-tlm-track">
        <div className="iclub-tlm-line-base"></div>
        <div className="iclub-tlm-line-glow" ref={glowLineRef}></div>

        {sections.map((sec) => (
          <div
            key={sec.key}
            ref={(el) => (groupRefs.current[sec.key] = el)}
            className={`iclub-tlm-section-group group-${sec.key}`}
          >
            <div className="iclub-tlm-phase-divider">
              <span className="iclub-tlm-phase-diamond"></span>
              <span className="iclub-tlm-phase-tag">
                {sec.badge} • {sec.title}
              </span>
            </div>

            {sec.items.map((item, idx) => (
              <div className="iclub-tlm-item" key={item.id}>
                <div className={`iclub-tlm-node-dot dot-${sec.key}`}></div>
                <div className="iclub-tlm-branch-line"></div>

                <div className="iclub-tlm-content">
                  <div className="iclub-tlm-year-row">
                    <span className="iclub-tlm-year">{item.year}</span>
                    <span className="iclub-tlm-step-badge">
                      {String(idx + 1).padStart(2, "0")} /{" "}
                      {String(sec.items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="iclub-tlm-media-card">
                    <div className="iclub-tlm-portal-glow"></div>
                    <div className="iclub-tlm-img-box">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className="iclub-tlm-card-info">
                        <h4>{item.title}</h4>
                        <p>{item.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="iclub-tlm-desc-connector"></div>

                  <div className="iclub-tlm-desc-box">
                    <div className="iclub-tlm-desc-tag">
                      <span className="iclub-tlm-desc-bullet"></span>
                      <span className="iclub-tlm-highlight">
                        {item.highlight}
                      </span>
                    </div>
                    <p className="iclub-tlm-desc-text">
                      <strong className="iclub-tlm-navy-text">
                        {item.title}:{" "}
                      </strong>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="iclub-tlm-end-node" onClick={scrollToContact}>
          <div className="iclub-tlm-end-dot"></div>
          <div className="iclub-tlm-end-btn">
            <span>SCROLL TO CONTACT</span>
            <div className="iclub-tlm-arrow-icon">&#8595;</div>
          </div>
        </div>
      </div>
    </section>
  );
}