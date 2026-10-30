import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TimelineSectionMobile.css";

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSectionMobile({ data = [] }) {
  const sectionRef = useRef(null);
  const glowLineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (glowLineRef.current && sectionRef.current) {
        gsap.fromTo(
          glowLineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: ".iclub-tlm-track",
              start: "top 55%",
              end: "bottom 75%",
              scrub: 0.5,
            },
          }
        );
      }

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="iclub-tlm-wrapper" ref={sectionRef} id="timeline">
      <div className="iclub-tlm-header">
        <div className="iclub-tlm-header-left">
          <div className="iclub-tlm-pill-badge">
            <span className="iclub-tlm-dot"></span> TIMELINE
          </div>
          <h2 className="iclub-tlm-main-title">Milestones</h2>
        </div>

        <div className="iclub-tlm-header-right">
          <span className="iclub-tlm-outline-title">Era of</span>
          <span className="iclub-tlm-solid-title">iClub</span>
        </div>
      </div>

      <div className="iclub-tlm-track">
        <div className="iclub-tlm-line-base"></div>
        <div className="iclub-tlm-line-glow" ref={glowLineRef}></div>

        {data.map((item, idx) => (
          <div className="iclub-tlm-item" key={item.id}>
            <div className="iclub-tlm-node-dot"></div>
            <div className="iclub-tlm-branch-line"></div>

            <div className="iclub-tlm-content">
              <div className="iclub-tlm-year-row">
                <span className="iclub-tlm-year">{item.year}</span>
                <span className="iclub-tlm-step-badge">
                  {String(idx + 1).padStart(2, "0")} /{" "}
                  {String(data.length).padStart(2, "0")}
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
                  <span className="iclub-tlm-highlight">{item.highlight}</span>
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